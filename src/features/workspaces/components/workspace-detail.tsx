import { useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useWorkspace, useWorkspacePermissions, useDeleteWorkspace } from '../hooks'
import { MembersList } from './members-list'
import { ManuscriptList } from '@/features/manuscripts/components/manuscript-list'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'

export function WorkspaceDetail() {
    const { workspaceId } = useParams({ from: '/_authenticated/workspaces/$workspaceId/' })
    const navigate = useNavigate()
    const { data: workspace, isLoading } = useWorkspace(workspaceId)
    const { isAdmin } = useWorkspacePermissions(workspaceId)
    const deleteWorkspace = useDeleteWorkspace()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleDelete = () => {
        deleteWorkspace.mutate(workspaceId, {
            onSuccess: () => {
                setShowDeleteDialog(false)
                navigate({ to: '/workspaces', replace: true })
            },
        })
    }

    if (isLoading) {
        return (
            <div className='space-y-6'>
                <Skeleton className='h-10 w-1/3' />
                <Skeleton className='h-64 w-full' />
            </div>
        )
    }

    if (!workspace) {
        return <div>Workspace not found</div>
    }

    return (
        <div className='flex flex-col space-y-6'>
            <div>
                <h2 className='text-3xl font-bold tracking-tight'>{workspace.name}</h2>
                <p className='text-muted-foreground'>
                    Manage your manuscripts and team members.
                </p>
            </div>

            <Tabs defaultValue='manuscripts' className='space-y-4'>
                <TabsList>
                    <TabsTrigger value='manuscripts'>Manuscripts</TabsTrigger>
                    <TabsTrigger value='members'>Members</TabsTrigger>
                    {isAdmin && <TabsTrigger value='settings'>Settings</TabsTrigger>}
                </TabsList>
                <TabsContent value='manuscripts' className='space-y-4'>
                    <ManuscriptList workspaceId={workspaceId} />
                </TabsContent>
                <TabsContent value='members' className='space-y-4'>
                    <MembersList workspaceId={workspaceId} />
                </TabsContent>
                {isAdmin && (
                    <TabsContent value='settings' className='space-y-4'>
                        <Card className='border-destructive/50'>
                            <CardHeader>
                                <CardTitle className='text-destructive'>Danger Zone</CardTitle>
                                <CardDescription>
                                    Irreversible actions for this workspace.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='flex items-center justify-between gap-4 rounded-lg border border-destructive/20 p-4'>
                                    <div className='space-y-0.5'>
                                        <h4 className='font-medium'>Delete Workspace</h4>
                                        <p className='text-sm text-muted-foreground'>
                                            Once you delete a workspace, there is no going back. Please be certain.
                                        </p>
                                    </div>
                                    <Button
                                        variant='destructive'
                                        onClick={() => setShowDeleteDialog(true)}
                                        disabled={deleteWorkspace.isPending}
                                    >
                                        <Trash2 className='mr-2 h-4 w-4' />
                                        Delete Workspace
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the
                                        workspace <strong>{workspace.name}</strong> and all manuscripts associated with it.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                    >
                                        {deleteWorkspace.isPending ? 'Deleting...' : 'Yes, Delete Workspace'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}
