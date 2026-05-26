import { getAuthSession } from '@/app/services/auth.service'
import { EQUIPMENT_REQUEST_STATUS } from '@/app/components/equipment/equipmentRequestStatus'

const STORAGE_KEY = 'sgrc-equipment-rental-requests'
const DEFAULT_PICKUP_LOCATION = 'Biblioteca — mostrador de material solicitado'

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(requests) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
}

function nextRequestId(requests) {
  const maxId = requests.reduce((max, request) => Math.max(max, Number(request.id) || 0), 0)
  return maxId + 1
}

export function saveEquipmentRentalRequest(record) {
  const requests = readAll()
  const index = requests.findIndex((item) => item.id === record.id)
  if (index >= 0) {
    requests[index] = { ...requests[index], ...record }
  } else {
    requests.push(record)
  }
  writeAll(requests)
  return record
}

export function upsertEquipmentRentalRequestFromOrder(order, user) {
  const enrollment = user?.enrollment ?? ''
  const studentName = user?.name ?? '—'
  const existing = readAll().find((item) => item.id === order.id)
  const record = {
    id: order.id,
    status: order.status ?? EQUIPMENT_REQUEST_STATUS.PENDING_PICKUP,
    createdAt: order.createdAt ?? new Date().toISOString(),
    statusUpdatedAt: order.statusUpdatedAt ?? existing?.statusUpdatedAt ?? null,
    pickupLocation: order.pickupLocation ?? DEFAULT_PICKUP_LOCATION,
    studentEnrollment: enrollment,
    studentName,
    items: Array.isArray(order.items) ? order.items : [],
  }
  return saveEquipmentRentalRequest(record)
}

export function mergeEquipmentRentalRequestsFromApi(apiList, enrollment) {
  if (!Array.isArray(apiList)) return
  for (const raw of apiList) {
    const existing = readAll().find((item) => item.id === raw.id)
    saveEquipmentRentalRequest({
      id: raw.id,
      status: raw.status ?? EQUIPMENT_REQUEST_STATUS.PENDING_PICKUP,
      createdAt: raw.createdAt ?? existing?.createdAt ?? new Date().toISOString(),
      statusUpdatedAt: raw.statusUpdatedAt ?? existing?.statusUpdatedAt ?? null,
      pickupLocation: raw.pickupLocation ?? DEFAULT_PICKUP_LOCATION,
      studentEnrollment: raw.studentEnrollment ?? enrollment ?? existing?.studentEnrollment ?? '',
      studentName: raw.studentName ?? existing?.studentName ?? '—',
      items: Array.isArray(raw.items) ? raw.items : (existing?.items ?? []),
    })
  }
}

function buildMockRequestForUser(user, id) {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  return [
    {
      id,
      status: EQUIPMENT_REQUEST_STATUS.PENDING_PICKUP,
      createdAt: twoHoursAgo,
      statusUpdatedAt: null,
      pickupLocation: DEFAULT_PICKUP_LOCATION,
      studentEnrollment: user.enrollment,
      studentName: user.name ?? 'Estudiante',
      items: [
        { id: 1, type: 'Laptop', quantity: 1 },
        { id: 2, type: 'Cargador USB-C', quantity: 1 },
      ],
    },
    {
      id: id + 1,
      status: EQUIPMENT_REQUEST_STATUS.AWAITING_RETURN,
      createdAt: oneDayAgo,
      statusUpdatedAt: oneDayAgo,
      pickupLocation: DEFAULT_PICKUP_LOCATION,
      studentEnrollment: user.enrollment,
      studentName: user.name ?? 'Estudiante',
      items: [{ id: 3, type: 'Cámara web', quantity: 1 }],
    },
    {
      id: id + 2,
      status: EQUIPMENT_REQUEST_STATUS.COMPLETED,
      createdAt: fiveDaysAgo,
      statusUpdatedAt: fiveDaysAgo,
      pickupLocation: DEFAULT_PICKUP_LOCATION,
      studentEnrollment: user.enrollment,
      studentName: user.name ?? 'Estudiante',
      items: [{ id: 4, type: 'Proyector', quantity: 1 }],
    },
  ]
}

/** Inserta solicitudes de ejemplo si el estudiante aún no tiene ninguna. */
export function ensureMockEquipmentRentalRequests() {
  const session = getAuthSession()
  const user = session?.user
  if (!user?.enrollment) return

  const requests = readAll()
  const hasOwn = requests.some((request) => request.studentEnrollment === user.enrollment)
  if (hasOwn) return

  const baseId = nextRequestId(requests)
  const mocks = buildMockRequestForUser(user, baseId)
  writeAll([...requests, ...mocks])
}

export function listEquipmentRentalRequestsForStudent(enrollment) {
  if (!enrollment) return []
  ensureMockEquipmentRentalRequests()
  return readAll()
    .filter((request) => request.studentEnrollment === enrollment)
    .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
}

export function listEquipmentRentalRequestsAdmin() {
  return readAll().sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
}

export function getEquipmentRentalRequestById(id, enrollment) {
  if (enrollment) ensureMockEquipmentRentalRequests()
  const request = readAll().find((item) => item.id === Number(id))
  if (!request) return null
  if (enrollment && request.studentEnrollment !== enrollment) return null
  return request
}

export function updateEquipmentRentalRequestStatus(id, status) {
  const requests = readAll()
  const index = requests.findIndex((item) => item.id === Number(id))
  if (index < 0) throw new Error('Solicitud no encontrada')
  requests[index] = {
    ...requests[index],
    status,
    statusUpdatedAt: new Date().toISOString(),
  }
  writeAll(requests)
  return requests[index]
}

export function createLocalEquipmentRentalRequest(selections, catalogItems, user) {
  const requests = readAll()
  const id = nextRequestId(requests)
  const items = selections.map(({ equipmentId, quantity }) => {
    const equipment = catalogItems.find((entry) => entry.id === Number(equipmentId))
    return {
      id: Number(equipmentId),
      type: equipment?.type ?? `Equipo #${equipmentId}`,
      quantity: Number(quantity),
    }
  })

  const record = {
    id,
    status: EQUIPMENT_REQUEST_STATUS.PENDING_PICKUP,
    createdAt: new Date().toISOString(),
    pickupLocation: DEFAULT_PICKUP_LOCATION,
    studentEnrollment: user?.enrollment ?? '',
    studentName: user?.name ?? '—',
    items,
  }

  saveEquipmentRentalRequest(record)
  return record
}

export function getCurrentStudentEnrollment() {
  return getAuthSession()?.user?.enrollment ?? ''
}
