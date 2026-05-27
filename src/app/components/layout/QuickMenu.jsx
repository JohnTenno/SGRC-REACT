import { Link, useLocation } from 'react-router-dom'
import { isNavLinkActive, NavIcon } from '@/app/components/layout/navConfig'

const QUICK_MENU_LINKS = [
  { to: '/my-reservations', label: 'Mis reservas', icon: 'reservations', end: true },
  { to: '/my-equipment-requests', label: 'Mi equipo', icon: 'my-equipment', end: true },
]

const quickLinkClass =
  'font-praxis flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:border-uach-gold-400/50 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uach-gold-400 sm:px-4 sm:py-4 sm:text-base'

function QuickMenuLink({ to, label, icon, end, prefix }) {
  const { pathname } = useLocation()
  const active = isNavLinkActive(pathname, { to, end, prefix })

  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`${quickLinkClass}${active ? ' border-uach-gold-400/60 bg-white/20' : ''}`}
    >
      <NavIcon name={icon} className="size-6 shrink-0" />
      <span>{label}</span>
    </Link>
  )
}

export function QuickMenu() {
  return (
    <nav
      className="flex w-full max-w-4xl flex-col gap-3"
      aria-label="Menú rápido"
    >
      <p className="font-alverata text-lg font-semibold uppercase tracking-wide text-uach-gold-400 sm:text-xl">
        Menú rápido
      </p>
      <ul className="grid w-full grid-cols-2 gap-3">
        {QUICK_MENU_LINKS.map((item) => (
          <li key={item.to} className="min-w-0">
            <QuickMenuLink {...item} />
          </li>
        ))}
      </ul>
    </nav>
  )
}
