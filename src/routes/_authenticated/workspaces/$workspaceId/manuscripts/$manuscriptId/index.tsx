import { createFileRoute, useParams } from '@tanstack/react-router'
import { ChapterList } from '@/features/manuscripts/components/chapter-list'

export const Route = createFileRoute(
    '/_authenticated/workspaces/$workspaceId/manuscripts/$manuscriptId/',
)({
    component: RouteComponent,
})

function RouteComponent() {
    const { manuscriptId } = useParams({ from: '/_authenticated/workspaces/$workspaceId/manuscripts/$manuscriptId/' })

    return <ChapterList manuscriptId={manuscriptId!} />
}
