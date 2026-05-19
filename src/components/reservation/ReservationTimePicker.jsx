/**
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.value HH:MM
 * @param {string[]} props.options
 * @param {(value: string) => void} props.onChange
 * @param {boolean} [props.disabled]
 * @param {string} [props.emptyHint]
 */
export function ReservationTimePicker({
  label,
  value,
  options,
  onChange,
  disabled = false,
  emptyHint = 'No hay horarios disponibles.',
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-alverata text-sm font-semibold uppercase tracking-[0.1em] text-uach-purple-900">
        {label}
      </p>

      {options.length === 0 ? (
        <p className="font-praxis rounded-lg border border-dashed border-uach-purple-900/20 bg-uach-purple-50/50 px-4 py-6 text-center text-sm text-uach-purple-900/60">
          {emptyHint}
        </p>
      ) : (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {options.map((slot) => {
            const isSelected = value === slot

            return (
              <li key={slot}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(slot)}
                  aria-pressed={isSelected}
                  className={`w-full rounded-lg border-2 px-2 py-2.5 text-center transition ${
                    isSelected
                      ? 'border-uach-gold-500 bg-uach-gold-400/20 font-semibold text-uach-purple-900 shadow-sm'
                      : 'border-uach-purple-900/12 bg-white text-uach-purple-900/85 hover:border-uach-purple-700/30 hover:bg-uach-purple-50'
                  } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <span className="font-alverata text-sm">{slot}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
