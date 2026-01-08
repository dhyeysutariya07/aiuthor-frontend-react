import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/workspaces/$workspaceId/manuscripts/$manuscriptId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
