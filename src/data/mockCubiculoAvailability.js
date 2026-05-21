import { RESERVATION_TIME_OPTIONS } from '@/lib/cubicleReservationApi'

/**
 * Bloques ocupados por cubículo (hora de inicio HH:MM).
 * En producción vendría del backend según fecha.
 * @type {Record<number, string[]>}
 */
const DEFAULT_OCCUPIED_BY_CUBICLE = {
  1: ['10:00', '11:00'],
  2: ['09:00', '14:00', '15:00'],
  3: ['14:00'],
}

/**
 * @param {number} cubicleId
 * @param {string} reservationDate YYYY-MM-DD
 * @returns {string[]} horas de inicio ocupadas (HH:MM)
 */
export function getOccupiedSlots(cubicleId, reservationDate) {
  if (!reservationDate) return []

  const base = DEFAULT_OCCUPIED_BY_CUBICLE[cubicleId] ?? []
  const day = new Date(`${reservationDate}T12:00:00`).getDate()

  if (day % 2 === 0) {
    return [...new Set([...base, '08:00'])]
  }

  return base
}

/**
 * @param {number} cubicleId
 * @param {string} reservationDate
 * @returns {{ time: string, status: 'available' | 'occupied' }[]}
 */
export function getSlotsWithStatus(cubicleId, reservationDate) {
  const occupied = new Set(getOccupiedSlots(cubicleId, reservationDate))

  return RESERVATION_TIME_OPTIONS.map((time) => ({
    time,
    status: occupied.has(time) ? 'occupied' : 'available',
  }))
}

/**
 * @param {number} cubicleId
 * @param {string} reservationDate YYYY-MM-DD
 * @returns {string[]} horas de inicio disponibles (HH:MM)
 */
export function getAvailableSlots(cubicleId, reservationDate) {
  if (!reservationDate) return []

  return getSlotsWithStatus(cubicleId, reservationDate)
    .filter((slot) => slot.status === 'available')
    .map((slot) => slot.time)
}

/**
 * @param {number} cubicleId
 * @param {string} reservationDate
 * @param {string} startTime HH:MM
 * @param {string} endTime HH:MM
 */
export function isReservationRangeAvailable(cubicleId, reservationDate, startTime, endTime) {
  const startIdx = RESERVATION_TIME_OPTIONS.indexOf(startTime)
  const endIdx = RESERVATION_TIME_OPTIONS.indexOf(endTime)
  if (startIdx < 0 || endIdx <= startIdx) return false

  const occupied = new Set(getOccupiedSlots(cubicleId, reservationDate))
  const slotsInRange = RESERVATION_TIME_OPTIONS.slice(startIdx, endIdx)

  return slotsInRange.every((slot) => !occupied.has(slot))
}
