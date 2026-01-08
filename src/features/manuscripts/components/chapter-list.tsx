import { MoreVertical, Trash2, Edit, GripVertical, FileCode } from 'lucide-react'
import { Link, useParams } from '@tanstack/react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useChapters, useRemoveChapter } from '../hooks'
import { CreateChapterDialog } from './create-chapter-dialog'

interface ChapterListProps {
    manuscriptId: string
}

export function ChapterList({ manuscriptId }: ChapterListProps) {
    const { workspaceId } = useParams({ strict: false }) as { workspaceId: string }
    const { data: chapters, isLoading } = useChapters(manuscriptId)
    const { mutate: removeChapter } = useRemoveChapter()

    if (isLoading) {
        return (
            <div className='space-y-3'>
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className='h-16 w-full' />
                ))}
            </div>
        )
    }

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium'>Chapters</h3>
                <CreateChapterDialog manuscriptId={manuscriptId} />
            </div>

            <div className='space-y-2'>
                {chapters?.map((chapter) => (
                    <div
                        key={chapter.id}
                        className='flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm group'
                    >
                        <div className='flex items-center gap-3'>
                            <GripVertical className='h-4 w-4 text-muted-foreground cursor-grab opacity-0 group-hover:opacity-100' />
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold'>
                                {chapter.order_index}
                            </div>
                            <div>
                                <h4 className='font-semibold leading-none'>{chapter.title}</h4>
                                <p className='text-xs text-muted-foreground mt-1'>
                                    Last updated: {new Date(chapter.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Button variant='ghost' size='sm' className='gap-1 text-xs' asChild>
                                <Link
                                    to='/workspaces/$workspaceId/manuscripts/$manuscriptId/chapters/$chapterId'
                                    params={{
                                        workspaceId: workspaceId!,
                                        manuscriptId: manuscriptId,
                                        chapterId: chapter.id,
                                    }}
                                >
                                    <FileCode className='h-3 w-3' />
                                    View Documents
                                </Link>
                            </Button>
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
                                        onClick={() => removeChapter({ manuscriptId, chapterId: chapter.id })}
                                    >
                                        <Trash2 className='mr-2 h-4 w-4' />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
                {chapters?.length === 0 && (
                    <div className='text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg'>
                        No chapters found. Add your first chapter.
                    </div>
                )}
            </div>
        </div>
    )
}
