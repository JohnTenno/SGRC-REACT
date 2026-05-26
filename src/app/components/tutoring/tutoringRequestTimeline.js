import { TUTORING_REQUEST_STATUS } from '@/app/services/tutoring/requests.service'
import { formatTimeForDisplay } from '@/app/utilities/timeline'

export { TUTORING_REQUEST_STATUS }

export function getTutoringRequestStartDateTime(request) {
  const start = formatTimeForDisplay(request.startTime)
  return new Date(`${request.reservationDate}T${start}:00`)
}

export function getTutoringRequestEndDateTime(request) {
  const end = formatTimeForDisplay(request.endTime)
  return new Date(`${request.reservationDate}T${end}:00`)
}

export function isTutoringRequestUpcoming(request, now = Date.now()) {
  const end = getTutoringRequestEndDateTime(request)
  return end ? end.getTime() > now : true
}

const STATUS_LABELS = {
  [TUTORING_REQUEST_STATUS.PENDING_PROFESSOR]: 'Pendiente de aprobación',
  [TUTORING_REQUEST_STATUS.ACCEPTED]: 'Aceptada',
  [TUTORING_REQUEST_STATUS.REJECTED]: 'No aceptada',
  [TUTORING_REQUEST_STATUS.COMPLETED]: 'Completada',
}

const BADGE_STYLES = {
  [TUTORING_REQUEST_STATUS.PENDING_PROFESSOR]: 'bg-amber-50 text-amber-900',
  [TUTORING_REQUEST_STATUS.ACCEPTED]: 'bg-emerald-50 text-emerald-800',
  [TUTORING_REQUEST_STATUS.REJECTED]: 'bg-red-50 text-red-700',
  [TUTORING_REQUEST_STATUS.COMPLETED]: 'bg-uach-purple-50 text-uach-purple-900',
}

const NOTIFICATION_STYLES = {
  [TUTORING_REQUEST_STATUS.ACCEPTED]: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  [TUTORING_REQUEST_STATUS.REJECTED]: 'border-red-200 bg-red-50 text-red-800',
  [TUTORING_REQUEST_STATUS.PENDING_PROFESSOR]: 'border-amber-200 bg-amber-50 text-amber-900',
}

export function getTutoringRequestStatusLabel(status) {
  return STATUS_LABELS[status] ?? status
}

export function getTutoringRequestBadgeClass(status) {
  return BADGE_STYLES[status] ?? 'bg-uach-purple-50 text-uach-purple-900'
}

export function getTutoringRequestNotificationMessage(request) {
  switch (request.status) {
    case TUTORING_REQUEST_STATUS.ACCEPTED:
      return 'El docente aceptó tu solicitud. Tu asesoría quedó confirmada; asiste puntual al lugar indicado.'
    case TUTORING_REQUEST_STATUS.REJECTED:
      return request.rejectionReason
        ? `El docente no pudo aceptar tu solicitud: ${request.rejectionReason}`
        : 'El docente no pudo aceptar tu solicitud en ese horario. Puedes enviar una nueva solicitud con otra fecha.'
    case TUTORING_REQUEST_STATUS.PENDING_PROFESSOR:
      return 'Tu solicitud está en revisión. Te avisaremos aquí cuando el docente responda.'
    default:
      return null
  }
}

export function getTutoringRequestNotificationClass(status) {
  return NOTIFICATION_STYLES[status] ?? 'border-uach-purple-900/15 bg-uach-purple-50 text-uach-purple-900'
}

export function hasProfessorResponse(status) {
  return (
    status === TUTORING_REQUEST_STATUS.ACCEPTED ||
    status === TUTORING_REQUEST_STATUS.REJECTED
  )
}

export function splitTutoringRequests(requests, now = Date.now()) {
  const notifications = []
  const upcoming = []
  const pending = []
  const past = []

  for (const request of requests) {
    const upcomingSession = isTutoringRequestUpcoming(request, now)

    if (
      request.status === TUTORING_REQUEST_STATUS.ACCEPTED ||
      request.status === TUTORING_REQUEST_STATUS.REJECTED
    ) {
      notifications.push(request)
    }

    if (request.status === TUTORING_REQUEST_STATUS.ACCEPTED && upcomingSession) {
      upcoming.push(request)
      continue
    }

    if (request.status === TUTORING_REQUEST_STATUS.PENDING_PROFESSOR && upcomingSession) {
      pending.push(request)
      continue
    }

    if (request.status !== TUTORING_REQUEST_STATUS.REJECTED) {
      past.push(request)
    }
  }

  const byStartAsc = (a, b) =>
    getTutoringRequestStartDateTime(a) - getTutoringRequestStartDateTime(b)
  const byStartDesc = (a, b) =>
    getTutoringRequestStartDateTime(b) - getTutoringRequestStartDateTime(a)
  const byResponseDesc = (a, b) =>
    new Date(b.statusUpdatedAt ?? b.createdAt ?? 0) -
    new Date(a.statusUpdatedAt ?? a.createdAt ?? 0)

  notifications.sort(byResponseDesc)
  upcoming.sort(byStartAsc)
  pending.sort(byStartAsc)
  past.sort(byStartDesc)

  return { notifications, upcoming, pending, past }
}
