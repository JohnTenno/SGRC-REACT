import {
  formatAvailableWeekdays,
  normalizeAvailableWeekdays,
  TUTORING_WEEKDAYS,
} from '@/app/components/tutoring/admin/tutoringWeekdaysUtils'

export function TutoringTutorWeekdaysField({
  selectedWeekdays,
  onToggle,
  disabled = false,
}) {
  const normalized = normalizeAvailableWeekdays(selectedWeekdays)

  return (
    <div className="min-w-0">
      <span className="font-alverata text-sm font-semibold text-uach-purple-900">
        Días de tutorías
      </span>
      <p className="font-praxis mt-1 text-xs text-uach-purple-900/55">
        Selecciona los días de la semana (lunes a domingo) en los que ofreces asesorías.
      </p>

      <div
        className="mt-3 grid grid-cols-7 gap-1.5 sm:gap-2"
        role="group"
        aria-label="Días de la semana"
      >
        {TUTORING_WEEKDAYS.map((day) => {
          const isSelected = normalized.includes(day.value)
          return (
            <button
              key={day.value}
              type="button"
              disabled={disabled}
              aria-pressed={isSelected}
              onClick={() => onToggle(day.value)}
              className={`font-praxis flex min-h-[4.5rem] flex-col items-center justify-center rounded-lg border px-1 py-2 text-center transition sm:min-h-[5rem] ${
                isSelected
                  ? 'border-uach-gold-400/60 bg-uach-gold-400/15 text-uach-purple-900 shadow-sm ring-2 ring-uach-gold-400/25'
                  : 'border-uach-purple-900/15 bg-white text-uach-purple-900/70 hover:border-uach-purple-900/30 hover:bg-uach-purple-50'
              } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-uach-purple-900/50 sm:text-xs">
                {day.shortLabel}
              </span>
              <span className="mt-1 hidden text-xs font-semibold sm:block">{day.label}</span>
            </button>
          )
        })}
      </div>

      <p className="font-praxis mt-2 text-xs text-uach-purple-900/60">
        {normalized.length > 0
          ? `Seleccionados: ${formatAvailableWeekdays(normalized)}`
          : 'Ningún día seleccionado.'}
      </p>
    </div>
  )
}
