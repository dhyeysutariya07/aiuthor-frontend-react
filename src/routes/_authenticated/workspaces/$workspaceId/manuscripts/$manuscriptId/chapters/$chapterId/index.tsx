import { createFileRoute } from '@tanstack/react-router'
import { DocumentList } from '@/features/manuscripts/components/document-list'

export const Route = createFileRoute(
    '/_authenticated/workspaces/$workspaceId/manuscripts/$manuscriptId/chapters/$chapterId/',
)({
    component: RouteComponent,
})

function RouteComponent() {
    return <DocumentList />
}
