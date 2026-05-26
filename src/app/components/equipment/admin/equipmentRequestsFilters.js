export const EMPTY_DATE_TIME_FILTERS = {
  dateFrom: '',
  dateTo: '',
  timeFrom: '',
  timeTo: '',
}

export function hasActiveEquipmentRequestFilters({
  searchQuery = '',
  statusFilters,
  dateFrom,
  dateTo,
  timeFrom,
  timeTo,
}) {
  return (
    searchQuery.trim().length > 0 ||
    statusFilters.length > 0 ||
    Boolean(dateFrom || dateTo || timeFrom || timeTo)
  )
}

function parseDateInput(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function startOfDay(date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  return start
}

function endOfDay(date) {
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return end
}

function parseTimeInput(value) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function getRequestMinutes(date) {
  return date.getHours() * 60 + date.getMinutes()
}

function getDateRange(dateFrom, dateTo) {
  if (dateFrom && dateTo) {
    const start = startOfDay(parseDateInput(dateFrom))
    const end = endOfDay(parseDateInput(dateTo))
    if (start <= end) return { start, end }
    return { start: startOfDay(parseDateInput(dateTo)), end: endOfDay(parseDateInput(dateFrom)) }
  }
  const single = dateFrom || dateTo
  const day = parseDateInput(single)
  return { start: startOfDay(day), end: endOfDay(day) }
}

export function matchesEquipmentRequestFilters(
  request,
  { statusFilters, dateFrom, dateTo, timeFrom, timeTo },
) {
  if (statusFilters.length > 0 && !statusFilters.includes(request.status)) return false

  const hasDateFilter = Boolean(dateFrom || dateTo)
  const hasTimeFilter = Boolean(timeFrom || timeTo)
  if (!hasDateFilter && !hasTimeFilter) return true

  const created = request.createdAt ? new Date(request.createdAt) : null
  if (!created || Number.isNaN(created.getTime())) return false

  if (hasDateFilter) {
    const { start, end } = getDateRange(dateFrom, dateTo)
    if (created < start || created > end) return false
  }

  if (hasTimeFilter) {
    const minutes = getRequestMinutes(created)
    if (timeFrom && minutes < parseTimeInput(timeFrom)) return false
    if (timeTo && minutes > parseTimeInput(timeTo)) return false
  }

  return true
}

export function filterEquipmentRequests(requests, filters) {
  const query = filters.searchQuery?.trim().toLowerCase() ?? ''
  return requests.filter((request) => {
    if (!matchesEquipmentRequestFilters(request, filters)) return false
    if (!query) return true
    return (
      String(request.id).includes(query) ||
      request.studentName.toLowerCase().includes(query) ||
      request.statusLabel.toLowerCase().includes(query) ||
      request.status.toLowerCase().includes(query) ||
      request.itemsSummary.toLowerCase().includes(query) ||
      String(request.totalUnits).includes(query)
    )
  })
}
