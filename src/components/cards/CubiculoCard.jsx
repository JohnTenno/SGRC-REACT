/**
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.description
 * @param {string} props.image
 * @param {string} props.imageAlt
 * @param {number} props.capacity
 * @param {boolean} [props.selected]
 * @param {boolean} [props.disabled]
 * @param {() => void} props.onSelect
 */
export function CubiculoCard({
  name,
  description,
  image,
  imageAlt,
  capacity,
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
      className={`relative flex h-[19rem] w-full flex-col overflow-hidden rounded-lg border-2 bg-white text-left shadow-md transition ${
        selected
          ? 'border-uach-gold-500 shadow-lg ring-4 ring-uach-gold-400/35'
          : 'border-uach-purple-900/15 hover:border-uach-purple-700/40 hover:shadow-lg'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <div className="relative h-32 w-full shrink-0 overflow-hidden bg-uach-purple-950">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover object-center transition ${
            selected ? 'brightness-90' : ''
          }`}
        />
        {selected ? (
          <div className="absolute inset-0 z-[1] bg-uach-purple-950/20" aria-hidden="true" />
        ) : null}
        {selected ? (
          <div
            className="absolute top-3 right-3 z-10 flex size-10 items-center justify-center rounded-full bg-uach-gold-500 shadow-md ring-2 ring-white"
            aria-hidden="true"
          >
            <svg
              className="size-6 text-uach-purple-950"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-4">
        <h3 className="font-alverata line-clamp-2 text-base font-semibold text-uach-purple-900">
          {name}
        </h3>
        <p className="font-praxis mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-uach-purple-900/75">
          {description}
        </p>
        <p className="font-praxis mt-2 shrink-0 text-sm font-medium text-uach-purple-900">
          Capacidad máxima:{' '}
          <span className="font-semibold">
            {capacity} {capacity === 1 ? 'persona' : 'personas'}
          </span>
        </p>
      </div>
    </button>
  )
}
