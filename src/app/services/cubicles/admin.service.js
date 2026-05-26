import { getAuthSession } from '@/app/services/auth.service'

export const CUBICLE_STATUSES = [
  { value: 'AVAILABLE', label: 'Disponible' },
  { value: 'OCCUPIED', label: 'En uso' },
  { value: 'MAINTENANCE', label: 'Mantenimiento' },
]

export function getCubicleStatusLabel(status) {
  return CUBICLE_STATUSES.find((item) => item.value === status)?.label ?? status
}

function normalizeCubicle(raw) {
  const logoUrl = raw.logoUrl ?? raw.logo_url ?? raw.image ?? null
  return {
    id: raw.id,
    identifier: raw.identifier,
    capacity: raw.capacity,
    status: raw.status,
    qrToken: raw.qrToken,
    logoUrl,
    imageAlt: raw.imageAlt ?? raw.image_alt ?? null,
  }
}

function authHeaders() {
  const token = getAuthSession()?.token
  if (!token) throw { status: 401, message: 'Debes iniciar sesión.' }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') ?? ''
  if (response.status === 204) return null
  return contentType.includes('application/json') ? response.json() : null
}

export async function fetchCubiclesAdmin() {
  const response = await fetch('/api/cubicles', { headers: authHeaders() })
  const data = await parseResponse(response)
  if (!response.ok) {
    throw { status: response.status, message: data?.message ?? 'No se pudieron cargar los cubículos.' }
  }
  return (Array.isArray(data) ? data : []).map(normalizeCubicle)
}

export async function createCubicleAdmin({ identifier, capacity, status, logoUrl = null }) {
  const response = await fetch('/api/cubicles', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ identifier, capacity, status, logoUrl }),
  })
  const data = await parseResponse(response)
  if (!response.ok) {
    throw { status: response.status, message: data?.message ?? 'No se pudo crear el cubículo.' }
  }
  const cubicle = normalizeCubicle(data)
  return logoUrl ? { ...cubicle, logoUrl } : cubicle
}

export async function updateCubicleAdmin(id, patch) {
  const response = await fetch(`/api/cubicles/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(patch),
  })
  const data = await parseResponse(response)
  if (!response.ok) {
    throw { status: response.status, message: data?.message ?? 'No se pudo actualizar el cubículo.' }
  }
  const cubicle = normalizeCubicle(data)
  if ('logoUrl' in patch) {
    return { ...cubicle, logoUrl: patch.logoUrl || null }
  }
  return cubicle
}

export async function deleteCubicleAdmin(id) {
  const response = await fetch(`/api/cubicles/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!response.ok) {
    const data = await parseResponse(response)
    throw { status: response.status, message: data?.message ?? 'No se pudo eliminar el cubículo.' }
  }
}
