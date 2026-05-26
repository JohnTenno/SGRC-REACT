import { getAuthSession } from '@/app/services/auth.service'
import {
  formatTimeToBackend,
  RESERVATION_TIME_OPTIONS,
} from '@/app/services/cubicles/reservation.service'

export const MAX_TUTORING_SESSION_HOURS = 6

export { formatTimeToBackend, RESERVATION_TIME_OPTIONS }

export const TUTORING_REQUEST_STATUS = {
  PENDING_PROFESSOR: 'PENDING_PROFESSOR',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
}

export function getTutoringSessionDurationHours(startTime, endTime) {
  const startIdx = RESERVATION_TIME_OPTIONS.indexOf(startTime)
  const endIdx = RESERVATION_TIME_OPTIONS.indexOf(endTime)
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return 0
  return endIdx - startIdx
}

export function getTutoringEndTimeOptions(startTime, availableStartSlots = []) {
  if (!startTime) return []
  if (availableStartSlots.length > 0 && !availableStartSlots.includes(startTime)) return []

  const startIdx = RESERVATION_TIME_OPTIONS.indexOf(startTime)
  if (startIdx === -1) return []

  const endOptions = []
  for (let durationHours = 1; durationHours <= MAX_TUTORING_SESSION_HOURS; durationHours += 1) {
    const endIdx = startIdx + durationHours
    if (endIdx < RESERVATION_TIME_OPTIONS.length) {
      endOptions.push(RESERVATION_TIME_OPTIONS[endIdx])
    }
  }
  return endOptions
}

export function buildTutoringRequestPayload({
  professorEmployeeNumber,
  subject,
  reservationDate,
  startTime,
  endTime,
  topic,
}) {
  return {
    professorEmployeeNumber: String(professorEmployeeNumber ?? '').trim(),
    subject: String(subject).trim(),
    reservationDate,
    startTime: formatTimeToBackend(startTime),
    endTime: formatTimeToBackend(endTime),
    topic: String(topic).trim(),
  }
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}

async function parseJson(response) {
  const ct = response.headers.get('content-type') ?? ''
  return ct.includes('application/json') ? response.json() : null
}

export async function submitTutoringRequest(fields) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión para solicitar tutoría.' }

  const payload = buildTutoringRequestPayload(fields)
  const response = await fetch('/api/tutoring/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(session.token) },
    body: JSON.stringify(payload),
  })
  const data = await parseJson(response)
  if (!response.ok) throw { status: response.status, message: data?.message ?? 'No se pudo enviar la solicitud.' }
  return data
}

export async function fetchMyTutoringRequests() {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const response = await fetch('/api/tutoring/requests/my', {
    headers: authHeaders(session.token),
  })
  if (!response.ok) {
    const data = await parseJson(response)
    throw { status: response.status, message: data?.message ?? 'No se pudieron cargar tus tutorías.' }
  }
  const data = await parseJson(response)
  return Array.isArray(data) ? data : []
}

export function validateTutoringRequest(fields) {
  const errors = {}

  if (!String(fields.professorEmployeeNumber ?? '').trim()) {
    errors.professorEmployeeNumber = 'Selecciona un docente válido.'
  }

  if (!fields.subject?.trim()) {
    errors.subject = 'La materia es obligatoria.'
  }

  if (!fields.reservationDate) {
    errors.reservationDate = 'Selecciona la fecha de la asesoría.'
  }

  if (!fields.startTime) {
    errors.startTime = 'Selecciona la hora de inicio.'
  }

  if (!fields.endTime) {
    errors.endTime = 'Selecciona la duración (hora de fin).'
  } else if (fields.startTime) {
    const durationHours = getTutoringSessionDurationHours(fields.startTime, fields.endTime)
    if (durationHours < 1 || durationHours > MAX_TUTORING_SESSION_HOURS) {
      errors.endTime = `Elige una hora de fin entre 1 y ${MAX_TUTORING_SESSION_HOURS} horas después del inicio.`
    }
  }

  if (!fields.topic?.trim()) {
    errors.topic = 'Describe el motivo o las dudas de tu asesoría.'
  }

  return errors
}
