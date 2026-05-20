import defaultEquipmentImage from '@/assets/images/img-2.webp'

export const DEFAULT_EQUIPMENT_IMAGE = defaultEquipmentImage
export const DEFAULT_EQUIPMENT_IMAGE_ALT = 'Equipo universitario'

/**
 * @typedef {object} MockEquioment
 * @property {number} id
 * @property {string} type
 * @property {number} availableStock
 * @property {string} image
 * @property {string} imageAlt
 */

/** @type {MockEquioment[]} */
export const MOCK_EQUIOMENT = [
  {
    id: 1,
    type: 'Laptop',
    availableStock: 4,
    image: DEFAULT_EQUIPMENT_IMAGE,
    imageAlt: DEFAULT_EQUIPMENT_IMAGE_ALT,
  },
  {
    id: 2,
    type: 'Proyector',
    availableStock: 2,
    image: DEFAULT_EQUIPMENT_IMAGE,
    imageAlt: DEFAULT_EQUIPMENT_IMAGE_ALT,
  },
  {
    id: 3,
    type: 'Marcadores',
    availableStock: 12,
    image: DEFAULT_EQUIPMENT_IMAGE,
    imageAlt: DEFAULT_EQUIPMENT_IMAGE_ALT,
  },
  {
    id: 4,
    type: 'Borrador para pizarrón',
    availableStock: 15,
    image: DEFAULT_EQUIPMENT_IMAGE,
    imageAlt: DEFAULT_EQUIPMENT_IMAGE_ALT,
  },
]

/** @param {number | string} id */
export function getEquiomentById(id) {
  const numericId = Number(id)
  if (!Number.isInteger(numericId) || numericId < 1) return null
  return MOCK_EQUIOMENT.find((item) => item.id === numericId) ?? null
}

/** @param {number[]} ids */
export function getEquiomentByIds(ids) {
  return ids
    .map((id) => getEquiomentById(id))
    .filter((item) => item != null && item.availableStock > 0)
}

/**
 * @param {{ equipmentId: number, quantity: number }[]} selections
 */
export function resolveEquiomentSelections(selections) {
  return selections
    .map(({ equipmentId, quantity }) => {
      const item = getEquiomentById(equipmentId)
      if (!item || quantity < 1) return null
      const cappedQty = Math.min(quantity, item.availableStock)
      return { ...item, quantity: cappedQty }
    })
    .filter((item) => item != null)
}
