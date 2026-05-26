import { getAuthSession } from '@/app/services/auth.service'
import { setTutorProfileEmployeeNumber } from '@/app/components/tutoring/admin/tutoringTutorProfileSession'

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}

async function parseJson(response) {
  const ct = response.headers.get('content-type') ?? ''
  return ct.includes('application/json') ? response.json() : null
}

function normalizeEnrollment(value) {
  return String(value ?? '').trim().toUpperCase()
}

function normalizeStudent(raw) {
  return {
    enrollment: normalizeEnrollment(raw.enrollment),
    fullName: String(raw.fullName ?? '').trim(),
    curp: String(raw.curp ?? '').trim().toUpperCase(),
    career: String(raw.career ?? '').trim(),
    isTutor: Boolean(raw.isTutor),
    promotedAt: raw.promotedAt ?? null,
  }
}

export async function fetchTutoringStudentsAdmin() {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const response = await fetch('/api/tutoring/students', {
    headers: authHeaders(session.token),
  })
  if (!response.ok) return []
  const data = await parseJson(response)
  return (Array.isArray(data) ? data : []).map(normalizeStudent).filter((s) => s.enrollment)
}

export async function getTutoringStudentsAdmin() {
  return fetchTutoringStudentsAdmin()
}

export async function getTutoringStudentByEnrollment(enrollment) {
  const normalized = normalizeEnrollment(enrollment)
  if (!normalized) return null
  const all = await fetchTutoringStudentsAdmin()
  return all.find((s) => s.enrollment === normalized) ?? null
}

export async function promoteStudentToTutorAdmin(enrollment) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const normalized = normalizeEnrollment(enrollment)
  if (!normalized) throw { message: 'Matrícula no válida.' }

  const response = await fetch(`/api/tutoring/students/${normalized}/promote`, {
    method: 'POST',
    headers: authHeaders(session.token),
  })
  const data = await parseJson(response)
  if (!response.ok) throw { status: response.status, message: data?.message ?? 'No se pudo promover al alumno.' }

  const student = normalizeStudent(data)
  setTutorProfileEmployeeNumber(student.enrollment)
  return student
}
