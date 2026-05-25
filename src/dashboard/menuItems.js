import { DASHBOARD_SECTIONS } from '@/dashboard/sections'

const SECTION_ICONS = {
  cubiculos: 'cubicle',
  equipo: 'equipment',
  tutorias: 'tutoring',
}

const SECTION_ROUTES = {
  cubiculos: '/admin/cubiculos-panel',
  tutorias: '/professor-tutoring',
}

const EQUIPMENT_ADMIN_CHILDREN = [
  {
    to: '/admin/equipo-panel',
    label: 'Catálogo',
    shortLabel: 'Catálogo',
    prefix: '/admin/equipo-panel',
  },
  {
    to: '/admin/equipo-solicitudes',
    label: 'Solicitudes',
    shortLabel: 'Solicitudes',
    prefix: '/admin/equipo-solicitudes',
  },
]

export function getDashboardMenuItems() {
  return DASHBOARD_SECTIONS.map((section) => {
    if (section.id === 'equipo') {
      return {
        id: section.id,
        label: section.title,
        shortLabel: 'Equipo',
        icon: SECTION_ICONS.equipo,
        prefix: '/admin/equipo',
        children: EQUIPMENT_ADMIN_CHILDREN,
      }
    }

    const to = SECTION_ROUTES[section.id] ?? section.href
    return {
      id: section.id,
      to,
      label: section.title,
      shortLabel: section.id === 'equipo' ? 'Equipo' : section.title,
      icon: SECTION_ICONS[section.id] ?? 'cubicle',
      prefix: to,
    }
  })
}

export function getDashboardBottomNavItems() {
  const items = []
  for (const entry of getDashboardMenuItems()) {
    if (entry.children?.length) {
      entry.children.forEach((child) => {
        items.push({
          ...child,
          icon: entry.icon,
        })
      })
    } else {
      items.push(entry)
    }
  }
  return items
}
