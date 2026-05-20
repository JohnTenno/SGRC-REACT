import { useEffect, useState } from 'react'
import { ReservationCountdown } from '@/components/reservation/ReservationCountdown'
import {
  formatCheckInReminderMessage,
  formatTimeForDisplay,
  getCheckInDeadline,
  getCheckInWindowOpensAt,
  isCheckInWindowActive,
} from '@/lib/reservationTimeline'

/**
 * Check-in permitido solo en los 30 minutos previos al inicio de la reserva.
 * @param {object} props
 * @param {import('@/data/mockUserReservations').CubicleReservation} props.reservation
 */
export function CheckInWindowCountdown({ reservation }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const windowOpens = getCheckInWindowOpensAt(reservation)
  const deadline = getCheckInDeadline(reservation)

  if (!windowOpens || !deadline) return null

  const opensLabel = windowOpens.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const startLabel = formatTimeForDisplay(reservation.startTime)

  if (now >= deadline.getTime()) {
    return (
      <div className="rounded-lg border border-amber-300/60 bg-amber-50/80 px-4 py-3">
        <p className="font-praxis text-xs font-medium text-amber-900/80">
          Plazo de check-in finalizado
        </p>
        <p className="font-alverata mt-1 text-2xl font-semibold tabular-nums text-uach-purple-900/40">
          00:00
        </p>
        <p className="font-praxis mt-1 text-xs text-uach-purple-900/55">
          Debías hacer check-in entre las {opensLabel} y las {startLabel}.
        </p>
      </div>
    )
  }

  if (isCheckInWindowActive(reservation, now)) {
    return (
      <>
        <ReservationCountdown
          deadline={deadline}
          label={`Tiempo para check-in (hasta las ${startLabel})`}
          variant="check-in"
          expiredMessage={`Debías hacer check-in antes de las ${startLabel}.`}
        />
        <p className="font-praxis text-xs text-amber-800/90">
          Haz check-in en el lobby de la biblioteca antes de que comience tu horario.
        </p>
      </>
    )
  }

  return (
    <div className="rounded-lg border border-amber-200/70 bg-amber-50/50 px-4 py-3">
      <p className="font-praxis text-sm leading-relaxed text-amber-950/90">
        {formatCheckInReminderMessage(reservation)}
      </p>
    </div>
  )
}
