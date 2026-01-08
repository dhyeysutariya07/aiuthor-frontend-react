import { createFileRoute } from '@tanstack/react-router'
import { WorkspaceList } from '@/features/workspaces'

export const Route = createFileRoute('/_authenticated/workspaces/')({
  component: WorkspaceList,
})
