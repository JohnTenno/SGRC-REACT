import { useEffect, useMemo, useRef } from 'react'
import { IconChevron } from '@/components/icons'
import { getDateRangeIso, todayIso } from '@/tutoring/home/tutoringProfessorUtils'

const WEEKDAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function formatCarouselDateParts(isoDate) {
  const date = new Date(`${isoDate}T12:00:00`)
  return {
    weekday: WEEKDAY_SHORT[date.getDay()],
    day: date.getDate(),
    month: date.toLocaleDateString('es-MX', { month: 'short' }).replace('.', ''),
  }
}

export function TutoringDateCarousel({
  value,
  minDate,
  maxDate,
  onChange,
  disabled = false,
  hasSlotsOnDate,
}) {
  const scrollRef = useRef(null)
  const today = useMemo(() => todayIso(), [])

  const dates = useMemo(() => getDateRangeIso(minDate, maxDate), [minDate, maxDate])

  useEffect(() => {
    const container = scrollRef.current
    if (!container || !value) return

    const selected = container.querySelector(`[data-date="${value}"]`)
    selected?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [value])

  function scrollCarousel(direction) {
    scrollRef.current?.scrollBy({
      left: direction * 220,
      behavior: 'smooth',
    })
  }

  return (
    <div
      className="rounded-xl border border-uach-purple-900/15 bg-white p-2 shadow-sm sm:p-2.5"
      role="group"
      aria-label="Seleccionar fecha en carrusel"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-praxis text-xs text-uach-purple-900/60">
          Desliza o usa las flechas para ver más días
        </p>
        <div className="flex shrink-0 gap-1">
          <CarouselNavButton
            direction="prev"
            disabled={disabled}
            onClick={() => scrollCarousel(-1)}
          />
          <CarouselNavButton
            direction="next"
            disabled={disabled}
            onClick={() => scrollCarousel(1)}
          />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
      >
        {dates.map((iso) => {
          const { weekday, day, month } = formatCarouselDateParts(iso)
          const isSelected = iso === value
          const isToday = iso === today
          const hasSlots = hasSlotsOnDate?.(iso) ?? true

          return (
            <button
              key={iso}
              type="button"
              data-date={iso}
              disabled={disabled}
              onClick={() => onChange(iso)}
              aria-pressed={isSelected}
              aria-label={new Date(`${iso}T12:00:00`).toLocaleDateString('es-MX', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
              className={`font-praxis flex w-[4.5rem] shrink-0 snap-center flex-col items-center rounded-xl border-2 px-2 py-3 transition sm:w-[5rem] ${
                isSelected
                  ? 'border-uach-gold-500 bg-uach-gold-400/20 shadow-sm'
                  : isToday
                    ? 'border-uach-gold-400/60 bg-uach-purple-50/80 hover:border-uach-purple-700/35'
                    : 'border-uach-purple-900/12 bg-white hover:border-uach-purple-700/30 hover:bg-uach-purple-50/60'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${!hasSlots && !isSelected ? 'opacity-55' : ''}`}
            >
              <span
                className={`text-[0.65rem] font-semibold uppercase tracking-wide ${
                  isSelected ? 'text-uach-purple-900' : 'text-uach-purple-900/55'
                }`}
              >
                {weekday}
              </span>
              <span
                className={`font-alverata mt-1 text-2xl font-semibold leading-none ${
                  isSelected ? 'text-uach-purple-900' : 'text-uach-purple-900/90'
                }`}
              >
                {day}
              </span>
              <span
                className={`mt-1 text-xs capitalize ${
                  isSelected ? 'text-uach-purple-900/80' : 'text-uach-purple-900/55'
                }`}
              >
                {month}
              </span>
              <span
                className={`mt-2 size-1.5 rounded-full ${
                  hasSlots ? 'bg-emerald-500' : 'bg-uach-purple-900/20'
                }`}
                aria-hidden="true"
                title={hasSlots ? 'Con horarios' : 'Sin horarios'}
              />
            </button>
          )
        })}
      </div>

      <p className="font-praxis mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.7rem] text-uach-purple-900/55">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          Con horarios
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-uach-purple-900/20" aria-hidden="true" />
          Sin horarios ese día
        </span>
      </p>
    </div>
  )
}

function CarouselNavButton({ direction, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Ver días anteriores' : 'Ver días siguientes'}
      className="flex size-9 items-center justify-center rounded-lg border border-uach-purple-900/15 text-uach-purple-900 transition hover:bg-uach-purple-50 disabled:pointer-events-none disabled:opacity-40"
    >
      <IconChevron
        direction={direction === 'prev' ? 'left' : 'right'}
        className="size-5"
      />
    </button>
  )
}
