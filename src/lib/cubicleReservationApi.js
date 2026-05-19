import { getAuthSession } from '@/lib/authSession'

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
  return {
    cubicleId: Number(cubicleId),
    reservationDate,
    startTime: formatTimeToBackend(startTime),
    endTime: formatTimeToBackend(endTime),
  }
}

function simulateCreateReservation() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ status: 'APPROVED' }), 900)
  })
}

/**
 * POST reserva de cubículo — el usuario va en el JWT, no en el body.
 * @param {ReturnType<typeof buildCubicleReservationBody>} body
 */
export async function createCubicleReservation(body) {
  if (import.meta.env.VITE_USE_MOCK_RESERVATIONS !== 'false') {
    return simulateCreateReservation()
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
