import {
  DEFAULT_EQUIPMENT_IMAGE,
  DEFAULT_EQUIPMENT_IMAGE_ALT,
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_SEED,
} from '@/equipment/home/equipmentConstants'

export { EQUIPMENT_CATEGORY_LABELS }

export const EQUIPMENT_CATEGORIES = Object.entries(EQUIPMENT_CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label }),
)

const STORAGE_KEY = 'sgrc-equipment-admin-catalog'

let catalog = cloneCatalog(EQUIPMENT_SEED)
let nextId = Math.max(0, ...catalog.map((item) => item.id)) + 1

function cloneCatalog(items) {
  return items.map((item) => ({ ...item }))
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return
    catalog = cloneCatalog(parsed)
    nextId = Math.max(0, ...catalog.map((item) => item.id)) + 1
  } catch {
    catalog = cloneCatalog(EQUIPMENT_SEED)
    nextId = Math.max(0, ...catalog.map((item) => item.id)) + 1
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog))
  } catch {
    /* ignore quota errors in dev */
  }
}

function normalizeEquipment(raw) {
  return {
    id: raw.id,
    type: raw.type,
    category: raw.category,
    availableStock: raw.availableStock,
    image: raw.image ?? null,
    imageAlt: raw.imageAlt ?? null,
  }
}

export function getEquipmentCategoryLabel(category) {
  return EQUIPMENT_CATEGORY_LABELS[category] ?? category
}

export function getEquipmentCatalog() {
  loadFromStorage()
  return cloneCatalog(catalog)
}

export function getEquipmentById(id) {
  const numericId = Number(id)
  if (!Number.isInteger(numericId) || numericId < 1) return null
  return getEquipmentCatalog().find((item) => item.id === numericId) ?? null
}

function delay(ms = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function fetchEquipmentAdmin() {
  await delay()
  return getEquipmentCatalog()
}

export async function createEquipmentAdmin({
  type,
  category,
  availableStock,
  image = null,
  imageAlt = null,
}) {
  await delay()
  const item = normalizeEquipment({
    id: nextId++,
    type,
    category,
    availableStock,
    image: image?.trim() || DEFAULT_EQUIPMENT_IMAGE,
    imageAlt: imageAlt?.trim() || DEFAULT_EQUIPMENT_IMAGE_ALT,
  })
  catalog = [...catalog, item]
  persist()
  return item
}

export async function updateEquipmentAdmin(id, patch) {
  await delay()
  const index = catalog.findIndex((item) => item.id === id)
  if (index < 0) throw { message: 'Equipo no encontrado.' }
  const current = catalog[index]
  const updated = normalizeEquipment({
    ...current,
    ...patch,
    id: current.id,
    image:
      patch.image !== undefined
        ? patch.image?.trim() || DEFAULT_EQUIPMENT_IMAGE
        : current.image,
    imageAlt:
      patch.imageAlt !== undefined
        ? patch.imageAlt?.trim() || DEFAULT_EQUIPMENT_IMAGE_ALT
        : current.imageAlt,
  })
  catalog = catalog.map((item) => (item.id === id ? updated : item))
  persist()
  return updated
}

export async function deleteEquipmentAdmin(id) {
  await delay()
  catalog = catalog.filter((item) => item.id !== id)
  persist()
}

loadFromStorage()
