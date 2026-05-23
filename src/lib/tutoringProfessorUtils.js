export function getProfessorInitials(fullName) {
  const withoutTitle = fullName.replace(/^(Dr\.|Dra\.|Ing\.|Mtro\.|Mtra\.)\s+/i, '').trim()
  const parts = withoutTitle.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function formatTutoringDateLabel(isoDate) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function addDaysToIso(isoDate, days) {
  const date = new Date(`${isoDate}T12:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

export function getDateRangeIso(minDate, maxDate) {
  const dates = []
  let current = minDate
  while (current <= maxDate) {
    dates.push(current)
    current = addDaysToIso(current, 1)
  }
  return dates
}
