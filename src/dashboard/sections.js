import imgCubiculos from '@/assets/images/img-1.webp'
import imgEquipo from '@/assets/images/img-2.webp'
import imgTutorias from '@/assets/images/img-5.webp'

export const DASHBOARD_SECTIONS = [
  {
    id: 'cubiculos',
    title: 'Cubículos',
    description:
      'Gestiona reservas, disponibilidad y espacios de estudio en la biblioteca.',
    image: imgCubiculos,
    imageAlt: 'Espacios de estudio y cubículos en biblioteca',
    href: '/cubicle-reservation',
  },
  {
    id: 'equipo',
    title: 'Renta de equipo',
    description:
      'Administra solicitudes, entregas y devoluciones de equipo universitario.',
    image: imgEquipo,
    imageAlt: 'Equipo y recursos tecnológicos universitarios',
    href: '/equipment-rental',
  },
  {
    id: 'tutorias',
    title: 'Tutorías',
    description:
      'Consulta y da seguimiento a las sesiones de tutoría con profesores.',
    image: imgTutorias,
    imageAlt: 'Sesión de tutoría académica en campus',
    href: '/professor-tutoring',
  },
]
