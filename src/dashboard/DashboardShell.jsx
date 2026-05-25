import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DashboardBottomNav } from '@/dashboard/components/DashboardBottomNav'
import { DashboardHeader } from '@/dashboard/components/DashboardHeader'
import { DashboardSidebar } from '@/dashboard/components/DashboardSidebar'

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
    <div className="dashboard-shell flex min-h-[100dvh] min-h-screen flex-col bg-uach-purple-950 md:flex-row">
      <div className="hidden min-h-[100dvh] min-h-screen shrink-0 md:block">
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((value) => !value)}
        />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white pb-[4.75rem] md:min-h-screen md:pb-0">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-5 sm:p-8">
          <Outlet />
        </main>
      </div>

      <DashboardBottomNav />
    </div>
  )
}
