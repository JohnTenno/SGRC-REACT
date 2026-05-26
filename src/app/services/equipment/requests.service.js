import { getAuthSession } from '@/app/services/auth.service'
import {
  EQUIPMENT_REQUEST_STATUS,
  getEquipmentRequestStatusLabel,
} from '@/app/components/equipment/equipmentRequestStatus'
import {
  getEquipmentRentalRequestById,
  getCurrentStudentEnrollment,
  listEquipmentRentalRequestsAdmin,
  listEquipmentRentalRequestsForStudent,
  mergeEquipmentRentalRequestsFromApi,
  saveEquipmentRentalRequest,
  updateEquipmentRentalRequestStatus,
} from '@/app/services/equipment/equipmentRentalRequestsStore'

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
    statusUpdatedAt: raw.statusUpdatedAt ?? null,
    pickupLocation: raw.pickupLocation ?? '',
    studentName: raw.studentName ?? '—',
    items,
    totalUnits,
    itemsSummary: formatItemsSummary(items),
  }
}

export function toEquipmentOrder(raw) {
  const normalized = normalizeRequest(raw)
  return {
    id: normalized.id,
    status: normalized.status,
    createdAt: normalized.createdAt,
    statusUpdatedAt: normalized.statusUpdatedAt,
    pickupLocation: normalized.pickupLocation,
    items: normalized.items.map((item) => ({
      id: item.id ?? item.equipmentId,
      type: item.type,
      quantity: item.quantity ?? 1,
    })),
  }
}

async function tryFetchMyFromApi(token, enrollment) {
  try {
    const response = await fetch('/api/equipment-rental-requests/my', {
      headers: authHeaders(token),
    })
    if (!response.ok) return null
    const data = await parseJson(response)
    const list = Array.isArray(data) ? data : []
    mergeEquipmentRentalRequestsFromApi(list, enrollment)
    return list
  } catch {
    return null
  }
}

async function tryFetchByIdFromApi(token, id, enrollment) {
  try {
    const response = await fetch(`/api/equipment-rental-requests/${id}`, {
      headers: authHeaders(token),
    })
    if (!response.ok) return null
    const data = await parseJson(response)
    if (!data?.id) return null
    mergeEquipmentRentalRequestsFromApi([data], enrollment)
    return data
  } catch {
    return null
  }
}

async function tryPatchStatusFromApi(token, id, status) {
  try {
    const response = await fetch(`/api/equipment-rental-requests/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) return null
    const data = await parseJson(response)
    if (!data?.id) return null
    saveEquipmentRentalRequest(data)
    return data
  } catch {
    return null
  }
}

export async function fetchMyEquipmentRentalRequests() {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const enrollment = session.user?.enrollment ?? getCurrentStudentEnrollment()

  await tryFetchMyFromApi(session.token, enrollment)

  return listEquipmentRentalRequestsForStudent(enrollment).map(normalizeRequest)
}

export async function fetchEquipmentRentalRequestById(id) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const enrollment = session.user?.enrollment ?? getCurrentStudentEnrollment()

  await tryFetchByIdFromApi(session.token, id, enrollment)

  const request = getEquipmentRentalRequestById(id, enrollment)
  if (!request) {
    throw { status: 404, message: 'No se encontró la solicitud.' }
  }
  return toEquipmentOrder(request)
}

export async function fetchEquipmentRentalRequestsAdmin() {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }

  try {
    const response = await fetch('/api/equipment-rental-requests', {
      headers: authHeaders(session.token),
    })
    if (response.ok) {
      const data = await parseJson(response)
      const list = Array.isArray(data) ? data : []
      mergeEquipmentRentalRequestsFromApi(list)
    }
  } catch {
    /* usar almacén local si el API no está disponible */
  }

  return listEquipmentRentalRequestsAdmin().map(normalizeRequest)
}

export async function updateEquipmentRequestStatusAdmin(id, status) {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }

  const validStatuses = Object.values(EQUIPMENT_REQUEST_STATUS)
  if (!validStatuses.includes(status)) throw { message: 'Estatus no válido.' }

  const fromApi = await tryPatchStatusFromApi(session.token, id, status)
  if (fromApi) return normalizeRequest(fromApi)

  try {
    const updated = updateEquipmentRentalRequestStatus(id, status)
    return normalizeRequest(updated)
  } catch (error) {
    throw { message: error?.message ?? 'No se pudo actualizar el estatus.' }
  }
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
