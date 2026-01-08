import { createFileRoute, Link, Outlet, useParams } from '@tanstack/react-router'
import { useChapters } from '@/features/manuscripts/hooks'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/manuscripts/$manuscriptId/chapters/$chapterId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { workspaceId, manuscriptId, chapterId } = useParams({
    from: '/_authenticated/workspaces/$workspaceId/manuscripts/$manuscriptId/chapters/$chapterId'
  })

  const { data: chapters } = useChapters(manuscriptId!)
  const chapter = chapters?.find(c => c.id === chapterId)

  return (
    <>
      <div className='mb-4'>
        <Button variant='ghost' size='sm' className='gap-1' asChild>
          <Link
            to='/workspaces/$workspaceId/manuscripts/$manuscriptId'
            params={{ workspaceId: workspaceId!, manuscriptId: manuscriptId! }}
          >
            <ChevronLeft className='h-4 w-4' />
            Back to Manuscript
          </Link>
        </Button>
      </div>

      <div className='mb-6'>
        <h1 className='text-2xl font-bold tracking-tight'>
          {chapter ? `Chapter ${chapter.order_index}: ${chapter.title}` : 'Chapter Documents'}
        </h1>
        <p className='text-muted-foreground'>
          Manage and view documents associated with this chapter.
        </p>
      </div>

      <Outlet />
    </>
  )
}
