import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearAuthSession, getAuthSession } from '@/lib/authSession'
import escudoUach from '@/assets/escudo-color.png'

const misReservasLinkClass =
  'font-praxis block rounded-md px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uach-gold-400'

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function ProfileAvatar({ name, photoUrl, size = 'md' }) {
  const sizeClass =
    size === 'lg' ? 'size-20 text-lg' : 'size-10 text-sm'

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={`Foto de perfil de ${name}`}
        className={`${sizeClass} shrink-0 rounded-full object-cover ring-2 ring-uach-gold-400/50`}
      />
    )
  }

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
      <ProfileAvatar
        name={user.name}
        photoUrl={user.photoUrl}
        size={avatarSize}
      />
      <div className={`min-w-0 text-left ${!isLarge ? 'md:text-right' : ''}`}>
        <p
          className={`font-alverata font-semibold text-white ${
            isLarge ? 'text-xl' : 'text-sm sm:text-base'
          }`}
        >
          {user.name}
        </p>
        <p
          className={`font-praxis text-uach-gold-400/90 ${
            isLarge ? 'text-lg' : 'text-xs sm:text-sm'
          }`}
        >
          {user.enrollment}
        </p>
      </div>
    </div>
  )
}

function MisReservasLink({ className, onClick }) {
  return (
    <Link to="/mis-reservas" className={className} onClick={onClick}>
      Mis reservas
    </Link>
  )
}

function LogoutIcon() {
  return (
    <svg
      className="size-4 shrink-0"
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

function LogoutButton({ className, onClick }) {
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
      className={`inline-flex items-center justify-center gap-2 ${className}`}
      onClick={handleLogout}
    >
      <LogoutIcon />
      Cerrar sesión
    </button>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg
      className={`size-4 shrink-0 text-white/80 transition-transform ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function DesktopProfileMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div
      ref={menuRef}
      className="relative hidden md:inline-flex md:flex-col md:items-stretch"
    >
      <button
        type="button"
        className={`flex items-center gap-2 rounded-md border px-2 py-1.5 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uach-gold-400 ${
          isOpen ? 'border-uach-gold-400/60' : 'border-transparent'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <UserProfileInfo user={user} />
        <ChevronIcon open={isOpen} />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute top-full right-0 left-0 z-50 mt-2 w-full min-w-full overflow-hidden rounded-md border border-uach-gold-400/60 bg-uach-purple-800 py-1 shadow-lg"
        >
          <MisReservasLink
            role="menuitem"
            className={`${misReservasLinkClass} text-center`}
            onClick={() => setIsOpen(false)}
          />
          <div className="my-1 border-t border-white/10" role="separator" />
          <LogoutButton
            className={`${misReservasLinkClass} w-full text-center`}
            onClick={() => setIsOpen(false)}
          />
        </div>
      ) : null}
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

        <div className="flex flex-1 flex-col items-center gap-0 px-6 py-6">
          <MisReservasLink
            className={`${misReservasLinkClass} w-full border-y border-white/10 text-center`}
            onClick={onClose}
          />
          <LogoutButton
            className={`${misReservasLinkClass} w-full border-b border-white/10 text-center`}
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
    <header className="border-b border-white/10 bg-uach-purple-900 shadow-md">
      <nav
        className="page-shell flex min-h-16 items-center justify-between gap-4 py-4"
        aria-label="Principal"
      >
        <Link
          to="/home"
          className="flex items-center gap-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uach-gold-400"
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
      </nav>

      <MobileSideMenu
        user={user}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  )
}
