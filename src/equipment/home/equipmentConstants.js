import defaultEquipmentImage from '@/assets/images/img-2.webp'

export const DEFAULT_EQUIPMENT_IMAGE = defaultEquipmentImage
export const DEFAULT_EQUIPMENT_IMAGE_ALT = 'Equipo universitario'

export const EQUIPMENT_CATEGORY_LABELS = {
  audiovisual: 'Audiovisual',
  computo: 'Cómputo',
  material: 'Material de escritorio',
}

export const EQUIPMENT_SEED = [
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
