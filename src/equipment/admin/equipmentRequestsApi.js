import { MOCK_EQUIPMENT_REQUESTS } from '@/data/mockEquipmentRequests'
import {
  EQUIPMENT_REQUEST_STATUS,
  getEquipmentRequestStatusLabel,
} from '@/equipment/home/equipmentRequestStatus'

const STORAGE_KEY = 'sgrc-equipment-rental-requests'
const SEEDED_FLAG_KEY = 'sgrc-equipment-rental-requests-seeded'

function readRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeRequests(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    /* ignore */
  }
}

function seedMockRequestsIfNeeded() {
  if (localStorage.getItem(SEEDED_FLAG_KEY) === '1') return
  const existing = readRequests()
  if (existing.length > 0) {
    localStorage.setItem(SEEDED_FLAG_KEY, '1')
    return
  }
  writeRequests(MOCK_EQUIPMENT_REQUESTS.map((item) => ({ ...item })))
  localStorage.setItem(SEEDED_FLAG_KEY, '1')
}

export function saveEquipmentRentalRequest(request) {
  seedMockRequestsIfNeeded()
  const list = readRequests()
  list.unshift(request)
  writeRequests(list)
}

export async function fetchEquipmentRentalRequestsAdmin() {
  seedMockRequestsIfNeeded()
  return readRequests().map((raw) => normalizeRequest(raw))
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

function formatItemsSummary(items) {
  if (!items.length) return '—'
  return items
    .map((item) => {
      const name = item.type ?? `Equipo #${item.id ?? item.equipmentId ?? '?'}`
      return `${name} ×${item.quantity ?? 1}`
    })
    .join(', ')
}

export async function updateEquipmentRequestStatusAdmin(id, status) {
  seedMockRequestsIfNeeded()
  const list = readRequests()
  const index = list.findIndex((item) => item.id === id)
  if (index < 0) throw { message: 'Solicitud no encontrada.' }

  const validStatuses = Object.values(EQUIPMENT_REQUEST_STATUS)
  if (!validStatuses.includes(status)) {
    throw { message: 'Estatus no válido.' }
  }

  const now = new Date().toISOString()
  const updated = {
    ...list[index],
    status,
    pickedUpAt:
      status === EQUIPMENT_REQUEST_STATUS.AWAITING_RETURN ||
      status === EQUIPMENT_REQUEST_STATUS.COMPLETED
        ? list[index].pickedUpAt ?? now
        : list[index].pickedUpAt,
    returnedAt:
      status === EQUIPMENT_REQUEST_STATUS.COMPLETED
        ? list[index].returnedAt ?? now
        : list[index].returnedAt,
  }
  list[index] = updated
  writeRequests(list)
  return normalizeRequest(updated)
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
