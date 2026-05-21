import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCubiculoById } from '@/data/mockCubiculos'
import { CheckInWindowCountdown } from '@/components/reservation/CheckInWindowCountdown'
import { ReservationCountdown } from '@/components/reservation/ReservationCountdown'
import { cancelCubicleReservation } from '@/lib/cubicleReservationApi'
import {
  CANCELLATION_MIN_HOURS,
  canCancelReservation,
  formatCheckTimestamp,
  formatReservationDateLabel,
  formatTimeForDisplay,
  getCancellationDeadline,
  getReservationDisplayLabel,
  getReservationDisplayState,
  getUsageEndDeadline,
  hasCheckedIn,
  isCheckInWindowUpcoming,
  isReservationInUse,
  isReservationMissedCheckIn,
  isReservationSanctioned,
} from '@/lib/reservationTimeline'

const BADGE_STYLES = {
  CANCELLED: 'bg-red-50 text-red-700',
  CHECK_IN: 'bg-amber-50 text-amber-900',
  IN_USE: 'bg-uach-gold-400/25 text-uach-purple-900',
}

/**
 * @param {object} props
 * @param {import('@/data/mockUserReservations').CubicleReservation} props.reservation
 * @param {'active' | 'past'} props.variant
 * @param {() => void} [props.onUpdated]
 */
export function MisReservaCard({ reservation, variant, onUpdated }) {
  const navigate = useNavigate()
  const cubicle = getCubiculoById(reservation.cubicleId)
  const isPast = variant === 'past'
  const displayState = getReservationDisplayState(reservation)
  const displayLabel = getReservationDisplayLabel(displayState)
  const isFinished =
    isPast && hasCheckedIn(reservation) && !isReservationMissedCheckIn(reservation)
  const inUse = isReservationInUse(reservation)
  const usageEndDeadline = getUsageEndDeadline(reservation)
  const showCheckIn =
    !isPast && displayState === 'CHECK_IN' && !isReservationMissedCheckIn(reservation)
  const canCancel = !isPast && displayState === 'CHECK_IN' && canCancelReservation(reservation)
  const cancelDeadline = getCancellationDeadline(reservation)
  const showCancellationNotice =
    !isPast &&
    displayState === 'CHECK_IN' &&
    !canCancel &&
    isCheckInWindowUpcoming(reservation)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelError, setCancelError] = useState(null)

  async function handleCancel() {
    if (
      !window.confirm(
        '¿Confirmas que deseas cancelar esta reserva? Solo puedes cancelar con al menos 1 hora de anticipación.',
      )
    ) {
      return
    }

    setCancelError(null)
    setIsCancelling(true)

    try {
      await cancelCubicleReservation(reservation.id)
      onUpdated?.()
    } catch (error) {
      setCancelError(
        error instanceof Error
          ? error.message
          : error?.message ?? 'No se pudo cancelar la reserva.',
      )
    } finally {
      setIsCancelling(false)
    }
  }

  function handleOpenCheckIn() {
    navigate(`/check-in/${reservation.id}`)
  }

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-white shadow-sm transition ${
        isPast
          ? 'border-uach-purple-900/10 opacity-90'
          : inUse
            ? 'border-uach-gold-500/40 ring-1 ring-uach-gold-400/25'
            : displayState === 'CHECK_IN'
              ? 'border-amber-300/50 hover:border-amber-400/60 hover:shadow-md'
              : 'border-uach-purple-900/15 hover:border-uach-purple-700/25 hover:shadow-md'
      }`}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-36 w-full shrink-0 overflow-hidden bg-uach-purple-950 sm:h-auto sm:w-40">
          {cubicle?.image ? (
            <img
              src={cubicle.image}
              alt={cubicle.imageAlt}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover ${isPast ? 'grayscale-[35%]' : ''}`}
            />
          ) : (
            <div className="absolute inset-0 bg-uach-purple-900/40" aria-hidden="true" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-alverata text-lg font-semibold text-uach-purple-900">
                {cubicle?.name ?? `Cubículo #${reservation.cubicleId}`}
              </h3>
              {cubicle?.capacity != null ? (
                <p className="font-praxis mt-0.5 text-sm text-uach-purple-900/60">
                  Capacidad: {cubicle.capacity}{' '}
                  {cubicle.capacity === 1 ? 'persona' : 'personas'}
                </p>
              ) : null}
            </div>
            {isFinished ? (
              <span className="font-praxis shrink-0 rounded-full bg-uach-purple-900/8 px-3 py-1 text-xs font-semibold text-uach-purple-900/55">
                Finalizada
              </span>
            ) : (
              <span
                className={`font-praxis shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  BADGE_STYLES[displayState] ?? 'bg-uach-purple-900/8 text-uach-purple-900/55'
                }`}
              >
                {displayLabel}
              </span>
            )}
          </div>

          <dl className="font-praxis grid gap-1 text-sm text-uach-purple-900/80">
            <div>
              <dt className="sr-only">Fecha</dt>
              <dd className="capitalize">
                {formatReservationDateLabel(reservation.reservationDate)}
              </dd>
            </div>
            <div>
              <dt className="sr-only">Horario</dt>
              <dd>
                {formatTimeForDisplay(reservation.startTime)} –{' '}
                {formatTimeForDisplay(reservation.endTime)}
              </dd>
            </div>
            {hasCheckedIn(reservation) ? (
              <div>
                <dt className="text-uach-purple-900/55">Check-in</dt>
                <dd>{formatCheckTimestamp(reservation.checkedInAt)}</dd>
              </div>
            ) : null}
          </dl>

          {inUse ? (
            <ReservationCountdown
              deadline={usageEndDeadline}
              label="Tiempo restante de uso"
              variant="usage"
              expiredMessage="Tu horario de reserva ha terminado."
            />
          ) : null}

          {showCheckIn ? (
            <CheckInWindowCountdown onCheckIn={handleOpenCheckIn} />
          ) : null}

          {canCancel ? (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isCancelling}
              className="font-praxis w-full rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isCancelling ? 'Cancelando…' : 'Cancelar reserva'}
            </button>
          ) : null}

          {showCancellationNotice && cancelDeadline ? (
            <p className="font-praxis rounded-lg border border-amber-200/70 bg-amber-50/50 px-4 py-3 text-xs leading-relaxed text-amber-950/90">
              La cancelación solo es posible hasta{' '}
              {cancelDeadline.toLocaleString('es-MX', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              ({CANCELLATION_MIN_HOURS} hora de anticipación). Si no haces check-in antes de que
              termine tu horario, se aplicará una sanción.
            </p>
          ) : null}

          {cancelError ? (
            <p className="font-praxis text-sm text-red-600">{cancelError}</p>
          ) : null}

          {isPast && reservation.status === 'CANCELLED' && !isReservationSanctioned(reservation) ? (
            <p className="font-praxis text-xs text-uach-purple-900/55">
              Reserva cancelada.
            </p>
          ) : null}

          {isPast &&
          (isReservationSanctioned(reservation) || isReservationMissedCheckIn(reservation)) ? (
            <p className="font-praxis text-xs text-red-700/80">
              Se aplicó una sanción (check-in fuera de plazo o incumplimiento de la reserva).
            </p>
          ) : null}

          {isPast && hasCheckedIn(reservation) ? (
            <p className="font-praxis text-xs text-uach-purple-900/55">
              Reserva finalizada.
            </p>
          ) : null}

          {inUse ? (
            <p className="font-praxis text-xs text-uach-purple-900/70">
              Estás usando el cubículo. Tu sesión termina al finalizar el horario reservado.
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}
