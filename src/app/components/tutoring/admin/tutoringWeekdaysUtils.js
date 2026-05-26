export const TUTORING_WEEKDAYS = [
  { value: 1, shortLabel: 'Lun', label: 'Lunes' },
  { value: 2, shortLabel: 'Mar', label: 'Martes' },
  { value: 3, shortLabel: 'Mié', label: 'Miércoles' },
  { value: 4, shortLabel: 'Jue', label: 'Jueves' },
  { value: 5, shortLabel: 'Vie', label: 'Viernes' },
  { value: 6, shortLabel: 'Sáb', label: 'Sábado' },
  { value: 0, shortLabel: 'Dom', label: 'Domingo' },
]

const LABEL_BY_VALUE = new Map(TUTORING_WEEKDAYS.map((day) => [day.value, day.label]))

export function normalizeAvailableWeekdays(value) {
  if (!Array.isArray(value)) return []
  const allowed = new Set(TUTORING_WEEKDAYS.map((day) => day.value))
  const unique = [...new Set(value.map((day) => Number(day)).filter((day) => allowed.has(day)))]
  const order = TUTORING_WEEKDAYS.map((day) => day.value)
  return unique.sort((a, b) => order.indexOf(a) - order.indexOf(b))
}

export function formatAvailableWeekdays(weekdays) {
  const normalized = normalizeAvailableWeekdays(weekdays)
  if (normalized.length === 0) return 'Sin días seleccionados'
  return normalized.map((day) => LABEL_BY_VALUE.get(day)).join(', ')
}
