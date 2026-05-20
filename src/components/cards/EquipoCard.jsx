/**
 * @param {object} props
 * @param {string} props.type
 * @param {number} props.availableStock
 * @param {string} props.image
 * @param {string} props.imageAlt
 * @param {boolean} [props.selected]
 * @param {boolean} [props.disabled]
 * @param {() => void} props.onSelect
 */
export function EquipoCard({
  type,
  availableStock,
  image,
  imageAlt,
  selected = false,
  disabled = false,
  onSelect,
}) {
  const outOfStock = availableStock <= 0
  const isDisabled = disabled || outOfStock

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative flex h-[17.5rem] w-full flex-col overflow-hidden rounded-lg border-2 bg-white text-left shadow-md transition ${
        selected
          ? 'border-uach-gold-500 shadow-lg ring-4 ring-uach-gold-400/35'
          : 'border-uach-purple-900/15 hover:border-uach-purple-700/40 hover:shadow-lg'
      } ${isDisabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <div className="relative h-28 w-full shrink-0 overflow-hidden bg-uach-purple-950">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover object-center transition ${
            selected ? 'brightness-90' : ''
          } ${isDisabled ? 'grayscale-[35%]' : ''}`}
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
        {outOfStock ? (
          <span className="font-praxis absolute bottom-3 left-3 rounded-full bg-uach-purple-950/85 px-3 py-1 text-xs font-semibold text-white">
            Sin stock
          </span>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center p-4">
        <h3 className="font-alverata line-clamp-2 text-base font-semibold text-uach-purple-900">
          {type}
        </h3>
        <p className="font-praxis mt-2 shrink-0 text-sm font-medium text-uach-purple-900">
          Disponibles:{' '}
          <span
            className={`font-semibold ${
              outOfStock ? 'text-red-600' : 'text-uach-gold-600'
            }`}
          >
            {availableStock}
          </span>
        </p>
      </div>
    </button>
  )
}
