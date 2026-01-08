import { Link } from '@tanstack/react-router'
import { MoreVertical, FileText, Trash2, Edit } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useManuscripts, useDeleteManuscript } from '../hooks'
import { CreateManuscriptDialog } from './create-manuscript-dialog'
import { Badge } from '@/components/ui/badge'

interface ManuscriptListProps {
    workspaceId: string
}

export function ManuscriptList({ workspaceId }: ManuscriptListProps) {
    const { data: manuscripts, isLoading, error } = useManuscripts(workspaceId)

    const { mutate: deleteManuscript } = useDeleteManuscript()

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
        return (
            <div className='flex h-32 items-center justify-center text-destructive'>
                Error loading manuscripts. Please try again later.
            </div>
        )
    }

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium'>Manuscripts</h3>
                <CreateManuscriptDialog workspaceId={workspaceId} />
            </div>

            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {manuscripts?.map((manuscript) => (
                    <Card key={manuscript.id} className='relative group'>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <Link
                                    to='/workspaces/$workspaceId/manuscripts/$manuscriptId'
                                    params={{ workspaceId, manuscriptId: manuscript.id }}
                                    className='hover:underline flex items-center gap-2'
                                >
                                    <FileText className='h-4 w-4 text-muted-foreground' />
                                    <CardTitle className='text-base'>{manuscript.title}</CardTitle>
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                                            <MoreVertical className='h-4 w-4' />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end'>
                                        <DropdownMenuItem>
                                            <Edit className='mr-2 h-4 w-4' />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className='text-destructive'
                                            onClick={() => deleteManuscript({ id: manuscript.id, workspaceId })}
                                        >
                                            <Trash2 className='mr-2 h-4 w-4' />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <CardDescription className='line-clamp-2'>
                                {manuscript.description || 'No description provided.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Badge variant={manuscript.status === 'published' ? 'default' : 'secondary'}>
                                {manuscript.status}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
                {manuscripts?.length === 0 && (
                    <div className='col-span-full text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg'>
                        No manuscripts found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
