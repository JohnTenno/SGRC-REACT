import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { MyTutoringRequestCard } from '@/tutoring/home/components/MyTutoringRequestCard'
import { fetchMyTutoringRequests } from '@/tutoring/home/tutoringRequestApi'
import {
  splitTutoringRequests,
  TUTORING_REQUEST_STATUS,
} from '@/tutoring/home/tutoringRequestTimeline'

function TutoringSection({ title, description, requests, emptyMessage, showNotification }) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-alverata text-xl font-semibold text-uach-purple-900">{title}</h2>
        <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">{description}</p>
      </div>

      {requests.length === 0 ? (
        <p className="font-praxis rounded-xl border border-dashed border-uach-purple-900/20 bg-uach-purple-50/40 px-5 py-8 text-center text-sm text-uach-purple-900/60">
          {emptyMessage}
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {requests.map((request) => (
            <li key={request.id}>
              <MyTutoringRequestCard
                request={request}
                showNotification={showNotification}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function MyTutoringsPage() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const loadRequests = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const data = await fetchMyTutoringRequests()
      setRequests(data)
    } catch (error) {
      setErrorMessage(
        error?.message ?? 'No se pudieron cargar tus tutorías. Intenta de nuevo.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  const { notifications, upcoming, pending, past } = useMemo(
    () => splitTutoringRequests(requests),
    [requests],
  )

  const professorResponses = useMemo(
    () =>
      notifications.filter(
        (request) =>
          request.status === TUTORING_REQUEST_STATUS.ACCEPTED ||
          request.status === TUTORING_REQUEST_STATUS.REJECTED,
      ),
    [notifications],
  )

  const hasNoRequests =
    !isLoading &&
    !errorMessage &&
    professorResponses.length === 0 &&
    upcoming.length === 0 &&
    pending.length === 0 &&
    past.length === 0

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="page-shell flex flex-1 flex-col gap-10 py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-alverata text-2xl font-semibold text-uach-purple-900 sm:text-3xl">
              Mis tutorías
            </h1>
            <p className="font-praxis mt-2 max-w-2xl text-uach-purple-900/70">
              Consulta tus asesorías confirmadas, las solicitudes en espera y las
              notificaciones cuando un docente acepte o decline tu petición.
            </p>
          </div>
          <Link
            to="/professor-tutoring"
            className="button-primary w-full shrink-0 sm:w-auto sm:min-w-[12rem]"
          >
            Nueva solicitud
          </Link>
        </header>

        {isLoading ? (
          <div className="flex flex-col gap-4" aria-busy="true" aria-label="Cargando tutorías">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-xl bg-uach-purple-900/8"
              />
            ))}
          </div>
        ) : null}

        {errorMessage ? (
          <p className="font-praxis rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {hasNoRequests ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-uach-purple-900/20 bg-uach-purple-50/30 px-6 py-16 text-center">
            <p className="font-alverata text-lg font-semibold text-uach-purple-900">
              Aún no tienes solicitudes de tutoría
            </p>
            <p className="font-praxis max-w-md text-sm text-uach-purple-900/65">
              Cuando envíes una solicitud a un docente, aparecerá aquí con su estado y
              las notificaciones de respuesta.
            </p>
            <Link to="/professor-tutoring" className="button-primary mt-2">
              Buscar tutoría
            </Link>
          </div>
        ) : null}

        {!isLoading && !errorMessage && !hasNoRequests ? (
          <div className="flex flex-col gap-10">
            {professorResponses.length > 0 ? (
              <TutoringSection
                title="Notificaciones"
                description="Respuestas recientes del docente a tus solicitudes."
                requests={professorResponses}
                emptyMessage=""
                showNotification
              />
            ) : null}

            <TutoringSection
              title="Próximas tutorías"
              description="Asesorías confirmadas por el docente."
              requests={upcoming}
              emptyMessage="No tienes tutorías confirmadas próximamente."
              showNotification={false}
            />

            <TutoringSection
              title="Pendientes de aprobación"
              description="El docente aún no ha respondido; te notificaremos aquí."
              requests={pending}
              emptyMessage="No tienes solicitudes en espera."
              showNotification
            />

            <TutoringSection
              title="Historial"
              description="Solicitudes pasadas, rechazadas o completadas."
              requests={past}
              emptyMessage="Tu historial aparecerá aquí."
              showNotification
            />
          </div>
        ) : null}
      </main>
    </div>
  )
}
