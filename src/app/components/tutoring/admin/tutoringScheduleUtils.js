export function parseScheduleSummary(scheduleSummary) {
  const text = String(scheduleSummary ?? '').trim()
  if (!text || text === 'Por definir') {
    return { start: '', end: '' }
  }

  const match = text.match(/(\d{1,2}:\d{2})\s*(?:–|-|—|a)\s*(\d{1,2}:\d{2})/i)
  if (!match) {
    return { start: '', end: '' }
  }

  return {
    start: normalizeTimeValue(match[1]),
    end: normalizeTimeValue(match[2]),
  }
}

function normalizeTimeValue(value) {
  const [hoursRaw, minutesRaw] = String(value).split(':')
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return ''
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function timeToMinutes(value) {
  const normalized = normalizeTimeValue(value)
  if (!normalized) return null
  const [hours, minutes] = normalized.split(':').map(Number)
  return hours * 60 + minutes
}

export function formatScheduleSummary(startTime, endTime) {
  const start = normalizeTimeValue(startTime)
  const end = normalizeTimeValue(endTime)
  if (!start || !end) return ''
  return `${start} a ${end}`
}

export function validateScheduleRange(startTime, endTime) {
  const start = normalizeTimeValue(startTime)
  const end = normalizeTimeValue(endTime)
  if (!start || !end) {
    return 'Indica la hora de inicio y la hora de fin.'
  }
  const startMinutes = timeToMinutes(start)
  const endMinutes = timeToMinutes(end)
  if (startMinutes === null || endMinutes === null) {
    return 'Las horas no son válidas.'
  }
  if (startMinutes >= endMinutes) {
    return 'La hora de fin debe ser posterior a la hora de inicio.'
  }
  return null
}
