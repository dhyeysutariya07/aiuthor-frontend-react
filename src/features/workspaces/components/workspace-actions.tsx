import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Workspace } from '../types'
import { useDeleteWorkspace, useUpdateWorkspace } from '../hooks'
import { MembersList } from './members-list'

interface WorkspaceActionsProps {
    workspace: Workspace
}

export function WorkspaceActions({ workspace }: WorkspaceActionsProps) {
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showMembersDialog, setShowMembersDialog] = useState(false)
    const [newName, setNewName] = useState(workspace.name)

    const updateWorkspace = useUpdateWorkspace()
    const deleteWorkspace = useDeleteWorkspace()

    const handleUpdate = () => {
        updateWorkspace.mutate(
            { id: workspace.id, data: { name: newName } },
            {
                onSuccess: () => setShowEditDialog(false),
            }
        )
    }

    const handleDelete = () => {
        deleteWorkspace.mutate(workspace.id, {
            onSuccess: () => setShowDeleteDialog(false),
        })
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                        <Pencil className='mr-2 h-4 w-4' /> Edit Name
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowMembersDialog(true)}>
                        <Users className='mr-2 h-4 w-4' /> Manage Members
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className='text-red-600'
                    >
                        <Trash className='mr-2 h-4 w-4' /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Workspace</DialogTitle>
                        <DialogDescription>
                            Make changes to your workspace here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='name' className='text-right'>
                                Name
                            </Label>
                            <Input
                                id='name'
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className='col-span-3'
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type='submit'
                            onClick={handleUpdate}
                            disabled={updateWorkspace.isPending}
                        >
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
                <DialogContent className='max-w-3xl'>
                    <DialogHeader>
                        <DialogTitle>Manage Members</DialogTitle>
                        <DialogDescription>
                            Add or remove members from {workspace.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='py-4'>
                        <MembersList workspaceId={workspace.id} />
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            workspace and all manuscripts associated with it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className='bg-red-600 hover:bg-red-700'
                        >
                            {deleteWorkspace.isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
