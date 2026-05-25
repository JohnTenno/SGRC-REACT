import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { CheckInWelcomeAnimation } from '@/components/animations/CheckInWelcomeAnimation'
import { FailAnimation } from '@/components/animations/FailAnimation'
import { Navbar } from '@/components/layout/Navbar'
import { CheckInQrReader } from '@/components/reservation/CheckInQrReader'
import { getAuthSession } from '@/lib/authSession'
import { fetchMyCubicleReservations, performCubicleCheckIn } from '@/cubicles/home/cubicleReservationApi'
import {
  canPerformCheckIn,
  formatReservationDateLabel,
  formatTimeForDisplay,
  hasCheckedIn,
} from '@/lib/reservationTimeline'

export function CheckInPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const reservationId = Number(id)

  const [reservation, setReservation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkInDenied, setCheckInDenied] = useState(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [scannerKey, setScannerKey] = useState(0)

  const loadReservation = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      const list = await fetchMyCubicleReservations()
      const found = list.find((item) => item.id === reservationId) ?? null

      if (!found) {
        setLoadError('No encontramos esta reserva.')
        setReservation(null)
        return
      }
      setReservation(found)
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : error?.message ?? 'No se pudo cargar la reserva.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [reservationId])

  useEffect(() => {
    if (!getAuthSession()?.token) return
    loadReservation()
  }, [loadReservation])

  if (!getAuthSession()?.token) {
    return <Navigate to="/login" replace />
  }

  if (!Number.isFinite(reservationId) || reservationId < 1) {
    return <Navigate to="/my-reservations" replace />
  }

  async function handleQrScanned(scannedPayload) {
    if (!reservation) return

    setCheckInDenied(null)
    setIsSubmitting(true)

    try {
      await performCubicleCheckIn(reservation.id, scannedPayload)
      setShowWelcome(true)
    } catch (error) {
      setCheckInDenied(
        error instanceof Error
          ? error.message
          : error?.message ?? 'No se pudo registrar el check-in.',
      )
      setScannerKey((k) => k + 1)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleWelcomeComplete() {
    setShowWelcome(false)
    navigate('/my-reservations', { replace: true })
  }

  const canCheckIn = reservation && canPerformCheckIn(reservation) && !hasCheckedIn(reservation)
  const cubicleName = reservation?.cubicleIdentifier ?? null

  return (
    <div className="flex min-h-screen flex-col bg-uach-purple-950">
      <Navbar />

      {showWelcome && reservation ? (
        <CheckInWelcomeAnimation
          cubicleName={cubicleName}
          startTime={reservation.startTime}
          endTime={reservation.endTime}
          onComplete={handleWelcomeComplete}
        />
      ) : null}

      {checkInDenied ? (
        <FailAnimation
          title="Acceso denegado"
          message={checkInDenied}
          onClose={() => setCheckInDenied(null)}
        />
      ) : null}

      <main className="page-shell flex flex-1 flex-col gap-6 py-6 pb-10">
        <nav className="font-praxis text-sm text-white/60">
          <Link to="/my-reservations" className="transition hover:text-white">
            Mis reservas
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-white">Check-in</span>
        </nav>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="font-praxis text-white/70">Cargando reserva…</p>
          </div>
        ) : null}

        {loadError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <p className="font-praxis text-red-200">{loadError}</p>
            <Link to="/my-reservations" className="button-primary">
              Volver a mis reservas
            </Link>
          </div>
        ) : null}

        {!isLoading && !loadError && reservation ? (
          <>
            <header className="text-center">
              <h1 className="font-alverata text-2xl font-semibold text-white sm:text-3xl">
                Check-in
              </h1>
              {cubicleName ? (
                <p className="font-alverata mt-2 text-lg text-uach-gold-400">{cubicleName}</p>
              ) : null}
              <p className="font-praxis mt-3 mx-auto max-w-md text-sm leading-relaxed text-white/75">
                Enfoca el código QR de la pantalla del cubículo dentro del recuadro para hacer
                check-in.
              </p>
              <p className="font-praxis mt-2 text-xs text-white/50 capitalize">
                {formatReservationDateLabel(reservation.reservationDate)} ·{' '}
                {formatTimeForDisplay(reservation.startTime)} –{' '}
                {formatTimeForDisplay(reservation.endTime)}
              </p>
            </header>

            {canCheckIn ? (
              <CheckInQrReader
                key={scannerKey}
                reservation={reservation}
                onScanSuccess={handleQrScanned}
                isSubmitting={isSubmitting}
                regionIdPrefix="check-in-page-reader"
                variant="dark"
              />
            ) : (
              <div className="mx-auto max-w-md rounded-xl border border-red-300/40 bg-red-950/40 px-5 py-6 text-center">
                <p className="font-praxis text-sm text-red-100">
                  {hasCheckedIn(reservation)
                    ? 'Ya registraste tu check-in en esta reserva.'
                    : 'Esta reserva ya no admite check-in (cancelada o horario finalizado).'}
                </p>
                <Link to="/my-reservations" className="button-primary mt-4 inline-block">
                  Volver a mis reservas
                </Link>
              </div>
            )}

            {canCheckIn ? (
              <p className="font-praxis text-center text-xs text-white/45">
                Mantén el teléfono estable hasta que se valide el acceso.
              </p>
            ) : null}

            <div className="mt-auto flex justify-center pt-2">
              <Link
                to="/my-reservations"
                className="font-praxis text-sm text-white/70 transition hover:text-white"
              >
                Cancelar y volver
              </Link>
            </div>
          </>
        ) : null}
      </main>
    </div>
  )
}
