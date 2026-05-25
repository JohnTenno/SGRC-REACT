import { useEffect, useState } from 'react'
import { IconPencil, IconTrash } from '@/components/icons'
import {
  CUBICLE_CARD_IMAGE,
  cubicleCardClasses as c,
} from '@/cubicles/home/cubicleCardTheme'
import { CubicleStatusBadge } from '@/cubicles/admin/CubicleStatusBadge'

function resolveAdminImageSrc(image) {
  const trimmed = typeof image === 'string' ? image.trim() : ''
  if (!trimmed) return CUBICLE_CARD_IMAGE.src
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('/')
  ) {
    return trimmed
  }
  return CUBICLE_CARD_IMAGE.src
}

function CubicleAdminCardImage({ image, imageAlt, identifier }) {
  const [src, setSrc] = useState(() => resolveAdminImageSrc(image))

  useEffect(() => {
    setSrc(resolveAdminImageSrc(image))
  }, [image])

  const alt =
    (typeof imageAlt === 'string' && imageAlt.trim()) ||
    (typeof image === 'string' && image.trim() ? `Imagen de ${identifier}` : '') ||
    CUBICLE_CARD_IMAGE.alt

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy={src.startsWith('http') ? 'no-referrer' : undefined}
      onError={() => {
        if (src !== CUBICLE_CARD_IMAGE.src) setSrc(CUBICLE_CARD_IMAGE.src)
      }}
      className={c.image}
    />
  )
}

const actionButtonClass =
  'font-praxis inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60'

export function CubicleAdminCard({
  cubicle,
  isEditing = false,
  isDeleting = false,
  onEdit,
  onDelete,
}) {
  return (
    <article
      className={`${c.shell} ${
        isEditing ? c.shellActive : c.shellDefault
      }`}
    >
      <div className={c.imageWrap}>
        <CubicleAdminCardImage
          image={cubicle.logoUrl}
          imageAlt={cubicle.imageAlt}
          identifier={cubicle.identifier}
        />
        <div className="absolute top-3 left-3 z-10">
          <CubicleStatusBadge status={cubicle.status} />
        </div>
      </div>

      <div className={c.body}>
        <h2 className={c.title}>{cubicle.identifier}</h2>
        <p className={c.capacity}>
          Capacidad máxima:{' '}
          <span className={c.capacityValue}>
            {cubicle.capacity} {cubicle.capacity === 1 ? 'persona' : 'personas'}
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
