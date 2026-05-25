import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearAuthSession, getAuthSession } from '@/lib/authSession'
import { IconClose, IconLogout, IconMenu } from '@/components/icons'
import { isNavLinkActive, NAV_LINKS, NavIcon } from '@/components/layout/navConfig'
import escudoUach from '@/assets/escudo-color.png'

const navLinkClass =
  'font-praxis inline-flex items-center justify-center gap-2.5 rounded-md px-4 py-3.5 text-base font-medium text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uach-gold-400'

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function UserProfileInfo({ user, avatarSize = 'md' }) {
  const isLarge = avatarSize === 'lg'
  const sizeClass =
    isLarge ? 'size-20 text-lg' : 'size-10 text-sm sm:size-12'

  return (
    <div className={`flex min-w-0 items-center ${isLarge ? 'gap-4' : 'gap-2.5 sm:gap-3'}`}>
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-uach-purple-700 font-alverata font-semibold text-white ring-2 ring-uach-gold-400/50 ${sizeClass}`}
        aria-hidden="true"
      >
        {getInitials(user.name)}
      </div>
      <div className="min-w-0 text-left">
        <p
          className={`font-alverata font-semibold text-white ${
            isLarge ? 'text-2xl' : 'text-sm sm:text-base'
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
      <NavIcon
        name={icon}
        className={largeIcon ? 'size-5 shrink-0' : 'size-[1.125rem] shrink-0'}
      />
      {label}
    </Link>
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
      className={className}
      onClick={handleLogout}
      aria-label={largeIcon ? undefined : 'Cerrar sesión'}
    >
      <IconLogout className="size-5 shrink-0" aria-hidden />
      {largeIcon ? 'Cerrar sesión' : null}
    </button>
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
            <IconClose className="size-6" aria-hidden />
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
              className="w-full justify-start border-y border-white/10 py-4 text-lg"
              onClick={onClose}
            />
          ))}
        </nav>

        <div className="mt-auto shrink-0 border-t border-white/10 bg-uach-purple-950 px-6 py-5">
          <LogoutButton
            largeIcon
            className={`${navLinkClass} w-full justify-start gap-2.5 py-4 text-lg`}
            onClick={onClose}
          />
        </div>
      </aside>
    </>
  )
}

function MenuIcon({ open }) {
  return open ? (
    <IconClose className="size-6" aria-hidden />
  ) : (
    <IconMenu className="size-6" aria-hidden />
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
        className="page-shell flex min-h-16 items-center justify-between gap-4 py-3 md:min-h-[5.25rem] md:py-5"
        aria-label="Principal"
      >
        <Link
          to="/home"
          className="flex min-w-0 shrink items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uach-gold-400"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={escudoUach} alt="Escudo UACh" className="h-9 w-auto shrink-0 md:h-11" />
          <span className="font-alverata truncate text-sm font-semibold uppercase tracking-[0.12em] text-white md:hidden">
            UACH
          </span>
          <span className="font-alverata hidden truncate text-sm font-semibold uppercase leading-snug tracking-[0.06em] text-white md:block lg:text-base">
            Universidad Autónoma de Chihuahua
          </span>
        </Link>

        <div className="hidden shrink-0 items-center gap-2 md:flex md:gap-3">
          <UserProfileInfo user={user} />
          <LogoutButton
            className="rounded-md p-2 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uach-gold-400"
          />
        </div>

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
      </nav>

      <MobileSideMenu
        user={user}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  )
}
