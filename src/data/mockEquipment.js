import defaultEquipmentImage from '@/assets/images/img-2.webp'

export const DEFAULT_EQUIPMENT_IMAGE = defaultEquipmentImage
export const DEFAULT_EQUIPMENT_IMAGE_ALT = 'Equipo universitario'

/** @typedef {'audiovisual' | 'material' | 'computo'} EquipmentCategory */

export const EQUIPMENT_CATEGORY_LABELS = {
  audiovisual: 'Audiovisual',
  computo: 'Cómputo',
  material: 'Material de escritorio',
}

/**
 * @typedef {object} MockEquipment
 * @property {number} id
 * @property {string} type
 * @property {EquipmentCategory} category
 * @property {number} availableStock
 * @property {string} image
 * @property {string} imageAlt
 */

/** @type {MockEquipment[]} */
export const MOCK_EQUIPMENT = [
  {
    id: 1,
    type: 'Laptop',
    category: 'computo',
    availableStock: 4,
    image: DEFAULT_EQUIPMENT_IMAGE,
    imageAlt: DEFAULT_EQUIPMENT_IMAGE_ALT,
  },
  {
    id: 2,
    type: 'Proyector',
    category: 'audiovisual',
    availableStock: 2,
    image: DEFAULT_EQUIPMENT_IMAGE,
    imageAlt: DEFAULT_EQUIPMENT_IMAGE_ALT,
  },
  {
    id: 3,
    type: 'Marcadores',
    category: 'material',
    availableStock: 12,
    image: DEFAULT_EQUIPMENT_IMAGE,
    imageAlt: DEFAULT_EQUIPMENT_IMAGE_ALT,
  },
  {
    id: 4,
    type: 'Borrador para pizarrón',
    category: 'material',
    availableStock: 15,
    image: DEFAULT_EQUIPMENT_IMAGE,
    imageAlt: DEFAULT_EQUIPMENT_IMAGE_ALT,
  },
  {
    id: 5,
    type: 'Cámara web HD',
    category: 'audiovisual',
    availableStock: 0,
    image: DEFAULT_EQUIPMENT_IMAGE,
    imageAlt: DEFAULT_EQUIPMENT_IMAGE_ALT,
  },
  {
    id: 6,
    type: 'Calculadora científica',
    category: 'computo',
    availableStock: 6,
    image: DEFAULT_EQUIPMENT_IMAGE,
    imageAlt: DEFAULT_EQUIPMENT_IMAGE_ALT,
  },
]

/** @param {number | string} id */
export function getEquipmentById(id) {
  const numericId = Number(id)
  if (!Number.isInteger(numericId) || numericId < 1) return null
  return MOCK_EQUIPMENT.find((item) => item.id === numericId) ?? null
}

/** @param {number[]} ids */
export function getEquipmentByIds(ids) {
  return ids
    .map((id) => getEquipmentById(id))
    .filter((item) => item != null && item.availableStock > 0)
}

/**
 * @param {{ equipmentId: number, quantity: number }[]} selections
 */
export function resolveEquipmentSelections(selections) {
  return selections
    .map(({ equipmentId, quantity }) => {
      const item = getEquipmentById(equipmentId)
      if (!item || quantity < 1) return null
      const cappedQty = Math.min(quantity, item.availableStock)
      return { ...item, quantity: cappedQty }
    })
    .filter((item) => item != null)
}
