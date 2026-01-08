import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'

export const Route = createFileRoute('/_authenticated/workspaces/$workspaceId')({
  component: () => (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <Outlet />
      </Main>
    </>
  ),
})
