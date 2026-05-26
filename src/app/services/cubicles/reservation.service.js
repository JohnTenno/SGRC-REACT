import { getAuthSession } from '@/app/services/auth.service'

/** Duración máxima permitida por reserva de cubículo */
export const MAX_CUBICLE_RESERVATION_HOURS = 2

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

export function getReservationDurationHours(startTime, endTime) {
  const startIdx = RESERVATION_TIME_OPTIONS.indexOf(startTime)
  const endIdx = RESERVATION_TIME_OPTIONS.indexOf(endTime)
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return 0
  return endIdx - startIdx
}

export function isWithinMaxReservationDuration(startTime, endTime, maxHours = MAX_CUBICLE_RESERVATION_HOURS) {
  return getReservationDurationHours(startTime, endTime) <= maxHours
}

export function formatTimeToBackend(time) {
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time
  if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`
  return time
}

/**
 * Maps a backend reservation to the shape expected by the frontend.
 * Backend uses `date`; frontend uses `reservationDate`.
 * Backend status ACTIVE/COMPLETED means checked in.
 */
export function normalizeReservation(r) {
  const checkedIn = r.status === 'ACTIVE' || r.status === 'COMPLETED'
  return {
    ...r,
    reservationDate: r.date ?? r.reservationDate,
    startTime: String(r.startTime ?? '').slice(0, 5),
    endTime: String(r.endTime ?? '').slice(0, 5),
    checkedInAt: checkedIn ? (r.createdAt ?? '2000-01-01T00:00:00') : null,
    checkedOutAt: r.status === 'COMPLETED' ? (r.createdAt ?? '2000-01-01T00:00:00') : null,
  }
}

/**
 * @param {object} params
 * @param {number} params.cubicleId
 * @param {string} params.date YYYY-MM-DD
 * @param {string} params.startTime HH:MM
 * @param {string} params.endTime HH:MM
 */
export function buildCubicleReservationBody({ cubicleId, date, startTime, endTime }) {
  if (!isWithinMaxReservationDuration(startTime, endTime)) {
    throw new Error(`La reserva no puede exceder ${MAX_CUBICLE_RESERVATION_HOURS} horas.`)
  }
  return {
    cubicleId: Number(cubicleId),
    date,
    startTime: formatTimeToBackend(startTime),
    endTime: formatTimeToBackend(endTime),
  }
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') ?? ''
  return contentType.includes('application/json') ? response.json() : null
}

export async function fetchMyCubicleReservations() {
  const session = getAuthSession()
  if (!session?.token) {
    throw { status: 401, message: 'Debes iniciar sesión para ver tus reservas.' }
  }

  const response = await fetch('/api/reservations/my', {
    headers: authHeaders(session.token),
  })
  const data = await parseResponse(response)
  if (!response.ok) {
    throw { status: response.status, message: data?.message ?? 'No se pudieron cargar tus reservas.' }
  }

  const list = Array.isArray(data) ? data : (data?.items ?? data?.reservations ?? [])
  return list.map(normalizeReservation)
}

export async function createCubicleReservation(body) {
  const session = getAuthSession()
  if (!session?.token) {
    throw { status: 401, message: 'Debes iniciar sesión para reservar.' }
  }

  const response = await fetch('/api/reservations/my', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(session.token) },
    body: JSON.stringify(body),
  })
  const data = await parseResponse(response)
  if (!response.ok) {
    throw { status: response.status, message: data?.message ?? 'No se pudo completar la reserva.' }
  }

  return normalizeReservation(data)
}

export async function performCubicleCheckIn(_reservationId, scannedPayload) {
  const session = getAuthSession()
  if (!session?.token) {
    throw { status: 401, message: 'Debes iniciar sesión para hacer check-in.' }
  }

  const response = await fetch(`/api/checkin/${encodeURIComponent(scannedPayload)}`, {
    method: 'POST',
    headers: authHeaders(session.token),
  })
  const data = await parseResponse(response)
  if (!response.ok) {
    throw { status: response.status, message: data?.error ?? data?.message ?? 'No se pudo registrar el check-in.' }
  }

  return data
}

export async function cancelCubicleReservation(reservationId) {
  const session = getAuthSession()
  if (!session?.token) {
    throw { status: 401, message: 'Debes iniciar sesión para cancelar.' }
  }

  const response = await fetch(`/api/reservations/${reservationId}/cancel`, {
    method: 'POST',
    headers: authHeaders(session.token),
  })
  const data = await parseResponse(response)
  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.message ?? 'No se pudo cancelar la reserva. Debes cancelar con al menos 1 hora de anticipación.',
    }
  }

  return normalizeReservation(data)
}

export async function fetchCubicleOccupiedSlots(cubicleId, date) {
  const session = getAuthSession()
  if (!session?.token) return []

  const response = await fetch(
    `/api/cubicles/${cubicleId}/slots?date=${date}`,
    { headers: authHeaders(session.token) },
  )
  if (!response.ok) return []
  const data = await parseResponse(response)
  return Array.isArray(data) ? data : []
}
