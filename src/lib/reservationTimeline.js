/** Minutos antes del inicio de la reserva en los que se permite hacer check-in */
export const CHECK_IN_WINDOW_MINUTES = 30

/**
 * @param {string} time HH:MM o HH:MM:SS
 */
export function formatTimeForDisplay(time) {
  return time.slice(0, 5)
}

/**
 * @param {object} reservation
 * @param {string} reservation.reservationDate
 * @param {string} reservation.startTime
 */
export function getReservationStartDateTime(reservation) {
  const start = formatTimeForDisplay(reservation.startTime)
  return new Date(`${reservation.reservationDate}T${start}:00`)
}

/**
 * @param {object} reservation
 * @param {string} reservation.reservationDate
 * @param {string} reservation.endTime
 */
export function getReservationEndDateTime(reservation) {
  const end = formatTimeForDisplay(reservation.endTime)
  return new Date(`${reservation.reservationDate}T${end}:00`)
}

/**
 * @param {string} isoDate YYYY-MM-DD
 */
/** @param {number} remainingMs */
export function formatRemainingTime(remainingMs) {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (value) => String(value).padStart(2, '0')

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`
  }

  return `${pad(minutes)}:${pad(seconds)}`
}

/** Límite de check-in: inicio de la reserva (debe entrar antes de esa hora). */
export function getCheckInDeadline(reservation) {
  return getReservationStartDateTime(reservation)
}

/** Se abre la ventana de check-in 30 minutos antes del inicio de la reserva. */
export function getCheckInWindowOpensAt(reservation) {
  const start = getReservationStartDateTime(reservation)
  return new Date(start.getTime() - CHECK_IN_WINDOW_MINUTES * 60 * 1000)
}

/** @param {object} reservation */
export function getUsageEndDeadline(reservation) {
  return getReservationEndDateTime(reservation)
}

export function formatReservationDateLabel(isoDate) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

/** @param {object} reservation */
export function isCheckInWindowActive(reservation, now = Date.now()) {
  const opens = getCheckInWindowOpensAt(reservation)
  const deadline = getCheckInDeadline(reservation)
  if (!opens || !deadline) return false
  return now >= opens.getTime() && now < deadline.getTime()
}

/** @param {object} reservation */
export function formatCheckInReminderMessage(reservation) {
  const time = formatTimeForDisplay(reservation.startTime)

  if (reservation.reservationDate === todayIso()) {
    return `No olvides hacer check-in a las ${time}.`
  }

  const dateLabel = formatReservationDateLabel(reservation.reservationDate)
  return `No olvides hacer check-in a las ${time} del ${dateLabel}.`
}

const STATUS_LABELS = {
  APPROVED: 'Aprobada',
  PENDING: 'Pendiente de aprobación',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada',
}

export function getReservationStatusLabel(status) {
  return STATUS_LABELS[status] ?? status
}

/** @param {string} status */
export function isReservationApproved(status) {
  return status === 'APPROVED'
}

/** @param {string} status */
export function isReservationPendingApproval(status) {
  return status === 'PENDING'
}

/** @param {object} reservation */
export function hasCheckedIn(reservation) {
  return Boolean(reservation.checkedInAt)
}

/** @param {object} reservation */
export function hasCheckedOut(reservation) {
  return Boolean(reservation.checkedOutAt)
}

/** @param {object} reservation */
export function isReservationInUse(reservation) {
  return (
    isReservationApproved(reservation.status) &&
    hasCheckedIn(reservation) &&
    !hasCheckedOut(reservation)
  )
}

/** @param {string} isoDateTime */
export function formatCheckTimestamp(isoDateTime) {
  return new Date(isoDateTime).toLocaleString('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * @param {object[]} reservations
 */
export function splitReservationsByTimeline(reservations) {
  const now = new Date()
  const upcoming = []
  const past = []

  for (const reservation of reservations) {
    if (reservation.status === 'CANCELLED' || reservation.status === 'COMPLETED') {
      past.push(reservation)
      continue
    }

    const end = getReservationEndDateTime(reservation)
    if (end >= now || isReservationInUse(reservation)) {
      upcoming.push(reservation)
    } else {
      past.push(reservation)
    }
  }

  upcoming.sort(
    (a, b) => getReservationStartDateTime(a) - getReservationStartDateTime(b),
  )
  past.sort((a, b) => getReservationStartDateTime(b) - getReservationStartDateTime(a))

  return { upcoming, past }
}
