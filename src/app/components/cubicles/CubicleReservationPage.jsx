import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CubicleCard } from '@/app/components/cubicles/CubicleCard'
import { HeroHeader } from '@/app/components/layout/HeroHeader'
import { Navbar } from '@/app/components/layout/Navbar'
import { getAuthSession } from '@/app/services/auth.service'

const todayIso = new Date().toISOString().slice(0, 10)

const todayLabel = new Date(`${todayIso}T12:00:00`).toLocaleDateString('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

export function CubicleReservationPage() {
  const navigate = useNavigate()
  const [cubicles, setCubicles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [selectedCubicleId, setSelectedCubicleId] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const selectedCubicle = cubicles.find((c) => c.id === selectedCubicleId)

  useEffect(() => {
    const session = getAuthSession()
    fetch('/api/cubicles', {
      headers: session?.token ? { Authorization: `Bearer ${session.token}` } : {},
    })
      .then((r) => r.json())
      .then((data) => setCubicles(Array.isArray(data) ? data : []))
      .catch(() => setLoadError('No se pudieron cargar los cubículos. Intenta de nuevo.'))
      .finally(() => setIsLoading(false))
  }, [])

  function handleContinue() {
    if (!selectedCubicleId) {
      setFieldErrors({ cubicle: 'Selecciona un cubículo para continuar.' })
      return
    }
    setFieldErrors({})
    navigate(`/cubicle-reservation/${selectedCubicleId}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex flex-1 flex-col gap-8 bg-white">
        <div className="cubicle-reservation-hero">
          <HeroHeader
            title="Reserva de cubículos"
            description="Elige el cubículo que deseas reservar en la biblioteca."
          />
        </div>

        <div className={`page-shell flex flex-1 flex-col ${selectedCubicleId ? 'pb-28' : 'pb-8'}`}>
          <nav className="font-praxis mb-6 text-sm text-uach-purple-900/60" aria-label="Ruta">
            <Link to="/home" className="transition hover:text-uach-purple-900">
              Inicio
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-uach-purple-900">Reserva de cubículos</span>
          </nav>

          <section className="flex flex-1 flex-col gap-8">
            <div>
              <h2 className="font-alverata text-xl font-semibold text-uach-purple-900">
                Cubículos disponibles
              </h2>
              <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">
                Selecciona un cubículo para elegir fecha y horario.
              </p>

              {fieldErrors.cubicle ? (
                <p className="font-praxis mt-3 text-sm text-red-600">{fieldErrors.cubicle}</p>
              ) : null}

              {isLoading ? (
                <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((n) => (
                    <li key={n} className="h-56 animate-pulse rounded-xl bg-uach-purple-900/8" />
                  ))}
                </ul>
              ) : loadError ? (
                <p className="font-praxis mt-6 text-sm text-red-600">{loadError}</p>
              ) : (
                <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {cubicles.map((cubicle) => (
                    <li key={cubicle.id} className="flex">
                      <CubicleCard
                        name={cubicle.identifier}
                        image={cubicle.logoUrl}
                        capacity={cubicle.capacity}
                        availabilityDayLabel={todayLabel}
                        selected={selectedCubicleId === cubicle.id}
                        onSelect={() => {
                          setSelectedCubicleId((current) =>
                            current === cubicle.id ? null : cubicle.id,
                          )
                          setFieldErrors({})
                        }}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link
              to="/home"
              className="font-praxis inline-block text-sm text-uach-purple-900/70 transition hover:text-uach-purple-900"
            >
              Volver al inicio
            </Link>
          </section>
        </div>

        {selectedCubicle ? (
          <div
            className="fixed inset-x-0 bottom-0 z-40 animate-slide-up-action-bar border-t border-uach-purple-900/10 bg-white/95 shadow-[0_-12px_40px_rgba(30,15,58,0.12)] backdrop-blur-md"
            role="region"
            aria-label="Confirmar selección"
          >
            <div className="page-shell flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <p className="font-praxis text-sm text-uach-purple-900/80">
                Cubículo seleccionado:{' '}
                <span className="font-alverata font-semibold text-uach-purple-900">
                  {selectedCubicle.identifier}
                </span>
              </p>
              <button
                type="button"
                onClick={handleContinue}
                className="button-primary w-full shrink-0 sm:w-auto sm:min-w-[14rem]"
              >
                Continuar
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
