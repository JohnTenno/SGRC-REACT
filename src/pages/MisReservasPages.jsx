import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { MisReservaCard } from '@/components/reservation/MisReservaCard'
import { fetchMyCubicleReservations } from '@/lib/cubicleReservationApi'
import { splitReservationsByTimeline } from '@/lib/reservationTimeline'

function ReservationsSection({ title, description, reservations, variant, emptyMessage }) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-alverata text-xl font-semibold text-uach-purple-900">{title}</h2>
        <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">{description}</p>
      </div>

      {reservations.length === 0 ? (
        <p className="font-praxis rounded-xl border border-dashed border-uach-purple-900/20 bg-uach-purple-50/40 px-5 py-8 text-center text-sm text-uach-purple-900/60">
          {emptyMessage}
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <MisReservaCard reservation={reservation} variant={variant} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function MisReservasPages() {
  const [reservations, setReservations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadReservations() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const data = await fetchMyCubicleReservations()
        if (!cancelled) setReservations(data)
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error?.message ?? 'No se pudieron cargar tus reservas. Intenta de nuevo.',
          )
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadReservations()

    return () => {
      cancelled = true
    }
  }, [])

  const { upcoming, past } = useMemo(
    () => splitReservationsByTimeline(reservations),
    [reservations],
  )

  const hasNoReservations = !isLoading && !errorMessage && upcoming.length === 0 && past.length === 0

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="page-shell flex flex-1 flex-col gap-8 py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-alverata text-2xl font-semibold text-uach-purple-900 sm:text-3xl">
              Mis reservas
            </h1>
            <p className="font-praxis mt-2 max-w-2xl text-uach-purple-900/70">
              Consulta tus solicitudes pendientes, reservas aprobadas y el historial de
              cubículos. Un administrador debe aprobar cada reserva antes de usar el
              cubículo.
            </p>
          </div>
          <Link
            to="/reserva-de-cubiculo"
            className="button-primary w-full shrink-0 sm:w-auto sm:min-w-[12rem]"
          >
            Nueva reserva
          </Link>
        </header>

        {isLoading ? (
          <div className="flex flex-col gap-4" aria-busy="true" aria-label="Cargando reservas">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-xl bg-uach-purple-900/8"
              />
            ))}
          </div>
        ) : null}

        {errorMessage ? (
          <p className="font-praxis rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {hasNoReservations ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-uach-purple-900/20 bg-uach-purple-50/30 px-6 py-16 text-center">
            <p className="font-alverata text-lg font-semibold text-uach-purple-900">
              Aún no tienes reservas
            </p>
            <p className="font-praxis max-w-md text-sm text-uach-purple-900/65">
              Cuando reserves un cubículo, aparecerá aquí tu historial y tus próximas visitas.
            </p>
            <Link to="/reserva-de-cubiculo" className="button-primary mt-2">
              Reservar cubículo
            </Link>
          </div>
        ) : null}

        {!isLoading && !errorMessage && !hasNoReservations ? (
          <div className="flex flex-col gap-10">
            <ReservationsSection
              title="Próximas reservas"
              description="Incluye solicitudes en espera de aprobación y reservas ya aprobadas por un administrador."
              reservations={upcoming}
              variant="upcoming"
              emptyMessage="No tienes reservas próximas."
            />

            <ReservationsSection
              title="Historial"
              description="Reservas que ya pasaron o fueron canceladas."
              reservations={past}
              variant="past"
              emptyMessage="Tu historial aparecerá aquí cuando completes una reserva."
            />
          </div>
        ) : null}
      </main>
    </div>
  )
}
