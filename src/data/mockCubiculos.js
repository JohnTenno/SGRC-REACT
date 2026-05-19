import img1 from '@/assets/images/img-1.webp'
import img2 from '@/assets/images/img-2.webp'
import img3 from '@/assets/images/img-3.webp'
import img5 from '@/assets/images/img-5.webp'
import img6 from '@/assets/images/img6.webp'

/**
 * @typedef {object} MockCubiculo
 * @property {number} id
 * @property {string} name
 * @property {number} capacity
 * @property {string} description
 * @property {string} image
 * @property {string} imageAlt
 */

/** @type {MockCubiculo[]} */
export const MOCK_CUBICLES = [
  {
    id: 1,
    name: 'Cubículo A-01',
    capacity: 1,
    description:
      'Espacio individual en planta baja, con buena iluminación y ambiente silencioso para estudio concentrado.',
    image: img1,
    imageAlt: 'Cubículo individual en planta baja de la biblioteca',
  },
  {
    id: 2,
    name: 'Cubículo A-02',
    capacity: 2,
    description:
      'Cubículo para dos personas en planta baja. Ideal para trabajo en pareja o repaso de materias.',
    image: img2,
    imageAlt: 'Cubículo doble en planta baja',
  },
  {
    id: 3,
    name: 'Cubículo B-01',
    capacity: 1,
    description:
      'Espacio en primer piso con vista al área de consulta. Perfecto para lectura y tareas cortas.',
    image: img3,
    imageAlt: 'Cubículo en primer piso de la biblioteca',
  },
  {
    id: 4,
    name: 'Cubículo B-02',
    capacity: 2,
    description:
      'Cubículo amplio para dos personas en primer piso, cerca de tomas de corriente y red inalámbrica.',
    image: img5,
    imageAlt: 'Cubículo doble en primer piso',
  },
  {
    id: 5,
    name: 'Cubículo C-01',
    capacity: 4,
    description:
      'Sala de estudio grupal en segundo piso con capacidad para cuatro personas y pizarra.',
    image: img6,
    imageAlt: 'Sala grupal en segundo piso',
  },
  {
    id: 6,
    name: 'Cubículo C-02',
    capacity: 1,
    description:
      'Espacio individual en segundo piso, zona de bajo tránsito para máxima concentración.',
    image: img1,
    imageAlt: 'Cubículo individual en segundo piso',
  },
]

/** @param {number | string} id */
export function getCubiculoById(id) {
  const numericId = Number(id)
  if (!Number.isInteger(numericId) || numericId < 1) return null
  return MOCK_CUBICLES.find((cubicle) => cubicle.id === numericId) ?? null
}
