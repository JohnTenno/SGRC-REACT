import { getEquipmentById } from '@/equipment/admin/equipmentAdminApi'
import {
  DEFAULT_EQUIPMENT_IMAGE,
  DEFAULT_EQUIPMENT_IMAGE_ALT,
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_SEED,
} from '@/equipment/home/equipmentConstants'

export {
  DEFAULT_EQUIPMENT_IMAGE,
  DEFAULT_EQUIPMENT_IMAGE_ALT,
  EQUIPMENT_CATEGORY_LABELS,
}
export { getEquipmentById, getEquipmentCatalog } from '@/equipment/admin/equipmentAdminApi'

export const MOCK_EQUIPMENT = EQUIPMENT_SEED

export function getEquipmentByIds(ids) {
  return ids
    .map((id) => getEquipmentById(id))
    .filter((item) => item != null && item.availableStock > 0)
}

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
