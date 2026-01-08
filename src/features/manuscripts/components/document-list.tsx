import { FileText } from 'lucide-react'
import { useParams } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useChapterDocuments } from '../hooks'
import { ChapterDocument } from '../types'

export function DocumentList() {
    const { manuscriptId, chapterId } = useParams({ strict: false }) as { manuscriptId: string; chapterId: string }

    const { data: documents, isLoading, error } = useChapterDocuments(manuscriptId!, chapterId!)

    if (isLoading) {
        return (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className='h-32 w-full' />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex h-32 items-center justify-center text-destructive'>
                Failed to load documents for this chapter.
            </div>
        )
    }

    if (!documents || documents.length === 0) {
        return (
            <Card className='flex h-48 flex-col items-center justify-center border-dashed text-center'>
                <CardContent className='pt-6'>
                    <FileText className='mx-auto h-12 w-12 text-muted-foreground' />
                    <p className='mt-2 text-muted-foreground'>No documents found for this chapter.</p>
                    <Button variant='outline' className='mt-4' disabled>
                        Upload Document (Coming Soon)
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {documents.map((doc: ChapterDocument) => (
                <Card key={doc.id}>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-sm font-medium'>Document</CardTitle>
                        <CardDescription className='truncate'>{doc.file}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='flex items-center gap-2'>
                            <FileText className='h-4 w-4 text-blue-500' />
                            <span className='text-xs text-muted-foreground'>
                                Version: {doc.current_version.split('-')[0]}...
                            </span>
                        </div>
                        <Button variant='link' className='mt-2 h-auto p-0 text-xs' asChild>
                            <a href={doc.file} target='_blank' rel='noopener noreferrer'>
                                Download File
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
