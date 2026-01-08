import { createFileRoute } from '@tanstack/react-router'
import { WorkspaceDetail } from '@/features/workspaces/components/workspace-detail'

export const Route = createFileRoute('/_authenticated/workspaces/$workspaceId/')({
  component: WorkspaceDetail,
})
