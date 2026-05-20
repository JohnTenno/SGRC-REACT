import { resolveEquiomentSelections } from '@/data/mockEquioment'
import { getAuthSession } from '@/lib/authSession'

export const EQUIPMENT_PICKUP_LOCATION = 'Biblioteca — mostrador de material solicitado'

export const EQUIPMENT_REQUEST_STATUS = {
  PENDING_PICKUP: 'PENDING_PICKUP',
}

const STATUS_LABELS = {
  PENDING_PICKUP: 'Pendiente de recoger',
}

/**
 * @typedef {object} EquipmentRentalRequest
 * @property {number} id
 * @property {typeof EQUIPMENT_REQUEST_STATUS.PENDING_PICKUP | string} status
 * @property {string} [createdAt] ISO 8601
 * @property {string} [pickupLocation]
 * @property {import('@/data/mockEquioment').MockEquioment & { quantity: number }[]} items
 */

/**
 * @param {{ equipmentId: number, quantity: number }[]} selections
 */
export function buildEquipmentRentalRequestBody(selections) {
  return {
    items: selections.map(({ equipmentId, quantity }) => ({
      equipmentId: Number(equipmentId),
      quantity: Number(quantity),
    })),
  }
}

/**
 * @param {unknown} apiData
 * @param {{ equipmentId: number, quantity: number }[]} selections
 * @returns {EquipmentRentalRequest}
 */
export function normalizeEquipmentRentalRequest(apiData, selections) {
  const items = resolveEquiomentSelections(selections)

  const id = Number(apiData?.id)
  if (!Number.isInteger(id) || id < 1) {
    throw new Error('La respuesta del servidor no incluye un folio de solicitud válido.')
  }

  return {
    id,
    status: apiData?.status ?? EQUIPMENT_REQUEST_STATUS.PENDING_PICKUP,
    createdAt: apiData?.createdAt ?? new Date().toISOString(),
    pickupLocation: apiData?.pickupLocation ?? EQUIPMENT_PICKUP_LOCATION,
    items,
  }
}

export function getEquipmentRequestStatusLabel(status) {
  return STATUS_LABELS[status] ?? status
}

function getNextMockRequestId() {
  const key = 'sgrc.mock.equipment-request-id'
  const current = Number(localStorage.getItem(key) ?? '11')
  const next = current + 1
  localStorage.setItem(key, String(next))
  return next
}

function simulateCreateEquipmentRequest(selections) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        normalizeEquipmentRentalRequest(
          {
            id: getNextMockRequestId(),
            status: EQUIPMENT_REQUEST_STATUS.PENDING_PICKUP,
            createdAt: new Date().toISOString(),
          },
          selections,
        ),
      )
    }, 900)
  })
}

/**
 * @param {{ equipmentId: number, quantity: number }[]} selections
 * @returns {Promise<EquipmentRentalRequest>}
 */
export async function createEquipmentRentalRequest(selections) {
  if (import.meta.env.VITE_USE_MOCK_RESERVATIONS !== 'false') {
    return simulateCreateEquipmentRequest(selections)
  }

  const session = getAuthSession()
  if (!session?.token) {
    throw { status: 401, message: 'Debes iniciar sesión para solicitar equipo.' }
  }

  const response = await fetch('/api/v1/equipment-rental-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify(buildEquipmentRentalRequestBody(selections)),
  })

  const contentType = response.headers.get('content-type') ?? ''
  const data =
    contentType.includes('application/json') ? await response.json() : null

  if (response.status !== 201) {
    throw {
      status: response.status,
      message: data?.message ?? 'No se pudo registrar la solicitud de equipo.',
    }
  }

  try {
    return normalizeEquipmentRentalRequest(data, selections)
  } catch (error) {
    throw {
      status: response.status,
      message: error instanceof Error ? error.message : 'Respuesta del servidor inválida.',
    }
  }
}
