export { NavIcon } from '@/app/components/common/icons'

export const NAV_LINKS = [
  { to: '/home', label: 'Inicio', icon: 'home', end: true },
  { to: '/cubicle-reservation', label: 'Cubículos', icon: 'cubicle', prefix: '/cubicle-reservation' },
  { to: '/equipment-rental', label: 'Equipo', icon: 'equipment', prefix: '/equipment-rental' },
  { to: '/my-reservations', label: 'Mis reservas', icon: 'reservations', end: true },
  { to: '/my-equipment-requests', label: 'Mi equipo', icon: 'my-equipment', end: true },
]

export function isNavLinkActive(pathname, { to, end, prefix }) {
  if (end) return pathname === to
  if (prefix) return pathname === to || pathname.startsWith(`${prefix}/`)
  return pathname === to || pathname.startsWith(`${to}/`)
}
