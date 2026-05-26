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
      const name = item.type ?? `Equipo #${item.id ?? item.equipmentId ?? '?'}`
      return `${name} ×${item.quantity ?? 1}`
    })
    .join(', ')
}

function normalizeRequest(raw) {
  const items = Array.isArray(raw.items) ? raw.items : []
  const totalUnits = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0)
  return {
    id: raw.id,
    status: raw.status,
    statusLabel: getEquipmentRequestStatusLabel(raw.status),
    createdAt: raw.createdAt ?? null,
    pickupLocation: raw.pickupLocation ?? '',
    studentName: raw.studentName ?? '—',
    items,
    totalUnits,
    itemsSummary: formatItemsSummary(items),
  }
}

export async function fetchEquipmentRentalRequestsAdmin() {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const response = await fetch('/api/equipment-rental-requests', {
    headers: authHeaders(session.token),
  })
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
  const data = await parseJson(response)
  if (!response.ok) throw { status: response.status, message: data?.message ?? 'No se pudo actualizar el estatus.' }
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
