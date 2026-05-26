import { getAuthSession } from '@/app/services/auth.service'
import {
  EQUIPMENT_REQUEST_STATUS,
  getEquipmentRequestStatusLabel,
} from '@/app/components/equipment/equipmentRequestStatus'

export { EQUIPMENT_REQUEST_STATUS }

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}

async function parseJson(response) {
  const ct = response.headers.get('content-type') ?? ''
  return ct.includes('application/json') ? response.json() : null
}

function formatItemsSummary(items) {
  if (!items.length) return '—'
  return items
    .map((item) => {
      const name = item.type ?? `Equipo #${item.id ?? '?'}`
      return `${name} ×${item.quantity ?? 1}`
    })
    .join(', ')
}

function normalizeRequest(raw) {
  const items = Array.isArray(raw.items) ? raw.items : []
  return {
    id: raw.id,
    status: raw.status,
    statusLabel: raw.statusLabel ?? getEquipmentRequestStatusLabel(raw.status),
    createdAt: raw.createdAt ?? null,
    pickupLocation: raw.pickupLocation ?? '',
    studentName: raw.studentName ?? '—',
    studentEnrollment: raw.studentEnrollment ?? '',
    items,
    totalUnits: raw.totalUnits ?? items.reduce((sum, item) => sum + (item.quantity ?? 0), 0),
    itemsSummary: raw.itemsSummary ?? formatItemsSummary(items),
  }
}

export function toEquipmentOrder(raw) {
  const normalized = normalizeRequest(raw)
  return {
    id: normalized.id,
    status: normalized.status,
    createdAt: normalized.createdAt,
    pickupLocation: normalized.pickupLocation,
    items: normalized.items.map((item) => ({
      id: item.id,
      type: item.type,
      quantity: item.quantity ?? 1,
    })),
  }
}

export async function fetchMyEquipmentRentalRequests() {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const response = await fetch('/api/equipment-rental-requests/my', {
    headers: authHeaders(session.token),
  })
  if (!response.ok) {
    const data = await parseJson(response)
    throw { status: response.status, message: data?.message ?? 'No se pudieron cargar tus solicitudes.' }
  }
  const data = await parseJson(response)
  return (Array.isArray(data) ? data : [])
    .map(normalizeRequest)
    .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
}

export async function fetchEquipmentRentalRequestById(id) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const response = await fetch(`/api/equipment-rental-requests/${id}`, {
    headers: authHeaders(session.token),
  })
  if (!response.ok) {
    throw { status: response.status, message: 'No se encontró la solicitud.' }
  }
  const data = await parseJson(response)
  return toEquipmentOrder(data)
}

export async function fetchEquipmentRentalRequestsAdmin({ statuses = [] } = {}) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }

  const params = new URLSearchParams()
  statuses.forEach((s) => params.append('status', s))
  const url = `/api/equipment-rental-requests${statuses.length > 0 ? `?${params}` : ''}`

  const response = await fetch(url, { headers: authHeaders(session.token) })
  if (!response.ok) {
    const data = await parseJson(response)
    throw { status: response.status, message: data?.message ?? 'No se pudieron cargar las solicitudes.' }
  }
  const data = await parseJson(response)
  return (Array.isArray(data) ? data : []).map(normalizeRequest)
}

export async function updateEquipmentRequestStatusAdmin(id, status) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }

  const validStatuses = Object.values(EQUIPMENT_REQUEST_STATUS)
  if (!validStatuses.includes(status)) throw { message: 'Estatus no válido.' }

  const response = await fetch(`/api/equipment-rental-requests/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders(session.token) },
    body: JSON.stringify({ status }),
  })
  if (!response.ok) {
    const data = await parseJson(response)
    throw { status: response.status, message: data?.message ?? 'No se pudo actualizar el estatus.' }
  }
  const data = await parseJson(response)
  return normalizeRequest(data)
}

export function formatEquipmentRequestDate(isoDate) {
  if (!isoDate) return '—'
  return new Date(isoDate).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
