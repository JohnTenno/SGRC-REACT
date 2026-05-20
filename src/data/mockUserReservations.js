const MOCK_RESERVATIONS_KEY = 'sgrc.mock.cubicle-reservations.v5'

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
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2002,
      cubicleId: 1,
      reservationDate: today,
      startTime: '08:00:00',
      endTime: '19:00:00',
      status: 'APPROVED',
      checkedInAt: toReservationDateTime(today, '10:15:00'),
      createdAt: toReservationDateTime(addDays(today, -1), '18:30:00'),
    },
    {
      id: 2003,
      cubicleId: 4,
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

function readStoredReservations() {
  try {
    const raw = localStorage.getItem(MOCK_RESERVATIONS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function writeStoredReservations(reservations) {
  localStorage.setItem(MOCK_RESERVATIONS_KEY, JSON.stringify(reservations))
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
  const reservation = {
    id: Date.now(),
    cubicleId: body.cubicleId,
    reservationDate: body.reservationDate,
    startTime: body.startTime,
    endTime: body.endTime,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  }

  list.unshift(reservation)
  writeStoredReservations(list)
  return reservation
}
