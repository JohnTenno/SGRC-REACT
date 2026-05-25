import { Link, useNavigate } from 'react-router-dom'
import { clearAuthSession, getAuthSession } from '@/lib/authSession'

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function DashboardHeader() {
  const user = getAuthSession()?.user
  const navigate = useNavigate()

  function handleLogout() {
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-uach-purple-900/10 px-5 pb-3 pt-5 sm:px-8 md:min-h-[5.5rem] md:pb-5 md:pt-7">
      <p className="font-praxis text-xs font-medium uppercase tracking-wider text-uach-purple-900/50">
        SGRC · Administración
      </p>

      {user ? (
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="font-alverata text-sm font-semibold text-uach-purple-900">
              {user.name}
            </p>
            <p className="font-praxis text-xs text-uach-purple-900/60">Administrador</p>
          </div>
          <div
            className="flex size-10 items-center justify-center rounded-full bg-uach-purple-900 font-alverata text-sm font-semibold text-white ring-2 ring-uach-gold-400/40"
            aria-hidden="true"
          >
            {getInitials(user.name)}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-uach-purple-900/15 px-3 py-2 font-praxis text-sm text-uach-purple-900 transition hover:bg-uach-purple-50"
          >
            Salir
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="font-praxis text-sm font-medium text-uach-purple-900 hover:underline"
        >
          Iniciar sesión
        </Link>
      )}
    </header>
  )
}
