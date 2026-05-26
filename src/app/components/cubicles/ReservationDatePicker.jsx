import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IconChevronLeft, IconChevronRight } from '@/app/components/common/icons'

export function ReservationDatePicker({ value, minDate, maxDate, onChange, disabled = false }) {
  const scrollRef = useRef(null)
  const dates = useMemo(() => buildDateRange(minDate, maxDate), [minDate, maxDate])
  const [canGoPrev, setCanGoPrev] = useState(false)
  const [canGoNext, setCanGoNext] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const maxScroll = el.scrollWidth - el.clientWidth
    setCanGoPrev(el.scrollLeft > 2)
    setCanGoNext(el.scrollLeft < maxScroll - 2)
  }, [])

  useEffect(() => {
    updateScrollState()
    const el = scrollRef.current
    if (!el) return undefined

    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [dates, updateScrollState])

  useEffect(() => {
    const el = scrollRef.current
    const selected = el?.querySelector(`[data-date="${value}"]`)
    selected?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
  }, [value])

  function scrollDates(direction) {
    const el = scrollRef.current
    if (!el) return

    const firstChip = el.querySelector('[data-date]')
    const step = (firstChip?.getBoundingClientRect().width ?? 72) + 8

    el.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Fecha de la reserva"
      >
        {dates.map((date) => {
          const isSelected = value === date.iso
          const { weekday, day, month } = formatDateParts(date.iso)

          return (
            <button
              key={date.iso}
              type="button"
              data-date={date.iso}
              disabled={disabled}
              onClick={() => onChange(date.iso)}
              aria-pressed={isSelected}
              className={`flex min-w-[4.5rem] shrink-0 flex-col items-center rounded-xl border-2 px-3 py-3 transition ${
                isSelected
                  ? 'border-uach-gold-500 bg-uach-gold-400/15 text-uach-purple-900 shadow-sm'
                  : 'border-uach-purple-900/15 bg-white text-uach-purple-900/80 hover:border-uach-purple-700/35 hover:bg-uach-purple-50'
              } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <span className="font-praxis text-[0.65rem] font-semibold uppercase tracking-wide text-uach-purple-900/60">
                {weekday}
              </span>
              <span className="font-alverata text-2xl font-semibold leading-none">{day}</span>
              <span className="font-praxis mt-1 text-xs capitalize text-uach-purple-900/65">
                {month}
              </span>
            </button>
          )
        })}
      </div>

      {dates.length > 1 ? (
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            disabled={disabled || !canGoPrev}
            onClick={() => scrollDates(-1)}
            aria-label="Ver fechas anteriores"
            className="text-uach-purple-900 transition hover:text-uach-purple-700 disabled:pointer-events-none disabled:text-uach-purple-900/25"
          >
            <IconChevronLeft className="size-6" aria-hidden />
          </button>
          <button
            type="button"
            disabled={disabled || !canGoNext}
            onClick={() => scrollDates(1)}
            aria-label="Ver fechas siguientes"
            className="text-uach-purple-900 transition hover:text-uach-purple-700 disabled:pointer-events-none disabled:text-uach-purple-900/25"
          >
            <IconChevronRight className="size-6" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  )
}

function buildDateRange(minDate, maxDate) {
  const dates = []
  const cursor = new Date(`${minDate}T12:00:00`)
  const end = new Date(`${maxDate}T12:00:00`)

  while (cursor <= end) {
    dates.push({ iso: cursor.toISOString().slice(0, 10) })
    cursor.setDate(cursor.getDate() + 1)
  }

  return dates
}

function formatDateParts(isoDate) {
  const date = new Date(`${isoDate}T12:00:00`)
  return {
    weekday: date.toLocaleDateString('es-MX', { weekday: 'short' }).replace('.', ''),
    day: date.getDate(),
    month: date.toLocaleDateString('es-MX', { month: 'short' }).replace('.', ''),
  }
}
