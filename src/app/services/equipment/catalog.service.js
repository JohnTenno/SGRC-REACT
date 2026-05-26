import { getAuthSession } from '@/app/services/auth.service'
import {
  DEFAULT_EQUIPMENT_IMAGE,
  DEFAULT_EQUIPMENT_IMAGE_ALT,
  EQUIPMENT_CATEGORY_LABELS,
} from '@/app/components/equipment/equipmentConstants'

export { EQUIPMENT_CATEGORY_LABELS }

export const EQUIPMENT_CATEGORIES = Object.entries(EQUIPMENT_CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label }),
)

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
    type: raw.type ?? raw.name,
    category: raw.category,
    availableStock: raw.availableStock,
    image: raw.logoUrl ?? raw.image ?? DEFAULT_EQUIPMENT_IMAGE,
    imageAlt: raw.imageAlt ?? DEFAULT_EQUIPMENT_IMAGE_ALT,
  }
}

export function getEquipmentCategoryLabel(category) {
  return EQUIPMENT_CATEGORY_LABELS[category] ?? category
}

export async function fetchEquipmentAdmin() {
  const session = getAuthSession()
  const response = await fetch('/api/equipment-types', {
    headers: session?.token ? authHeaders(session.token) : {},
  })
  if (!response.ok) throw { status: response.status, message: 'No se pudo cargar el catálogo de equipo.' }
  const data = await parseJson(response)
  return (Array.isArray(data) ? data : []).map(normalizeEquipment)
}

export async function getEquipmentCatalog() {
  return fetchEquipmentAdmin()
}

export async function getEquipmentById(id) {
  const all = await fetchEquipmentAdmin()
  return all.find((item) => item.id === Number(id)) ?? null
}

export async function createEquipmentAdmin({ type, category, availableStock, image = null }) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const response = await fetch('/api/equipment-types', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(session.token) },
    body: JSON.stringify({ name: type, category, availableStock, logoUrl: image?.trim() || null }),
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
      category: patch.category,
      availableStock: patch.availableStock,
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
