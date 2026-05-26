import { getAuthSession } from '@/app/services/auth.service'

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}

async function parseJson(response) {
  const ct = response.headers.get('content-type') ?? ''
  return ct.includes('application/json') ? response.json() : null
}

export const EMPTY_TUTORING_PROFESSOR_OFFERING = {
  scheduleSummary: 'Por definir',
  tutoringLocation: 'Por definir',
  availableWeekdays: [],
  tutoringHourSlots: [],
  subjectIds: [],
}

function normalizeOffering(raw) {
  return {
    scheduleSummary: String(raw?.scheduleSummary ?? '').trim() || EMPTY_TUTORING_PROFESSOR_OFFERING.scheduleSummary,
    tutoringLocation: String(raw?.tutoringLocation ?? '').trim() || EMPTY_TUTORING_PROFESSOR_OFFERING.tutoringLocation,
    availableWeekdays: Array.isArray(raw?.availableWeekdays) ? raw.availableWeekdays : [],
    tutoringHourSlots: Array.isArray(raw?.tutoringHourSlots) ? raw.tutoringHourSlots.map(String) : [],
    subjectIds: Array.isArray(raw?.subjectIds) ? raw.subjectIds : [],
  }
}

export async function getTutoringProfessorOffering(employeeNumber) {
  const normalized = String(employeeNumber ?? '').trim()
  if (!normalized) return { ...EMPTY_TUTORING_PROFESSOR_OFFERING }

  const session = getAuthSession()
  const response = await fetch(`/api/tutoring/professors/${normalized}/offering`, {
    headers: session?.token ? authHeaders(session.token) : {},
  })
  if (!response.ok) return { ...EMPTY_TUTORING_PROFESSOR_OFFERING }
  const data = await parseJson(response)
  return normalizeOffering(data)
}

export async function updateTutoringProfessorOffering(employeeNumber, patch) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const normalized = String(employeeNumber ?? '').trim()
  if (!normalized) throw { message: 'Número de empleado no válido.' }

  const current = await getTutoringProfessorOffering(normalized)
  const updated = normalizeOffering({ ...current, ...patch })

  const response = await fetch(`/api/tutoring/professors/${normalized}/offering`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(session.token) },
    body: JSON.stringify(updated),
  })
  const data = await parseJson(response)
  if (!response.ok) throw { status: response.status, message: data?.message ?? 'No se pudo actualizar el horario.' }
  return normalizeOffering(data)
}
