import { useMemo, useState } from 'react'

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

/**
 * @param {object} props
 * @param {string} props.value YYYY-MM-DD
 * @param {string} props.minDate
 * @param {string} props.maxDate
 * @param {(value: string) => void} props.onChange
 * @param {boolean} [props.disabled]
 */
export function ReservationCalendar({
  value,
  minDate,
  maxDate,
  onChange,
  disabled = false,
}) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [viewMonth, setViewMonth] = useState(() => monthFromIso(value || minDate))

  const monthLabel = useMemo(() => {
    const date = new Date(viewMonth.year, viewMonth.month, 1)
    return date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
  }, [viewMonth])

  const cells = useMemo(
    () => buildMonthCells(viewMonth.year, viewMonth.month, minDate, maxDate, value, today),
    [viewMonth, minDate, maxDate, value, today],
  )

  const canGoPrev = monthKey(viewMonth) > monthKey(monthFromIso(minDate))
  const canGoNext = monthKey(viewMonth) < monthKey(monthFromIso(maxDate))

  function goMonth(delta) {
    setViewMonth((current) => {
      const date = new Date(current.year, current.month + delta, 1)
      return { year: date.getFullYear(), month: date.getMonth() }
    })
  }

  return (
    <div
      className="rounded-xl border border-uach-purple-900/15 bg-white p-4 shadow-sm sm:p-5"
      role="application"
      aria-label="Calendario de reserva"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={disabled || !canGoPrev}
          onClick={() => goMonth(-1)}
          aria-label="Mes anterior"
          className="rounded-md p-1.5 text-uach-purple-900 transition hover:bg-uach-purple-50 disabled:pointer-events-none disabled:text-uach-purple-900/25"
        >
          <ChevronIcon direction="left" />
        </button>
        <p className="font-alverata text-center text-base font-semibold capitalize text-uach-purple-900">
          {monthLabel}
        </p>
        <button
          type="button"
          disabled={disabled || !canGoNext}
          onClick={() => goMonth(1)}
          aria-label="Mes siguiente"
          className="rounded-md p-1.5 text-uach-purple-900 transition hover:bg-uach-purple-50 disabled:pointer-events-none disabled:text-uach-purple-900/25"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <span
            key={label}
            className="font-praxis py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-uach-purple-900/55"
          >
            {label}
          </span>
        ))}

        {cells.map((cell, index) =>
          cell === null ? (
            <span key={`empty-${index}`} aria-hidden="true" />
          ) : (
            <button
              key={cell.iso}
              type="button"
              disabled={disabled || cell.disabled}
              onClick={() => onChange(cell.iso)}
              aria-pressed={cell.selected}
              aria-label={cell.ariaLabel}
              className={`font-alverata aspect-square w-full rounded-lg text-sm font-medium transition ${
                cell.selected
                  ? 'bg-uach-gold-500 text-uach-purple-950 shadow-sm'
                  : cell.disabled
                    ? 'cursor-not-allowed text-uach-purple-900/25'
                    : cell.isToday
                      ? 'border-2 border-uach-gold-400/70 text-uach-purple-900 hover:bg-uach-purple-50'
                      : 'text-uach-purple-900 hover:bg-uach-purple-50'
              } ${disabled ? 'opacity-60' : ''}`}
            >
              {cell.day}
            </button>
          ),
        )}
      </div>
    </div>
  )
}

function ChevronIcon({ direction }) {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  )
}

/**
 * @param {number} year
 * @param {number} month 0-indexed
 * @param {string} minDate
 * @param {string} maxDate
 * @param {string} selected
 * @param {string} today
 */
function buildMonthCells(year, month, minDate, maxDate, selected, today) {
  const firstOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingEmpty = (firstOfMonth.getDay() + 6) % 7

  const cells = Array.from({ length: leadingEmpty }, () => null)

  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = toIso(year, month, day)
    const date = new Date(`${iso}T12:00:00`)
    const disabled = iso < minDate || iso > maxDate

    cells.push({
      iso,
      day,
      disabled,
      selected: iso === selected,
      isToday: iso === today,
      ariaLabel: date.toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    })
  }

  return cells
}

function monthFromIso(isoDate) {
  const date = new Date(`${isoDate}T12:00:00`)
  return { year: date.getFullYear(), month: date.getMonth() }
}

function monthKey({ year, month }) {
  return year * 12 + month
}

function toIso(year, month, day) {
  const date = new Date(year, month, day)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
