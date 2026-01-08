import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

interface OnlyOfficeEditorProps {
    config: any
    onError?: (error: Error) => void
}

declare global {
    interface Window {
        DocsAPI?: {
            DocEditor: new (id: string, config: any) => any
        }
    }
}

export function OnlyOfficeEditor({ config, onError }: OnlyOfficeEditorProps) {
    const editorRef = useRef<any>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    console.log('OnlyOfficeEditor component rendered with config:', config)
    console.log('Container ref:', containerRef.current)
    console.log('window.DocsAPI available:', !!window.DocsAPI)

    useEffect(() => {
        console.log('useEffect triggered')
        console.log('Config:', config)
        console.log('Container:', containerRef.current)

        if (!config || !containerRef.current) {
            console.log('Missing config or container, returning early')
            return
        }

        let retryCount = 0
        const maxRetries = 50 // 5 seconds max

        // Wait for DocsAPI to be available
        const initEditor = () => {
            console.log('initEditor called, checking for DocsAPI...')
            if (window.DocsAPI) {
                console.log('DocsAPI found! Initializing editor...')
                try {
                    editorRef.current = new window.DocsAPI.DocEditor('onlyoffice-editor', config)
                    console.log('Editor initialized successfully:', editorRef.current)
                } catch (error) {
                    console.error('Failed to initialize OnlyOffice editor:', error)
                    onError?.(error as Error)
                }
            } else {
                retryCount++
                if (retryCount >= maxRetries) {
                    const error = new Error('OnlyOffice Document Server API script failed to load. Please check if the server is running at http://localhost:8000')
                    console.error(error.message)
                    onError?.(error)
                    return
                }
                console.log(`DocsAPI not yet available, retrying in 100ms... (${retryCount}/${maxRetries})`)
                // Retry after a short delay if DocsAPI is not yet loaded
                setTimeout(initEditor, 100)
            }
        }

        initEditor()

        // Cleanup on unmount
        return () => {
            console.log('Cleaning up editor')
            if (editorRef.current) {
                try {
                    editorRef.current.destroyEditor()
                } catch (error) {
                    console.error('Error destroying editor:', error)
                }
            }
        }
    }, [config, onError])

    if (!config) {
        console.log('Rendering loading state - no config')
        return (
            <div className='flex h-screen items-center justify-center'>
                <div className='flex flex-col items-center gap-2'>
                    <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                    <p className='text-sm text-muted-foreground'>Loading editor configuration...</p>
                </div>
            </div>
        )
    }

    console.log('Rendering editor container')

    return (
        <div
            id='onlyoffice-editor'
            ref={containerRef}
            className='h-screen w-full'
        />
    )
}
