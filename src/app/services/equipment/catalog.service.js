import { getAuthSession } from '@/app/services/auth.service'
import {
  DEFAULT_EQUIPMENT_IMAGE,
  DEFAULT_EQUIPMENT_IMAGE_ALT,
} from '@/app/components/equipment/equipmentConstants'

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}

async function parseJson(response) {
  const ct = response.headers.get('content-type') ?? ''
  return ct.includes('application/json') ? response.json() : null
}

function normalizeEquipment(raw) {
  return {
    id: raw.id,
    type: raw.name,
    description: raw.description ?? '',
    totalStock: raw.totalStock ?? 0,
    availableStock: raw.availableStock ?? raw.totalStock ?? 0,
    image: raw.logoUrl ?? raw.image ?? DEFAULT_EQUIPMENT_IMAGE,
    imageAlt: raw.imageAlt ?? DEFAULT_EQUIPMENT_IMAGE_ALT,
  }
}

export async function fetchEquipmentAdmin({ search = '', stockFilter = 'all' } = {}) {
  const session = getAuthSession()
  const params = new URLSearchParams()
  if (search.trim()) params.set('search', search.trim())
  if (stockFilter && stockFilter !== 'all') params.set('stockFilter', stockFilter)
  const url = `/api/equipment-types${params.toString() ? `?${params}` : ''}`
  const response = await fetch(url, {
    headers: session?.token ? authHeaders(session.token) : {},
  })
  if (!response.ok) throw { status: response.status, message: 'No se pudo cargar el catálogo de equipo.' }
  const data = await parseJson(response)
  return (Array.isArray(data) ? data : []).map(normalizeEquipment)
}

export async function fetchEquipmentAdminPage({ search = '', stockFilter = 'all', page = 0, size = 9 } = {}) {
  const session = getAuthSession()
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  if (search.trim()) params.set('search', search.trim())
  if (stockFilter && stockFilter !== 'all') params.set('stockFilter', stockFilter)
  const response = await fetch(`/api/equipment-types/page?${params}`, {
    headers: session?.token ? authHeaders(session.token) : {},
  })
  if (!response.ok) throw { status: response.status, message: 'No se pudo cargar el catálogo de equipo.' }
  const data = await parseJson(response)
  return {
    content: (Array.isArray(data?.content) ? data.content : []).map(normalizeEquipment),
    totalPages: data?.totalPages ?? 1,
    totalElements: data?.totalElements ?? 0,
  }
}

export async function getEquipmentCatalog() {
  return fetchEquipmentAdmin()
}

export async function getEquipmentById(id) {
  const all = await fetchEquipmentAdmin()
  return all.find((item) => item.id === Number(id)) ?? null
}

export async function createEquipmentAdmin({ type, totalStock, image = null }) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const response = await fetch('/api/equipment-types', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(session.token) },
    body: JSON.stringify({ name: type, totalStock, logoUrl: image?.trim() || null }),
  })
  const data = await parseJson(response)
  if (!response.ok) throw { status: response.status, message: data?.message ?? 'No se pudo crear el equipo.' }
  return normalizeEquipment(data)
}

export async function updateEquipmentAdmin(id, patch) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const response = await fetch(`/api/equipment-types/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(session.token) },
    body: JSON.stringify({
      name: patch.type,
      totalStock: patch.totalStock,
      logoUrl: patch.image?.trim() || null,
    }),
  })
  const data = await parseJson(response)
  if (!response.ok) throw { status: response.status, message: data?.message ?? 'No se pudo actualizar el equipo.' }
  return normalizeEquipment(data)
}

export async function deleteEquipmentAdmin(id) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const response = await fetch(`/api/equipment-types/${id}`, {
    method: 'DELETE',
    headers: authHeaders(session.token),
  })
  if (!response.ok) {
    const data = await parseJson(response)
    throw { status: response.status, message: data?.message ?? 'No se pudo eliminar el equipo.' }
  }
}
