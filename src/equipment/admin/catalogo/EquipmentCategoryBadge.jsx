import { getEquipmentCategoryLabel } from '@/equipment/admin/catalogo/equipmentAdminApi'

const CATEGORY_STYLES = {
  audiovisual: 'border-violet-200 bg-violet-50 text-violet-900',
  computo: 'border-sky-200 bg-sky-50 text-sky-900',
  material: 'border-amber-200 bg-amber-50 text-amber-950',
}

export function EquipmentCategoryBadge({ category }) {
  return (
    <span
      className={`font-praxis inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        CATEGORY_STYLES[category] ??
        'border-uach-purple-900/15 bg-uach-purple-50 text-uach-purple-900'
      }`}
    >
      {getEquipmentCategoryLabel(category)}
    </span>
  )
}
