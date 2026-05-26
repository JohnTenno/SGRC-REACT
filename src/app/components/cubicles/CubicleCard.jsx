import {
  CUBICLE_CARD_IMAGE,
  cubicleCardClasses as c,
} from '@/app/components/cubicles/cubicleCardTheme'
import { IconCheck } from '@/app/components/common/icons'

export function CubicleCard({
  name,
  image = CUBICLE_CARD_IMAGE.src,
  imageAlt = CUBICLE_CARD_IMAGE.alt,
  capacity,
  availableTimes,
  availabilityDayLabel,
  selected = false,
  disabled = false,
  onSelect,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative w-full text-left ${c.shell} ${
        selected ? c.shellActive : c.shellDefault
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <div className={c.imageWrap}>
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className={`${c.image} ${selected ? 'brightness-90' : ''}`}
        />
        {selected ? (
          <div className="absolute inset-0 z-[1] bg-uach-purple-950/20" aria-hidden="true" />
        ) : null}
        {selected ? (
          <div
            className="absolute top-3 right-3 z-10 flex size-10 items-center justify-center rounded-full bg-uach-gold-500 shadow-md ring-2 ring-white"
            aria-hidden="true"
          >
            <IconCheck className="size-6 stroke-[2.5] text-uach-purple-950" aria-hidden />
          </div>
        ) : null}
      </div>
      <div className={c.body}>
        <h3 className={c.title}>{name}</h3>
        <p className={c.capacity}>
          Capacidad máxima:{' '}
          <span className={c.capacityValue}>
            {capacity} {capacity === 1 ? 'persona' : 'personas'}
          </span>
        </p>
        {availableTimes !== undefined ? (
          <div className="mt-3">
            <p className={c.fieldLabel}>
              Disponible{availabilityDayLabel ? ` · ${availabilityDayLabel}` : ''}
            </p>
            {availableTimes.length > 0 ? (
              <ul
                className="mt-1.5 flex flex-wrap gap-[5px] sm:gap-1.5"
                aria-label={
                  availabilityDayLabel
                    ? `Horarios disponibles el ${availabilityDayLabel}`
                    : 'Horarios disponibles este día'
                }
              >
                {availableTimes.map((time) => (
                  <li key={time}>
                    <span className="font-praxis inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">
                      {time}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-praxis mt-1.5 text-xs text-uach-purple-900/55">
                Sin horarios libres este día
              </p>
            )}
          </div>
        ) : null}
      </div>
    </button>
  )
}
