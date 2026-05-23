import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearAuthSession, getAuthSession } from '@/lib/authSession'
import escudoUach from '@/assets/escudo-color.png'

const NAV_LINKS = [
  { to: '/home', label: 'Inicio', icon: 'home', end: true },
  { to: '/cubicle-reservation', label: 'Cubículos', icon: 'cubicle', prefix: '/cubicle-reservation' },
  { to: '/equipment-rental', label: 'Equipo', icon: 'equipment', prefix: '/equipment-rental' },
  { to: '/professor-tutoring', label: 'Tutorías', icon: 'tutoring', prefix: '/professor-tutoring' },
  { to: '/my-tutorings', label: 'Mis tutorías', icon: 'my-tutorings', end: true },
  { to: '/my-reservations', label: 'Mis reservas', icon: 'reservations', end: true },
]

const navLinkClass =
  'font-praxis inline-flex items-center justify-center gap-2.5 rounded-md px-4 py-3.5 text-base font-medium text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uach-gold-400 lg:text-lg lg:px-5 lg:py-4'

function isNavLinkActive(pathname, { to, end, prefix }) {
  if (end) return pathname === to
  if (prefix) return pathname === to || pathname.startsWith(`${prefix}/`)
  return pathname === to || pathname.startsWith(`${to}/`)
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function ProfileInitials({ name, size = 'md' }) {
  const sizeClass =
    size === 'lg' ? 'size-20 text-lg' : 'size-10 text-sm'

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-uach-purple-700 font-alverata font-semibold text-white ring-2 ring-uach-gold-400/50 ${sizeClass}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  )
}

function UserProfileInfo({ user, avatarSize = 'md' }) {
  const isLarge = avatarSize === 'lg'

  return (
    <div className={`flex min-w-0 items-center ${isLarge ? 'gap-4' : 'gap-3'}`}>
      <ProfileInitials name={user.name} size={avatarSize} />
      <div className={`min-w-0 text-left ${!isLarge ? 'md:text-right' : ''}`}>
        <p
          className={`font-alverata font-semibold text-white ${
            isLarge ? 'text-2xl' : 'text-base sm:text-lg'
          }`}
        >
          {user.name}
        </p>
        <p
          className={`font-praxis text-uach-gold-400/90 ${
            isLarge ? 'text-xl' : 'text-sm sm:text-base'
          }`}
        >
          {user.enrollment}
        </p>
      </div>
    </div>
  )
}

function NavIcon({ name, large = false }) {
  const svgProps = {
    className: large ? 'size-5 shrink-0' : 'size-[1.125rem] shrink-0 lg:size-5',
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

function NavbarLink({ to, label, icon, end, prefix, className, onClick, largeIcon = false }) {
  const { pathname } = useLocation()
  const active = isNavLinkActive(pathname, { to, end, prefix })

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`${navLinkClass}${active ? ' bg-white/10' : ''} ${className ?? ''}`}
    >
      <NavIcon name={icon} large={largeIcon} />
      {label}
    </Link>
  )
}

function DesktopNavLinks() {
  return (
    <ul className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex lg:gap-1">
      {NAV_LINKS.map((item) => (
        <li key={item.to}>
          <NavbarLink {...item} />
        </li>
      ))}
    </ul>
  )
}

function LogoutIcon({ large = false }) {
  return (
    <svg
      className={large ? 'size-5 shrink-0' : 'size-[1.125rem] shrink-0 lg:size-5'}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  )
}

function LogoutButton({ className, onClick, largeIcon = false }) {
  const navigate = useNavigate()

  function handleLogout() {
    clearAuthSession()
    onClick?.()
    navigate('/login', { replace: true })
  }

  return (
    <button
      type="button"
      role="menuitem"
      className={className}
      onClick={handleLogout}
    >
      <LogoutIcon large={largeIcon} />
      Cerrar sesión
    </button>
  )
}

function DesktopProfileMenu({ user }) {
  return (
    <div className="hidden shrink-0 flex-col items-stretch gap-2 md:flex">
      <div className="rounded-md border border-transparent px-2 py-1.5">
        <UserProfileInfo user={user} />
      </div>
      <LogoutButton className={navLinkClass} />
    </div>
  )
}

function MobileSideMenu({ user, isOpen, onClose }) {
  return (
    <>
      <button
        type="button"
        className={`fixed inset-0 z-40 bg-uach-purple-950/60 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-label="Cerrar menú"
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
      />

      <aside
        id="navbar-mobile-menu"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-50 flex h-full w-72 max-w-[85vw] flex-col bg-uach-purple-900 shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          isOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full'
        }`}
      >
        <div className="flex items-center justify-end bg-uach-purple-950 px-4 py-4">
          <button
            type="button"
            className="rounded-md p-2 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uach-gold-400"
            aria-label="Cerrar menú"
            onClick={onClose}
          >
            <svg
              className="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex w-full flex-col items-center border-b border-white/10 bg-uach-purple-950 px-6 py-8">
          <UserProfileInfo user={user} avatarSize="lg" />
        </div>

        <nav
          className="flex flex-1 flex-col items-stretch gap-0 overflow-y-auto px-6 py-4"
          aria-label="Secciones"
        >
          {NAV_LINKS.map((item) => (
            <NavbarLink
              key={item.to}
              {...item}
              largeIcon
              className="w-full justify-start border-y border-white/10 text-lg py-4"
              onClick={onClose}
            />
          ))}
        </nav>

        <div className="mt-auto shrink-0 border-t border-white/10 bg-uach-purple-950 px-6 py-5">
          <LogoutButton
            largeIcon
            className={`${navLinkClass} w-full justify-start text-lg py-4`}
            onClick={onClose}
          />
        </div>
      </aside>
    </>
  )
}

function MenuIcon({ open }) {
  return (
    <svg
      className="size-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  )
}

export function Navbar() {
  const user = getAuthSession()?.user
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMenuOpen) return undefined

    function handleEscape(event) {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen])

  if (!user) return null

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-white/10 bg-uach-purple-900 shadow-md">
      <nav
        className="page-shell flex min-h-16 items-center justify-between gap-4 py-4"
        aria-label="Principal"
      >
        <Link
          to="/home"
          className="flex shrink-0 items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uach-gold-400"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={escudoUach} alt="Escudo UACh" className="h-9 w-auto" />
          <span className="font-alverata text-sm font-semibold uppercase tracking-[0.12em] text-white md:hidden">
            UACH
          </span>
          <span className="font-alverata hidden max-w-xl text-sm font-semibold uppercase leading-snug tracking-[0.06em] text-white md:block lg:text-base">
            Universidad Autónoma de Chihuahua
          </span>
        </Link>

        <DesktopNavLinks />

        <div className="flex items-center gap-2">
          <DesktopProfileMenu user={user} />

          <button
            type="button"
            className="rounded-md p-2 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uach-gold-400 md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="navbar-mobile-menu"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <MenuIcon open={isMenuOpen} />
          </button>
        </div>
      </nav>

      <MobileSideMenu
        user={user}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  )
}
