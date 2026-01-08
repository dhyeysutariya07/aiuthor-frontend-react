import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { OnlyOfficeEditor } from '@/components/onlyoffice-editor'
import { useDocumentEditorConfig } from '@/features/manuscripts/hooks'
import { Button } from '@/components/ui/button'
import { ChevronLeft, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/manuscripts/$manuscriptId/chapters/$chapterId/$documentId/edit',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { workspaceId, manuscriptId, chapterId, documentId } = useParams({
    from: '/_authenticated/workspaces/$workspaceId/manuscripts/$manuscriptId/chapters/$chapterId/$documentId/edit'
  })

  console.log('Editor Route - documentId:', documentId)

  const { data: editorConfig, isLoading, error } = useDocumentEditorConfig(documentId!)

  console.log('Editor Config:', { editorConfig, isLoading, error })
  console.log('Editor Config Data:', JSON.stringify(editorConfig, null, 2))

  if (isLoading) {
    console.log('Rendering loading state')
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
          <p className='text-sm text-muted-foreground'>Loading editor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto p-6'>
        <div className='mb-4'>
          <Button variant='ghost' size='sm' className='gap-1' asChild>
            <Link
              to='/workspaces/$workspaceId/manuscripts/$manuscriptId/chapters/$chapterId'
              params={{ workspaceId: workspaceId!, manuscriptId: manuscriptId!, chapterId: chapterId! }}
            >
              <ChevronLeft className='h-4 w-4' />
              Back to Documents
            </Link>
          </Button>
        </div>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load the document editor. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  console.log('Rendering editor with config:', editorConfig)

  return (
    <div className='relative h-screen w-full'>
      <div className='absolute left-4 top-4 z-10'>
        <Button variant='secondary' size='sm' className='gap-1 shadow-md' asChild>
          <Link
            to='/workspaces/$workspaceId/manuscripts/$manuscriptId/chapters/$chapterId'
            params={{ workspaceId: workspaceId!, manuscriptId: manuscriptId!, chapterId: chapterId! }}
          >
            <ChevronLeft className='h-4 w-4' />
            Back to Documents
          </Link>
        </Button>
      </div>
      <OnlyOfficeEditor
        config={editorConfig}
        onError={(error) => {
          console.error('OnlyOffice Editor Error:', error)
        }}
      />
    </div>
  )
}
