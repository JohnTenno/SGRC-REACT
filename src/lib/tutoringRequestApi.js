import {
  createMockTutoringRequest,
  getMockTutoringRequests,
} from '@/data/mockTutoringRequests'
import {
  formatTimeToBackend,
  RESERVATION_TIME_OPTIONS,
} from '@/lib/cubicleReservationApi'

export const MAX_TUTORING_SESSION_HOURS = 6

export { formatTimeToBackend, RESERVATION_TIME_OPTIONS }

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
  professorId,
  subject,
  reservationDate,
  startTime,
  endTime,
  topic,
}) {
  return {
    professorId: Number(professorId),
    subject: String(subject).trim(),
    reservationDate,
    startTime: formatTimeToBackend(startTime),
    endTime: formatTimeToBackend(endTime),
    topic: String(topic).trim(),
  }
}

export async function submitTutoringRequest(fields) {
  const payload = buildTutoringRequestPayload(fields)

  await new Promise((resolve) => setTimeout(resolve, 600))

  return createMockTutoringRequest(payload)
}

export async function fetchMyTutoringRequests() {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return getMockTutoringRequests()
}

export function validateTutoringRequest(fields) {
  const errors = {}

  if (!Number.isFinite(fields.professorId) || fields.professorId <= 0) {
    errors.professorId = 'Selecciona un docente válido.'
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
