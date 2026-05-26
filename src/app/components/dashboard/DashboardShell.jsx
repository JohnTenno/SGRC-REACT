import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DashboardBottomNav } from '@/app/components/dashboard/DashboardBottomNav'
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader'
import { DashboardSidebar } from '@/app/components/dashboard/DashboardSidebar'

export function DashboardShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('dashboard-admin-canvas')
    document.body.classList.add('dashboard-admin-canvas')
    return () => {
      document.documentElement.classList.remove('dashboard-admin-canvas')
      document.body.classList.remove('dashboard-admin-canvas')
    }
  }, [])

  return (
    <div className="dashboard-shell flex min-h-[100dvh] min-h-screen flex-col bg-uach-purple-950 md:h-[100dvh] md:max-h-[100dvh] md:flex-row md:overflow-hidden">
      <div className="hidden h-[100dvh] max-h-[100dvh] shrink-0 grow-0 overflow-hidden md:block">
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((value) => !value)}
        />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white pb-[4.75rem] md:h-[100dvh] md:pb-0">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-5 sm:p-8">
          <Outlet />
        </main>
      </div>

      <DashboardBottomNav />
    </div>
  )
}
