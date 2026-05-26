import { getAuthSession } from '@/app/services/auth.service'

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}

async function parseJson(response) {
  const ct = response.headers.get('content-type') ?? ''
  return ct.includes('application/json') ? response.json() : null
}

function normalizeEmployeeNumber(value) {
  return String(value ?? '').trim()
}

function normalizeProfessor(raw) {
  return {
    employeeNumber: normalizeEmployeeNumber(raw.employeeNumber ?? raw.id),
    fullName: String(raw.fullName ?? '').trim(),
    bio: String(raw.bio ?? '').trim(),
  }
}

export async function fetchTutoringProfessorsAdmin() {
  const session = getAuthSession()
  const response = await fetch('/api/tutoring/professors', {
    headers: session?.token ? authHeaders(session.token) : {},
  })
  if (!response.ok) return []
  const data = await parseJson(response)
  return (Array.isArray(data) ? data : []).map(normalizeProfessor).filter((p) => p.employeeNumber)
}

export async function getTutoringProfessorsCatalog() {
  return fetchTutoringProfessorsAdmin()
}

export async function getTutoringProfessorCatalogByEmployeeNumber(employeeNumber) {
  const normalized = normalizeEmployeeNumber(employeeNumber)
  if (!normalized) return null
  const all = await fetchTutoringProfessorsAdmin()
  return all.find((p) => p.employeeNumber === normalized) ?? null
}

export async function createTutoringProfessorAdmin({ employeeNumber, fullName, bio }) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const normalizedNumber = normalizeEmployeeNumber(employeeNumber)
  if (!normalizedNumber) throw { message: 'El número de empleado es obligatorio.' }

  const response = await fetch('/api/tutoring/professors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(session.token) },
    body: JSON.stringify({ employeeNumber: normalizedNumber, fullName: String(fullName ?? '').trim(), bio: String(bio ?? '').trim() }),
  })
  const data = await parseJson(response)
  if (!response.ok) throw { status: response.status, message: data?.message ?? 'No se pudo crear el docente.' }
  if (!data?.fullName?.trim()) throw { message: 'El nombre del docente es obligatorio.' }
  return normalizeProfessor(data)
}

export async function updateTutoringProfessorAdmin(employeeNumber, patch) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const normalized = normalizeEmployeeNumber(employeeNumber)
  const response = await fetch(`/api/tutoring/professors/${normalized}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(session.token) },
    body: JSON.stringify({
      fullName: String(patch.fullName ?? '').trim(),
      bio: String(patch.bio ?? '').trim(),
    }),
  })
  const data = await parseJson(response)
  if (!response.ok) throw { status: response.status, message: data?.message ?? 'No se pudo actualizar el docente.' }
  if (!data?.fullName?.trim()) throw { message: 'El nombre del docente es obligatorio.' }
  return normalizeProfessor(data)
}

export async function deleteTutoringProfessorAdmin(employeeNumber) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const normalized = normalizeEmployeeNumber(employeeNumber)
  const response = await fetch(`/api/tutoring/professors/${normalized}`, {
    method: 'DELETE',
    headers: authHeaders(session.token),
  })
  if (!response.ok) {
    const data = await parseJson(response)
    throw { status: response.status, message: data?.message ?? 'No se pudo eliminar el docente.' }
  }
}
