import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IconChevronLeft, IconSearch } from '@/components/icons'
import { getDashboardMenuItems } from '@/dashboard/menuItems'
import { isNavLinkActive, NavIcon } from '@/components/layout/navConfig'
import escudoUach from '@/assets/escudo-color.png'

function SidebarToggleIcon({ collapsed }) {
  return (
    <IconChevronLeft
      className={`size-5 transition-transform ${collapsed ? 'rotate-180' : ''}`}
      aria-hidden
    />
  )
}

function SidebarNavItem({ to, label, icon, end, prefix, collapsed, nested = false }) {
  const { pathname } = useLocation()
  const active = isNavLinkActive(pathname, { to, end, prefix })

  return (
    <Link
      to={to}
      title={collapsed ? label : undefined}
      aria-current={active ? 'page' : undefined}
      className={`group flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition ${
        nested && !collapsed ? 'pl-9 pr-3' : 'px-3'
      } ${
        active
          ? 'bg-white/12 text-white shadow-sm ring-1 ring-white/10'
          : 'text-white/70 hover:bg-white/8 hover:text-white'
      } ${collapsed ? 'justify-center px-2' : ''}`}
    >
      {!nested || collapsed ? (
        <span
          className={`flex shrink-0 items-center justify-center rounded-lg transition ${
            collapsed ? 'size-10' : 'size-9'
          } ${active ? 'bg-uach-gold-500/20 text-uach-gold-400' : 'text-white/85 group-hover:text-white'}`}
        >
          <NavIcon name={icon} className="size-5 shrink-0" />
        </span>
      ) : (
        <span
          className={`size-2 shrink-0 rounded-full ${
            active ? 'bg-uach-gold-400' : 'bg-white/35 group-hover:bg-white/55'
          }`}
          aria-hidden
        />
      )}
      {!collapsed ? <span className="font-praxis truncate">{label}</span> : null}
    </Link>
  )
}

function SidebarNavGroup({ item, collapsed, pathname }) {
  const isGroupActive = pathname.startsWith(item.prefix)
  const [isOpen, setIsOpen] = useState(isGroupActive)

  if (collapsed) {
    return (
      <SidebarNavItem
        to={item.children[0].to}
        label={item.label}
        icon={item.icon}
        prefix={item.prefix}
        collapsed={collapsed}
      />
    )
  }

  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`font-praxis flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
          isGroupActive ? 'text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'
        }`}
        aria-expanded={isOpen}
      >
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
            isGroupActive ? 'bg-uach-gold-500/20 text-uach-gold-400' : 'text-white/85'
          }`}
        >
          <NavIcon name={item.icon} className="size-5 shrink-0" />
        </span>
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        <IconChevronLeft
          className={`size-4 shrink-0 text-white/50 transition-transform ${isOpen ? '-rotate-90' : 'rotate-180'}`}
          aria-hidden
        />
      </button>
      {isOpen ? (
        <div className="flex flex-col gap-0.5 pb-1">
          {item.children.map((child) => (
            <SidebarNavItem
              key={child.to}
              {...child}
              icon={item.icon}
              collapsed={false}
              nested
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function itemMatchesSearch(item, query) {
  if (item.label.toLowerCase().includes(query)) return true
  if (item.children?.some((child) => child.label.toLowerCase().includes(query))) return true
  return false
}

export function DashboardSidebar({ collapsed, onToggle }) {
  const [search, setSearch] = useState('')
  const { pathname } = useLocation()
  const menuItems = useMemo(() => getDashboardMenuItems(), [])

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return menuItems
    return menuItems.filter((item) => itemMatchesSearch(item, query))
  }, [menuItems, search])

  return (
    <aside
      className={`hidden h-[100dvh] max-h-[100dvh] shrink-0 grow-0 flex-col overflow-hidden bg-uach-purple-950 text-white transition-[width] duration-300 ease-out md:flex ${
        collapsed ? 'w-[4.5rem]' : 'w-64'
      }`}
      aria-label="Menú del dashboard"
    >
      <div
        className={`flex shrink-0 flex-col gap-3 px-4 pt-5 md:pt-7 ${
          collapsed ? 'items-center px-2' : ''
        }`}
      >
        <div
          className={`flex w-full items-center gap-3 md:min-h-[3.25rem] ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <img
            src={escudoUach}
            alt="Escudo UACh"
            className="h-9 w-auto shrink-0 object-contain md:h-11"
          />
          {!collapsed ? (
            <div className="min-w-0">
              <p className="font-alverata truncate text-sm font-semibold uppercase tracking-wide text-white">
                Panel de administración
              </p>
              <p className="font-praxis truncate text-[0.65rem] text-uach-gold-400/90">
                Universidad Autónoma de Chihuahua
              </p>
            </div>
          ) : null}
        </div>

        {collapsed ? (
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-xl bg-uach-purple-900/80 p-2.5 text-white/70 transition hover:bg-uach-purple-900 hover:text-white"
            aria-label="Buscar en el menú"
            onClick={onToggle}
          >
            <IconSearch className="size-5" aria-hidden />
          </button>
        ) : (
          <label className="relative block w-full">
            <span className="sr-only">Buscar en el menú</span>
            <IconSearch
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/45"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar"
              className="font-praxis w-full rounded-xl border border-white/10 bg-uach-purple-900/70 py-2.5 pr-3 pl-10 text-sm text-white placeholder:text-white/40 transition focus:border-uach-gold-400/50 focus:outline-none focus:ring-2 focus:ring-uach-gold-400/20"
            />
          </label>
        )}

        {collapsed ? (
          <span className="text-white/35" aria-hidden="true">
            ···
          </span>
        ) : (
          <p className="w-full font-praxis text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/40">
            Menú principal
          </p>
        )}
      </div>

      <div
        className={`flex min-h-0 flex-1 flex-col bg-uach-purple-950 ${
          collapsed ? 'px-2' : 'px-4'
        }`}
      >
        <nav
          className={`flex w-full flex-1 flex-col gap-1 overflow-y-auto pb-3 ${
            collapsed ? 'items-center' : ''
          }`}
        >
          {filteredItems.map((item) =>
            item.children?.length ? (
              <SidebarNavGroup
                key={item.id}
                item={item}
                collapsed={collapsed}
                pathname={pathname}
              />
            ) : (
              <SidebarNavItem key={item.to} {...item} collapsed={collapsed} />
            ),
          )}
          {!collapsed && filteredItems.length === 0 ? (
            <p className="font-praxis py-2 text-sm text-white/50">Sin resultados</p>
          ) : null}
        </nav>
      </div>

      <div className={`shrink-0 border-t border-white/10 bg-uach-purple-950 p-3 ${collapsed ? 'px-2' : 'px-4'}`}>
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/8 hover:text-white ${
            collapsed ? 'justify-center px-2' : ''
          }`}
        >
          <SidebarToggleIcon collapsed={collapsed} />
          {!collapsed ? <span className="font-praxis">Contraer menú</span> : null}
        </button>
      </div>
    </aside>
  )
}
