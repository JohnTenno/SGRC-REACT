import { addMockUserReservation, getMockUserReservations } from '@/data/mockUserReservations'
import { getAuthSession } from '@/lib/authSession'

/** Duración máxima permitida por reserva de cubículo */
export const MAX_CUBICLE_RESERVATION_HOURS = 2

/** Estados de reserva — la confirmación requiere aprobación del administrador */
export const RESERVATION_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
}

/** Opciones de hora para el formulario (valor UI en HH:MM) */
export const RESERVATION_TIME_OPTIONS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
]

/**
 * @param {string} time HH:MM o HH:MM:SS
 * @returns {string} HH:MM:SS
 */
/**
 * Horas entre inicio y fin (slots de 1 h; fin exclusivo en el índice).
 * @param {string} startTime HH:MM
 * @param {string} endTime HH:MM
 */
export function getReservationDurationHours(startTime, endTime) {
  const startIdx = RESERVATION_TIME_OPTIONS.indexOf(startTime)
  const endIdx = RESERVATION_TIME_OPTIONS.indexOf(endTime)
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return 0
  return endIdx - startIdx
}

export function isWithinMaxReservationDuration(
  startTime,
  endTime,
  maxHours = MAX_CUBICLE_RESERVATION_HOURS,
) {
  return getReservationDurationHours(startTime, endTime) <= maxHours
}

export function formatTimeToBackend(time) {
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time
  if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`
  return time
}

/**
 * Cuerpo esperado por el backend (sin usuario ni estatus).
 * @param {object} params
 * @param {number} params.cubicleId
 * @param {string} params.reservationDate YYYY-MM-DD
 * @param {string} params.startTime HH:MM o HH:MM:SS
 * @param {string} params.endTime HH:MM o HH:MM:SS
 */
export function buildCubicleReservationBody({
  cubicleId,
  reservationDate,
  startTime,
  endTime,
}) {
  if (!isWithinMaxReservationDuration(startTime, endTime)) {
    throw new Error(
      `La reserva no puede exceder ${MAX_CUBICLE_RESERVATION_HOURS} horas.`,
    )
  }

  return {
    cubicleId: Number(cubicleId),
    reservationDate,
    startTime: formatTimeToBackend(startTime),
    endTime: formatTimeToBackend(endTime),
  }
}

function simulateCreateReservation(body) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reservation = addMockUserReservation(body)
      resolve(reservation)
    }, 900)
  })
}

function simulateFetchMyReservations() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getMockUserReservations()), 500)
  })
}

/**
 * Lista las reservas del usuario autenticado (próximas e historial).
 * @returns {Promise<import('@/data/mockUserReservations').CubicleReservation[]>}
 */
export async function fetchMyCubicleReservations() {
  if (import.meta.env.VITE_USE_MOCK_RESERVATIONS !== 'false') {
    return simulateFetchMyReservations()
  }

  const session = getAuthSession()
  if (!session?.token) {
    throw { status: 401, message: 'Debes iniciar sesión para ver tus reservas.' }
  }

  const response = await fetch('/api/v1/cubicle-reservations', {
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  })

  const contentType = response.headers.get('content-type') ?? ''
  const data =
    contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.message ?? 'No se pudieron cargar tus reservas.',
    }
  }

  return Array.isArray(data) ? data : (data?.items ?? data?.reservations ?? [])
}

/**
 * POST reserva de cubículo — el usuario va en el JWT, no en el body.
 * El backend debe crear la reserva en estado PENDING hasta que un admin la apruebe.
 * @param {ReturnType<typeof buildCubicleReservationBody>} body
 */
export async function createCubicleReservation(body) {
  if (import.meta.env.VITE_USE_MOCK_RESERVATIONS !== 'false') {
    return simulateCreateReservation(body)
  }

  const session = getAuthSession()
  if (!session?.token) {
    throw { status: 401, message: 'Debes iniciar sesión para reservar.' }
  }

  const response = await fetch('/api/v1/cubicle-reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify(body),
  })

  const contentType = response.headers.get('content-type') ?? ''
  const data =
    contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.message ?? 'No se pudo completar la reserva.',
    }
  }

  return data
}
