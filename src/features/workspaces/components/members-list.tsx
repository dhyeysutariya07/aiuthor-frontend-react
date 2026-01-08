import { useState } from 'react'
import { MoreHorizontal, Plus, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { WorkspaceRole } from '../types'
import {
    useAddMember,
    useRemoveMember,
    useUpdateMemberRole,
    useWorkspaceMembers,
} from '../hooks'
import { useAllUsers } from '@/features/auth/hooks' // reusing existing hook to find users to add

interface MembersListProps {
    workspaceId: string
}

export function MembersList({ workspaceId }: MembersListProps) {
    const { data: members, isLoading } = useWorkspaceMembers(workspaceId)
    const [isAddOpen, setIsAddOpen] = useState(false)

    // For adding member
    const [selectedUser, setSelectedUser] = useState('')
    const [selectedRole, setSelectedRole] = useState<WorkspaceRole>('EDITOR')

    const addMember = useAddMember()
    const updateRole = useUpdateMemberRole()
    const removeMember = useRemoveMember()

    // Fetch all users to populate the "add member" dropdown
    // A real app might use a search input instead of loading all users
    const { data: allUsers } = useAllUsers()

    // Filter out users who are already members
    const availableUsers = allUsers?.filter(
        (u) => !members?.some((m) => m.user === u.id)
    )

    const handleAddMember = () => {
        if (!selectedUser) return
        addMember.mutate(
            {
                workspaceId,
                data: { user: selectedUser, role: selectedRole },
            },
            {
                onSuccess: () => {
                    setIsAddOpen(false)
                    setSelectedUser('')
                },
            }
        )
    }

    if (isLoading) return <div>Loading members...</div>

    return (
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <div>
                        <CardTitle>Members</CardTitle>
                        <CardDescription>
                            Manage who has access to this workspace.
                        </CardDescription>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button size='sm'>
                                <Plus className='mr-2 h-4 w-4' /> Add Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Team Member</DialogTitle>
                                <DialogDescription>
                                    Add a new member to your workspace.
                                </DialogDescription>
                            </DialogHeader>
                            <div className='grid gap-4 py-4'>
                                <div className='grid gap-2'>
                                    <Label>User</Label>
                                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select a user' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableUsers?.map((user) => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    {user.username}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='grid gap-2'>
                                    <Label>Role</Label>
                                    <Select
                                        value={selectedRole}
                                        onValueChange={(v) => setSelectedRole(v as WorkspaceRole)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='ADMIN'>Admin</SelectItem>
                                            <SelectItem value='EDITOR'>Editor</SelectItem>
                                            <SelectItem value='AUTHOR'>Author</SelectItem>
                                            <SelectItem value='MEMBER'>Member</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={handleAddMember}
                                    disabled={!selectedUser || addMember.isPending}
                                >
                                    Add Member
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    {members?.map((membership) => (
                        <div
                            key={membership.id}
                            className='flex items-center justify-between space-x-4 rounded-md border p-4'
                        >
                            <div className='flex items-center space-x-4'>
                                <Avatar>
                                    <AvatarFallback>
                                        <User className='h-4 w-4' />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className='text-sm font-medium leading-none'>
                                        {/* We need user details here. If the memberships endpoint returns nested user object, we use it. 
                        Otherwise we might need to fetch it or rely on ID.
                        The types definition I added has optional user_details. 
                        Let's assume backend structure or ID for now. 
                    */}
                                        User ID: {membership.user.substring(0, 8)}...
                                    </p>
                                    <p className='text-sm text-muted-foreground'>{membership.role}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Badge variant={membership.role === 'ADMIN' ? 'default' : 'secondary'}>
                                    {membership.role}
                                </Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant='ghost' size='sm'>
                                            <MoreHorizontal className='h-4 w-4' />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end'>
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() =>
                                                updateRole.mutate({
                                                    workspaceId,
                                                    membershipId: membership.id,
                                                    data: { role: 'ADMIN' },
                                                })
                                            }
                                        >
                                            Make Admin
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                updateRole.mutate({
                                                    workspaceId,
                                                    membershipId: membership.id,
                                                    data: { role: 'EDITOR' },
                                                })
                                            }
                                        >
                                            Make Editor
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                updateRole.mutate({
                                                    workspaceId,
                                                    membershipId: membership.id,
                                                    data: { role: 'AUTHOR' },
                                                })
                                            }
                                        >
                                            Make Author
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className='text-red-600'
                                            onClick={() =>
                                                removeMember.mutate({
                                                    workspaceId,
                                                    membershipId: membership.id,
                                                })
                                            }
                                        >
                                            Remove
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
