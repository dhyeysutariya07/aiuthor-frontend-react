import { useParams } from '@tanstack/react-router'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useWorkspace } from '../hooks'
import { MembersList } from './members-list'
import { ManuscriptList } from '@/features/manuscripts/components/manuscript-list'

export function WorkspaceDetail() {
    const { workspaceId } = useParams({ from: '/_authenticated/workspaces/$workspaceId/' })
    const { data: workspace, isLoading } = useWorkspace(workspaceId)

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
                    <TabsTrigger value='settings'>Settings</TabsTrigger>
                </TabsList>
                <TabsContent value='manuscripts' className='space-y-4'>
                    <ManuscriptList workspaceId={workspaceId} />
                </TabsContent>
                <TabsContent value='members' className='space-y-4'>
                    <MembersList workspaceId={workspaceId} />
                </TabsContent>
                <TabsContent value='settings' className='space-y-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Workspace Settings</CardTitle>
                            <CardDescription>
                                Update your workspace name or delete the workspace.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm text-muted-foreground'>
                                Settings are available in the workspace list actions menu for now.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
