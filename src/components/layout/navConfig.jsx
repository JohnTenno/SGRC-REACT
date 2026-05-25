export const NAV_LINKS = [
  { to: '/home', label: 'Inicio', icon: 'home', end: true },
  { to: '/cubicle-reservation', label: 'Cubículos', icon: 'cubicle', prefix: '/cubicle-reservation' },
  { to: '/equipment-rental', label: 'Equipo', icon: 'equipment', prefix: '/equipment-rental' },
  { to: '/professor-tutoring', label: 'Tutorías', icon: 'tutoring', prefix: '/professor-tutoring' },
  { to: '/my-tutorings', label: 'Mis tutorías', icon: 'my-tutorings', end: true },
  { to: '/my-reservations', label: 'Mis reservas', icon: 'reservations', end: true },
]

export function isNavLinkActive(pathname, { to, end, prefix }) {
  if (end) return pathname === to
  if (prefix) return pathname === to || pathname.startsWith(`${prefix}/`)
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function NavIcon({ name, className = 'size-5 shrink-0' }) {
  const svgProps = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  switch (name) {
    case 'home':
      return (
        <svg {...svgProps}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V20h14V9.5" />
        </svg>
      )
    case 'cubicle':
      return (
        <svg {...svgProps}>
          <path d="M4 20V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
          <path d="M4 20h16" />
          <path d="M9 10h.01M9 14h.01M15 10h.01M15 14h.01" />
        </svg>
      )
    case 'equipment':
      return (
        <svg {...svgProps}>
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <path d="M8 20h8" />
        </svg>
      )
    case 'tutoring':
      return (
        <svg {...svgProps}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
        </svg>
      )
    case 'my-tutorings':
      return (
        <svg {...svgProps}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <path d="M8 7h8M8 11h8" />
        </svg>
      )
    case 'reservations':
      return (
        <svg {...svgProps}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 11h18" />
        </svg>
      )
    default:
      return null
  }
}
