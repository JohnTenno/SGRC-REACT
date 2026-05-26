import { getAuthSession } from '@/app/services/auth.service'

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}

async function parseJson(response) {
  const ct = response.headers.get('content-type') ?? ''
  return ct.includes('application/json') ? response.json() : null
}

function normalizeSubject(raw) {
  return {
    id: raw.id,
    name: String(raw.name ?? '').trim(),
    description: String(raw.description ?? '').trim(),
  }
}

export async function fetchTutoringSubjectsAdmin() {
  const session = getAuthSession()
  const response = await fetch('/api/tutoring/subjects', {
    headers: session?.token ? authHeaders(session.token) : {},
  })
  if (!response.ok) return []
  const data = await parseJson(response)
  return (Array.isArray(data) ? data : []).map(normalizeSubject)
}

export async function getTutoringSubjectsCatalog() {
  return fetchTutoringSubjectsAdmin()
}

export async function getTutoringSubjectById(id) {
  const all = await fetchTutoringSubjectsAdmin()
  const numericId = Number(id)
  return all.find((item) => item.id === numericId) ?? null
}

export async function createTutoringSubjectAdmin({ name, description }) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const response = await fetch('/api/tutoring/subjects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(session.token) },
    body: JSON.stringify({ name: String(name).trim(), description: String(description ?? '').trim() }),
  })
  const data = await parseJson(response)
  if (!response.ok) throw { status: response.status, message: data?.message ?? 'No se pudo crear la materia.' }
  if (!data?.name?.trim()) throw { message: 'El nombre de la materia es obligatorio.' }
  return normalizeSubject(data)
}

export async function updateTutoringSubjectAdmin(id, patch) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const response = await fetch(`/api/tutoring/subjects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(session.token) },
    body: JSON.stringify({
      name: String(patch.name ?? '').trim(),
      description: String(patch.description ?? '').trim(),
    }),
  })
  const data = await parseJson(response)
  if (!response.ok) throw { status: response.status, message: data?.message ?? 'No se pudo actualizar la materia.' }
  return normalizeSubject(data)
}

export async function deleteTutoringSubjectAdmin(id) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const response = await fetch(`/api/tutoring/subjects/${id}`, {
    method: 'DELETE',
    headers: authHeaders(session.token),
  })
  if (!response.ok) {
    const data = await parseJson(response)
    throw { status: response.status, message: data?.message ?? 'No se pudo eliminar la materia.' }
  }
}
