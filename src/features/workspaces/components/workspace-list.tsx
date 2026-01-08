import { Link } from '@tanstack/react-router'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useWorkspaces } from '../hooks'
import { WorkspaceActions } from './workspace-actions'
import { CreateWorkspaceDialog } from './create-workspace-dialog'

export function WorkspaceList() {
    const { data: workspaces, isLoading, error } = useWorkspaces()

    if (isLoading) {
        return (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className='h-5 w-1/2' />
                            <Skeleton className='h-4 w-3/4' />
                        </CardHeader>
                    </Card>
                ))}
            </div>
        )
    }

    if (error) {
        return <div>Error loading workspaces</div>
    }

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold tracking-tight'>Workspaces</h2>
                <CreateWorkspaceDialog />
            </div>

            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {workspaces?.map((workspace) => (
                    <Card key={workspace.id} className='relative group'>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <Link
                                    to='/workspaces/$workspaceId'
                                    params={{ workspaceId: workspace.id }}
                                    className='hover:underline'
                                >
                                    <CardTitle>{workspace.name}</CardTitle>
                                </Link>
                                <WorkspaceActions workspace={workspace} />
                            </div>
                            <CardDescription>
                                Created by user: {workspace.created_by}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
                {workspaces?.length === 0 && (
                    <div className='col-span-full text-center text-muted-foreground py-10'>
                        No workspaces found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
