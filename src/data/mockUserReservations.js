/** Clave en localStorage donde se guardan las reservas (modo mock). */
export const MOCK_RESERVATIONS_STORAGE_KEY = 'sgrc.mock.cubicle-reservations.v9'

const LAST_CREATED_KEY = 'sgrc.lastCreatedReservationId'

/**
 * @typedef {object} CubicleReservation
 * @property {number} id
 * @property {number} cubicleId
 * @property {string} reservationDate YYYY-MM-DD
 * @property {string} startTime HH:MM:SS
 * @property {string} endTime HH:MM:SS
 * @property {'APPROVED' | 'PENDING' | 'CANCELLED' | 'COMPLETED'} status
 * @property {string} [checkedInAt] ISO 8601
 * @property {string} [checkedOutAt] ISO 8601
 * @property {string} [cancelledAt] ISO 8601
 * @property {boolean} [sanctioned]
 * @property {string} [createdAt]
 */

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function addDays(isoDate, days) {
  const date = new Date(`${isoDate}T12:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

/** @param {string} date YYYY-MM-DD @param {string} time HH:MM:SS */
function toReservationDateTime(date, time) {
  return new Date(`${date}T${time.slice(0, 8)}`).toISOString()
}

function buildSeedReservations() {
  const today = todayIso()

  return [
    {
      id: 2001,
      cubicleId: 2,
      reservationDate: addDays(today, 3),
      startTime: '10:00:00',
      endTime: '12:00:00',
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2005,
      cubicleId: 1,
      reservationDate: today,
      startTime: '10:00:00',
      endTime: '11:00:00',
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2006,
      cubicleId: 1,
      reservationDate: today,
      startTime: '11:00:00',
      endTime: '12:00:00',
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2002,
      cubicleId: 1,
      reservationDate: today,
      startTime: '08:00:00',
      endTime: '09:00:00',
      status: 'APPROVED',
      checkedInAt: toReservationDateTime(today, '08:10:00'),
      createdAt: toReservationDateTime(addDays(today, -1), '18:30:00'),
    },
    {
      id: 2003,
      cubicleId: 2,
      reservationDate: addDays(today, -3),
      startTime: '14:00:00',
      endTime: '16:00:00',
      status: 'COMPLETED',
      checkedInAt: toReservationDateTime(addDays(today, -3), '14:05:00'),
      checkedOutAt: toReservationDateTime(addDays(today, -3), '15:55:00'),
      createdAt: toReservationDateTime(addDays(today, -4), '11:00:00'),
    },
    {
      id: 2004,
      cubicleId: 3,
      reservationDate: addDays(today, -1),
      startTime: '11:00:00',
      endTime: '13:00:00',
      status: 'CANCELLED',
      createdAt: toReservationDateTime(addDays(today, -2), '16:20:00'),
    },
  ]
}

function generateReservationId(list) {
  const maxId = list.reduce((max, item) => Math.max(max, item.id ?? 0), 0)
  return Math.max(maxId + 1, Date.now())
}

function readStoredReservations() {
  try {
    const raw = localStorage.getItem(MOCK_RESERVATIONS_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function writeStoredReservations(reservations) {
  localStorage.setItem(MOCK_RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations))
}

/** @param {number} reservationId */
export function getMockReservationById(reservationId) {
  const list = getMockUserReservations()
  return list.find((item) => item.id === reservationId) ?? null
}

/** @returns {number | null} */
export function getLastCreatedReservationId() {
  const raw = localStorage.getItem(LAST_CREATED_KEY)
  if (!raw) return null
  const id = Number(raw)
  return Number.isInteger(id) ? id : null
}

function ensureSeedReservations() {
  const existing = readStoredReservations()
  if (existing) return existing

  const seed = buildSeedReservations()
  writeStoredReservations(seed)
  return seed
}

/** @returns {CubicleReservation[]} */
export function getMockUserReservations() {
  return ensureSeedReservations()
}

/**
 * @param {object} body
 * @param {number} body.cubicleId
 * @param {string} body.reservationDate
 * @param {string} body.startTime
 * @param {string} body.endTime
 * @returns {CubicleReservation}
 */
export function addMockUserReservation(body) {
  const list = getMockUserReservations()
  const id = generateReservationId(list)

  const reservation = {
    id,
    cubicleId: body.cubicleId,
    reservationDate: body.reservationDate,
    startTime: body.startTime,
    endTime: body.endTime,
    status: 'APPROVED',
    createdAt: new Date().toISOString(),
  }

  list.unshift(reservation)
  writeStoredReservations(list)
  localStorage.setItem(LAST_CREATED_KEY, String(id))

  return reservation
}

/** @param {number} reservationId */
export function performMockCubicleCheckIn(reservationId) {
  const list = getMockUserReservations()
  const reservation = list.find((item) => item.id === reservationId)

  if (!reservation) {
    throw new Error('Reserva no encontrada.')
  }

  if (reservation.status === 'CANCELLED') {
    throw new Error('Esta reserva está cancelada.')
  }

  reservation.checkedInAt = new Date().toISOString()
  reservation.status = 'APPROVED'
  writeStoredReservations(list)
  return reservation
}

/**
 * @param {number} reservationId
 * @param {{ sanctioned?: boolean }} [options]
 */
export function performMockCubicleCancel(reservationId, options = {}) {
  const list = getMockUserReservations()
  const reservation = list.find((item) => item.id === reservationId)

  if (!reservation) {
    throw new Error('Reserva no encontrada.')
  }

  if (reservation.status === 'CANCELLED') {
    throw new Error('Esta reserva ya está cancelada.')
  }

  if (reservation.checkedInAt) {
    throw new Error('No puedes cancelar una reserva que ya está en uso.')
  }

  reservation.status = 'CANCELLED'
  reservation.cancelledAt = new Date().toISOString()
  reservation.sanctioned = Boolean(options.sanctioned)
  writeStoredReservations(list)
  return reservation
}
