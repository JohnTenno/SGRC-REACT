import { useEffect, useState } from 'react'
import { getTutoringProfessorByEmployeeNumber } from '@/app/components/tutoring/tutoringProfessors'
import { formatTimeForDisplay } from '@/app/utilities/timeline'
import { formatTutoringDateLabel } from '@/app/components/tutoring/tutoringProfessorUtils'
import {
  getTutoringRequestBadgeClass,
  getTutoringRequestNotificationClass,
  getTutoringRequestNotificationMessage,
  getTutoringRequestStatusLabel,
  hasProfessorResponse,
  TUTORING_REQUEST_STATUS,
} from '@/app/components/tutoring/tutoringRequestTimeline'

export function MyTutoringRequestCard({ request, showNotification = true }) {
  const [professor, setProfessor] = useState(null)

  useEffect(() => {
    const employeeNumber = request.professorEmployeeNumber ?? request.professorId
    if (!employeeNumber) return
    getTutoringProfessorByEmployeeNumber(employeeNumber)
      .then(setProfessor)
      .catch(() => setProfessor(null))
  }, [request.professorEmployeeNumber, request.professorId])

  const professorName = professor?.fullName ?? 'Docente'
  const location = professor?.tutoringLocation
  const notificationMessage = getTutoringRequestNotificationMessage(request)
  const showStatusBanner = showNotification && notificationMessage

  return (
    <article className="overflow-hidden rounded-xl border border-uach-purple-900/12 bg-white shadow-sm">
      {showStatusBanner ? (
        <div
          className={`border-b px-4 py-3 font-praxis text-sm leading-relaxed ${getTutoringRequestNotificationClass(request.status)}`}
          role="status"
        >
          {hasProfessorResponse(request.status) ? (
            <p className="font-semibold">
              {request.status === TUTORING_REQUEST_STATUS.ACCEPTED
                ? 'Solicitud aceptada'
                : 'Solicitud no aceptada'}
            </p>
          ) : (
            <p className="font-semibold">En espera de respuesta</p>
          )}
          <p className="mt-1">{notificationMessage}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-alverata text-lg font-semibold text-uach-purple-900">
              {request.subject}
            </h3>
            <p className="font-praxis mt-1 text-sm text-uach-purple-900/70">
              {professorName}
            </p>
          </div>
          <span
            className={`font-praxis shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getTutoringRequestBadgeClass(request.status)}`}
          >
            {getTutoringRequestStatusLabel(request.status)}
          </span>
        </div>

        <dl className="font-praxis grid gap-2 text-sm text-uach-purple-900/80 sm:grid-cols-2">
          <div>
            <dt className="text-uach-purple-900/55">Fecha y horario</dt>
            <dd className="mt-0.5 font-medium text-uach-purple-900">
              {formatTutoringDateLabel(request.reservationDate)}
              <span className="text-uach-purple-900/70">
                {' '}
                · {formatTimeForDisplay(request.startTime)} –{' '}
                {formatTimeForDisplay(request.endTime)}
              </span>
            </dd>
          </div>
          {location && request.status === TUTORING_REQUEST_STATUS.ACCEPTED ? (
            <div>
              <dt className="text-uach-purple-900/55">Lugar</dt>
              <dd className="mt-0.5 font-medium text-uach-purple-900">{location}</dd>
            </div>
          ) : null}
        </dl>

        <div>
          <p className="font-praxis text-xs font-medium uppercase tracking-wide text-uach-purple-900/50">
            Motivo de la asesoría
          </p>
          <p className="font-praxis mt-1 text-sm leading-relaxed text-uach-purple-900/75">
            {request.topic}
          </p>
        </div>
      </div>
    </article>
  )
}
