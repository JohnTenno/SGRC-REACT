import { getAuthSession } from '@/app/services/auth.service'
import {
  EQUIPMENT_REQUEST_STATUS,
  getEquipmentRequestStatusLabel,
} from '@/app/components/equipment/equipmentRequestStatus'
import { upsertEquipmentRentalRequestFromOrder } from '@/app/services/equipment/equipmentRentalRequestsStore'

export const EQUIPMENT_PICKUP_LOCATION = 'Biblioteca — mostrador de material solicitado'

export { EQUIPMENT_REQUEST_STATUS, getEquipmentRequestStatusLabel }

/**
 * @typedef {object} EquipmentRentalRequest
 * @property {number} id
 * @property {string} status
 * @property {string} [createdAt] ISO 8601
 * @property {string} [pickupLocation]
 * @property {{ id: number, type: string, quantity: number, availableStock: number }[]} items
 */

export function buildEquipmentRentalRequestBody(selections) {
  return {
    items: selections.map(({ equipmentId, quantity }) => ({
      equipmentId: Number(equipmentId),
      quantity: Number(quantity),
    })),
  }
}

function normalizeEquipmentRentalRequest(data) {
  const id = Number(data?.id)
  if (!Number.isInteger(id) || id < 1) {
    throw new Error('La respuesta del servidor no incluye un folio de solicitud válido.')
  }
  return {
    id,
    status: data?.status ?? EQUIPMENT_REQUEST_STATUS.PENDING_PICKUP,
    createdAt: data?.createdAt ?? new Date().toISOString(),
    pickupLocation: data?.pickupLocation ?? EQUIPMENT_PICKUP_LOCATION,
    items: Array.isArray(data?.items) ? data.items : [],
  }
}

/**
 * @param {{ equipmentId: number, quantity: number }[]} selections
 * @returns {Promise<EquipmentRentalRequest>}
 */
export async function createEquipmentRentalRequest(selections) {
  const session = getAuthSession()
  if (!session?.token) {
    throw { status: 401, message: 'Debes iniciar sesión para solicitar equipo.' }
  }

  const response = await fetch('/api/equipment-rental-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify(buildEquipmentRentalRequestBody(selections)),
  })

  const ct = response.headers.get('content-type') ?? ''
  const data = ct.includes('application/json') ? await response.json() : null

  if (response.status !== 201) {
    throw {
      status: response.status,
      message: data?.message ?? 'No se pudo registrar la solicitud de equipo.',
    }
  }

  try {
    const order = normalizeEquipmentRentalRequest(data)
    upsertEquipmentRentalRequestFromOrder(order, session.user)
    return order
  } catch (error) {
    throw {
      status: response.status,
      message: error instanceof Error ? error.message : 'Respuesta del servidor inválida.',
    }
  }
}
