import { useEffect, useState } from 'react'
import { IconPencil, IconTrash } from '@/components/icons'
import {
  EQUIPMENT_CARD_IMAGE,
  equipmentCardClasses as c,
} from '@/equipment/home/equipmentCardTheme'
import { EquipmentCategoryBadge } from '@/equipment/admin/EquipmentCategoryBadge'
import { EquipmentStockBadge } from '@/equipment/admin/EquipmentStockBadge'

function resolveAdminImageSrc(image) {
  const trimmed = typeof image === 'string' ? image.trim() : ''
  if (!trimmed) return EQUIPMENT_CARD_IMAGE.src
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('/')
  ) {
    return trimmed
  }
  return EQUIPMENT_CARD_IMAGE.src
}

function EquipmentAdminCardImage({ image, imageAlt, type }) {
  const [src, setSrc] = useState(() => resolveAdminImageSrc(image))

  useEffect(() => {
    setSrc(resolveAdminImageSrc(image))
  }, [image])

  const alt =
    (typeof imageAlt === 'string' && imageAlt.trim()) ||
    (typeof image === 'string' && image.trim() ? `Imagen de ${type}` : '') ||
    EQUIPMENT_CARD_IMAGE.alt

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy={src.startsWith('http') ? 'no-referrer' : undefined}
      onError={() => {
        if (src !== EQUIPMENT_CARD_IMAGE.src) setSrc(EQUIPMENT_CARD_IMAGE.src)
      }}
      className={c.image}
    />
  )
}

const actionButtonClass =
  'font-praxis inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60'

export function EquipmentAdminCard({
  equipment,
  isEditing = false,
  isDeleting = false,
  onEdit,
  onDelete,
}) {
  return (
    <article
      className={`${c.shell} ${isEditing ? c.shellActive : c.shellDefault}`}
    >
      <div className={c.imageWrap}>
        <EquipmentAdminCardImage
          image={equipment.image}
          imageAlt={equipment.imageAlt}
          type={equipment.type}
        />
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <EquipmentCategoryBadge category={equipment.category} />
          <EquipmentStockBadge availableStock={equipment.availableStock} />
        </div>
      </div>

      <div className={c.body}>
        <h2 className={c.title}>{equipment.type}</h2>
        <p className={c.stock}>
          Disponibles:{' '}
          <span
            className={`${c.stockValue} ${
              equipment.availableStock <= 0 ? 'text-red-600' : 'text-uach-gold-600'
            }`}
          >
            {equipment.availableStock}
          </span>
        </p>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <button
            type="button"
            className={`${actionButtonClass} border-uach-purple-900/20 bg-white text-uach-purple-900 shadow-sm hover:bg-uach-purple-50`}
            onClick={onEdit}
          >
            <IconPencil className="size-4 shrink-0" aria-hidden />
            Editar
          </button>
          <button
            type="button"
            className={`${actionButtonClass} border-red-200 bg-white text-red-700 hover:bg-red-50`}
            disabled={isDeleting}
            onClick={onDelete}
          >
            <IconTrash className="size-4 shrink-0" aria-hidden />
            {isDeleting ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </article>
  )
}
