import { getCubiculoById } from '@/data/mockCubiculos'
import { CheckInWindowCountdown } from '@/components/reservation/CheckInWindowCountdown'
import { ReservationCountdown } from '@/components/reservation/ReservationCountdown'
import {
  formatCheckTimestamp,
  formatReservationDateLabel,
  formatTimeForDisplay,
  getReservationStatusLabel,
  getUsageEndDeadline,
  hasCheckedIn,
  hasCheckedOut,
  isReservationApproved,
  isReservationInUse,
  isReservationPendingApproval,
} from '@/lib/reservationTimeline'

/**
 * @param {object} props
 * @param {import('@/data/mockUserReservations').CubicleReservation} props.reservation
 * @param {'upcoming' | 'past'} props.variant
 */
export function MisReservaCard({ reservation, variant }) {
  const cubicle = getCubiculoById(reservation.cubicleId)
  const isPast = variant === 'past'
  const statusLabel = getReservationStatusLabel(reservation.status)
  const inUse = isReservationInUse(reservation)
  const usageEndDeadline = getUsageEndDeadline(reservation)
  const showCheckInWindow =
    !isPast &&
    !hasCheckedIn(reservation) &&
    (isReservationPendingApproval(reservation.status) ||
      isReservationApproved(reservation.status))

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-white shadow-sm transition ${
        isPast
          ? 'border-uach-purple-900/10 opacity-90'
          : inUse
            ? 'border-uach-gold-500/40 ring-1 ring-uach-gold-400/25'
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
            <span
              className={`font-praxis shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                reservation.status === 'CANCELLED'
                  ? 'bg-red-50 text-red-700'
                  : reservation.status === 'COMPLETED'
                    ? 'bg-uach-purple-900/8 text-uach-purple-900/55'
                    : isReservationPendingApproval(reservation.status)
                      ? 'bg-amber-50 text-amber-800'
                      : inUse
                        ? 'bg-uach-gold-400/25 text-uach-purple-900'
                        : isReservationApproved(reservation.status) && !isPast
                          ? 'bg-uach-gold-400/20 text-uach-purple-900'
                          : 'bg-uach-purple-900/8 text-uach-purple-900/55'
              }`}
            >
              {inUse ? 'En uso' : statusLabel}
            </span>
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
            {hasCheckedOut(reservation) ? (
              <div>
                <dt className="text-uach-purple-900/55">Check-out</dt>
                <dd>{formatCheckTimestamp(reservation.checkedOutAt)}</dd>
              </div>
            ) : null}
          </dl>

          {inUse ? (
            <ReservationCountdown
              deadline={usageEndDeadline}
              label="Tiempo restante de uso"
              variant="usage"
              expiredMessage="Tu horario de reserva ha terminado. Realiza check-out en el lobby."
            />
          ) : null}

          {showCheckInWindow ? <CheckInWindowCountdown reservation={reservation} /> : null}

          {reservation.status === 'COMPLETED' ? (
            <p className="font-praxis text-xs text-uach-purple-900/55">
              Reserva finalizada: check-in y check-out registrados.
            </p>
          ) : null}

          {reservation.status === 'CANCELLED' ? (
            <p className="font-praxis text-xs text-red-700/80">
              Esta reserva fue cancelada y el cubículo no estuvo disponible para ti.
            </p>
          ) : null}

          {!isPast && isReservationPendingApproval(reservation.status) ? (
            <p className="font-praxis text-xs text-amber-800/90">
              Un administrador debe aprobar tu reserva antes de que puedas usar el cubículo.
            </p>
          ) : null}

          {inUse ? (
            <p className="font-praxis text-xs text-uach-purple-900/70">
              Ya hiciste check-in. Recuerda hacer check-out al terminar tu sesión en el
              cubículo.
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}
