import { Link, useLocation } from 'react-router-dom'
import { getDashboardBottomNavItems } from '@/app/components/dashboard/menuItems'
import { isNavLinkActive, NavIcon } from '@/app/components/layout/navConfig'

function BottomNavItem({ to, shortLabel, icon, end, prefix }) {
  const { pathname } = useLocation()
  const active = isNavLinkActive(pathname, { to, end, prefix })

  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 transition ${
        active ? 'text-uach-gold-400' : 'text-white/65 hover:text-white'
      }`}
    >
      <span
        className={`flex size-9 items-center justify-center rounded-xl transition ${
          active ? 'bg-uach-gold-500/20' : ''
        }`}
      >
        <NavIcon name={icon} className="size-5 shrink-0" />
      </span>
      <span className="font-praxis max-w-full truncate text-[0.625rem] font-medium leading-tight">
        {shortLabel}
      </span>
    </Link>
  )
}

export function DashboardBottomNav() {
  const menuItems = getDashboardBottomNavItems()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-uach-purple-950 pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Menú del dashboard"
    >
      <div className="flex items-stretch justify-around px-1 pt-1">
        {menuItems.map((item) => (
          <BottomNavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  )
}
