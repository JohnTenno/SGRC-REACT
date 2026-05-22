/** Horas mínimas de anticipación para cancelar sin sanción */
export const CANCELLATION_MIN_HOURS = 1

/** @typedef {'CANCELLED' | 'CHECK_IN' | 'IN_USE'} ReservationDisplayState */

/**
 * @param {string} time HH:MM o HH:MM:SS
 */
export function formatTimeForDisplay(time) {
  if (!time) return '--:--'
  return String(time).slice(0, 5)
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

/** @param {object} reservation */
export function getUsageEndDeadline(reservation) {
  return getReservationEndDateTime(reservation)
}

/**
 * La tablet de la puerta muestra el QR solo durante el horario de la reserva
 * y hasta que el estudiante haga check-in.
 * @param {object} reservation
 * @param {number} [now]
 */
export function isReservationLobbyQrVisible(reservation, now = Date.now()) {
  if (reservation.status === 'CANCELLED') return false
  if (hasCheckedIn(reservation)) return false

  const start = getReservationStartDateTime(reservation)
  const end = getReservationEndDateTime(reservation)
  if (!start || !end) return false

  return now >= start.getTime() && now < end.getTime()
}

/** @param {object} reservation @param {number} [now] */
export function canPerformCheckIn(reservation, now = Date.now()) {
  if (reservation.status === 'CANCELLED') return false
  if (hasCheckedIn(reservation)) return false

  const end = getReservationEndDateTime(reservation)
  return end ? now < end.getTime() : true
}

export function formatReservationDateLabel(isoDate) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** @param {object} reservation @param {number} [now] */
export function isCheckInWindowUpcoming(reservation, now = Date.now()) {
  const start = getReservationStartDateTime(reservation)
  return start ? now < start.getTime() : false
}

const DISPLAY_LABELS = {
  CANCELLED: 'Cancelado',
  CHECK_IN: 'Para hacer check-in',
  IN_USE: 'En uso',
}

/** @param {ReservationDisplayState} displayState */
export function getReservationDisplayLabel(displayState) {
  return DISPLAY_LABELS[displayState] ?? displayState
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
export function isReservationSanctioned(reservation) {
  return Boolean(reservation.sanctioned)
}

/** Último momento para cancelar sin sanción (1 h antes del inicio). */
export function getCancellationDeadline(reservation) {
  const start = getReservationStartDateTime(reservation)
  if (!start) return null
  return new Date(start.getTime() - CANCELLATION_MIN_HOURS * 60 * 60 * 1000)
}

/** @param {object} reservation @param {number} [now] */
export function canCancelReservation(reservation, now = Date.now()) {
  if (reservation.status === 'CANCELLED') return false
  if (hasCheckedIn(reservation)) return false

  const deadline = getCancellationDeadline(reservation)
  if (!deadline) return false

  return now < deadline.getTime()
}

/** @param {object} reservation @param {number} [now] */
export function isReservationInUse(reservation, now = Date.now()) {
  if (reservation.status === 'CANCELLED') return false
  if (!hasCheckedIn(reservation)) return false

  const end = getReservationEndDateTime(reservation)
  return end ? now < end.getTime() : false
}

/** @param {object} reservation @param {number} [now] */
export function isReservationMissedCheckIn(reservation, now = Date.now()) {
  if (reservation.status === 'CANCELLED') return false
  if (hasCheckedIn(reservation)) return false

  const end = getReservationEndDateTime(reservation)
  return end ? now >= end.getTime() : false
}

/**
 * @param {object} reservation
 * @param {number} [now]
 * @returns {ReservationDisplayState}
 */
export function getReservationDisplayState(reservation, now = Date.now()) {
  if (
    reservation.status === 'CANCELLED' ||
    isReservationSanctioned(reservation) ||
    isReservationMissedCheckIn(reservation, now)
  ) {
    return 'CANCELLED'
  }

  if (isReservationInUse(reservation, now)) {
    return 'IN_USE'
  }

  return 'CHECK_IN'
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
  const now = Date.now()
  const active = []
  const past = []

  for (const reservation of reservations) {
    const displayState = getReservationDisplayState(reservation, now)
    const end = getReservationEndDateTime(reservation)

    if (
      displayState === 'CANCELLED' ||
      reservation.status === 'CANCELLED' ||
      (hasCheckedIn(reservation) && end && end.getTime() <= now)
    ) {
      past.push(reservation)
      continue
    }

    active.push(reservation)
  }

  active.sort(
    (a, b) => getReservationStartDateTime(a) - getReservationStartDateTime(b),
  )
  past.sort((a, b) => getReservationStartDateTime(b) - getReservationStartDateTime(a))

  return { active, past }
}

