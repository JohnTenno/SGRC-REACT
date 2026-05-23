import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { SuccessAnimation } from '@/components/animations/SuccessAnimation'
import { Navbar } from '@/components/layout/Navbar'
import { ReservationTimePicker } from '@/components/reservation/ReservationTimePicker'
import { TutoringDateCarousel } from '@/components/tutoring/TutoringDateCarousel'
import { TutoringProfessorHero } from '@/components/tutoring/TutoringProfessorHero'
import {
  getTutoringProfessorById,
  professorTeachesSubject,
} from '@/data/mockTutoringProfessors'
import { getTutoringSubjectById } from '@/data/mockTutoringSubjects'
import { getAvailableTutoringSlots } from '@/lib/tutoringAvailability'
import {
  getTutoringEndTimeOptions,
  submitTutoringRequest,
  validateTutoringRequest,
} from '@/lib/tutoringRequestApi'
import {
  addDaysToIso,
  formatTutoringDateLabel,
  todayIso,
} from '@/lib/tutoringProfessorUtils'

const labelClass =
  'font-alverata text-sm font-semibold uppercase tracking-[0.1em] text-uach-purple-900'

const inputClass =
  'font-praxis w-full rounded-lg border border-uach-purple-900/15 bg-white px-4 py-3 text-base text-uach-purple-900 shadow-sm placeholder:text-uach-purple-900/40 focus:border-uach-gold-500/60 focus:outline-none focus:ring-2 focus:ring-uach-gold-400/25'

export function ProfessorTutoringProfilePage() {
  const navigate = useNavigate()
  const { subjectId: subjectIdParam, professorId: professorIdParam } = useParams()

  const subjectId = Number(subjectIdParam)
  const professorId = Number(professorIdParam)
  const subjectRecord = Number.isFinite(subjectId) ? getTutoringSubjectById(subjectId) : null
  const professor = Number.isFinite(professorId) ? getTutoringProfessorById(professorId) : null

  const subject = subjectRecord?.name ?? ''

  const minDate = todayIso()
  const maxDate = addDaysToIso(minDate, 21)

  const [reservationDate, setReservationDate] = useState(minDate)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [topic, setTopic] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [submittedRequest, setSubmittedRequest] = useState(null)
  //🤪🥸😳 asi como lo pidion tu senior estricto y mamon de jonh teno 🚀🚀🚀 (ntc jonh JAJAJAJA)

  const availableStartSlots = useMemo(() => {
    if (!professor) return []
    return getAvailableTutoringSlots(professor, reservationDate)
  }, [professor, reservationDate])

  const availableEndSlots = useMemo(
    () => getTutoringEndTimeOptions(startTime, availableStartSlots),
    [startTime, availableStartSlots],
  )

  const hasSlotsOnDate = useMemo(() => {
    if (!professor) return () => false
    return (isoDate) => getAvailableTutoringSlots(professor, isoDate).length > 0
  }, [professor])

  const formReady = Boolean(
    professorId &&
      subject &&
      reservationDate &&
      startTime &&
      endTime &&
      topic.trim(),
  )

  useEffect(() => {
    setStartTime((current) =>
      current && availableStartSlots.includes(current) ? current : '',
    )
    setEndTime('')
  }, [availableStartSlots])

  useEffect(() => {
    setEndTime((current) => (current && availableEndSlots.includes(current) ? current : ''))
  }, [availableEndSlots])

  if (!subjectRecord || !professor || !professorTeachesSubject(professor.id, subjectRecord.id)) {
    return <Navigate to="/professor-tutoring" replace />
  }

  const catalogPath = `/professor-tutoring/${subjectRecord.id}`

  function handleDateChange(value) {
    setReservationDate(value)
    setStartTime('')
    setEndTime('')
    setFieldErrors((prev) => ({
      ...prev,
      reservationDate: undefined,
      startTime: undefined,
      endTime: undefined,
    }))
  }

  function handleStartTimeChange(value) {
    setStartTime(value)
    const nextEndOptions = getTutoringEndTimeOptions(value, availableStartSlots)
    setEndTime(nextEndOptions[0] ?? '')
    setFieldErrors((prev) => ({
      ...prev,
      startTime: undefined,
      endTime: undefined,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const errors = validateTutoringRequest({
      professorId,
      subject,
      reservationDate,
      startTime,
      endTime,
      topic,
    })

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const saved = await submitTutoringRequest({
        professorId,
        subject,
        reservationDate,
        startTime,
        endTime,
        topic,
      })
      setSubmittedRequest(saved)
      setShowSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleGoToMyTutorings() {
    setShowSuccess(false)
    setSubmittedRequest(null)
    navigate('/my-tutorings', { replace: true })
  }

  const displayStart = submittedRequest?.startTime?.slice(0, 5) ?? startTime
  const displayEnd = submittedRequest?.endTime?.slice(0, 5) ?? endTime

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {showSuccess ? (
        <SuccessAnimation
          title="¡Solicitud enviada!"
          message={
            <>
              <span className="block">
                Tu solicitud de asesoría con {professor.fullName} quedó registrada para el{' '}
                {formatTutoringDateLabel(reservationDate)} de {displayStart} a {displayEnd}.
              </span>
              <span className="mt-3 block">
                Solo falta que el docente acepte tu solicitud. Revisa Mis tutorías para ver el
                estado y las notificaciones.
              </span>
            </>
          }
          actionLabel="Ver mis tutorías"
          onAction={handleGoToMyTutorings}
        />
      ) : null}

      <main className="flex flex-1 flex-col bg-white">
        <div className="professor-tutoring-hero professor-tutoring-profile-hero">
          <TutoringProfessorHero
            fullName={professor.fullName}
            subjectName={subject}
            bio={professor.bio}
            tutoringLocation={professor.tutoringLocation}
          />
        </div>

        <div className={`page-shell flex flex-1 flex-col pt-6 ${formReady ? 'pb-28' : 'pb-8'}`}>
          <nav className="font-praxis mb-6 text-sm text-uach-purple-900/60" aria-label="Ruta">
            <Link to="/home" className="transition hover:text-uach-purple-900">
              Inicio
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <Link to="/professor-tutoring" className="transition hover:text-uach-purple-900">
              Tutorías con profesores
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <Link to={catalogPath} className="transition hover:text-uach-purple-900">
              {subject}
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-uach-purple-900">{professor.fullName}</span>
          </nav>

          <form
            id="tutoring-request-form"
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto flex w-full max-w-6xl flex-col gap-6"
          >
            <input type="hidden" name="professorId" value={professorId} readOnly />
            <input type="hidden" name="subject" value={subject} readOnly />

            <section className="rounded-xl border border-uach-purple-900/15 bg-uach-purple-50/30 p-3 shadow-sm sm:p-4">
              <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">
                Fecha y horario
              </h2>
              <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">
                Elige día, hora de inicio y fin, y describe qué necesitas repasar.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
                <div className="flex flex-col gap-3">
                  <p className={labelClass}>Fecha de la asesoría</p>
                  <TutoringDateCarousel
                    value={reservationDate}
                    minDate={minDate}
                    maxDate={maxDate}
                    onChange={handleDateChange}
                    disabled={isSubmitting}
                    hasSlotsOnDate={hasSlotsOnDate}
                  />
                  {fieldErrors.reservationDate ? (
                    <p className="font-praxis text-sm text-red-600">{fieldErrors.reservationDate}</p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <ReservationTimePicker
                      label={
                        reservationDate
                          ? `Hora de inicio · ${formatTutoringDateLabel(reservationDate)}`
                          : 'Hora de inicio'
                      }
                      value={startTime}
                      options={availableStartSlots}
                      onChange={handleStartTimeChange}
                      disabled={isSubmitting}
                      emptyHint={
                        availableStartSlots.length === 0
                          ? 'Este docente no tiene horarios libres en la fecha seleccionada. Prueba otro día en el carrusel.'
                          : 'No hay horarios de inicio disponibles.'
                      }
                    />
                    {fieldErrors.startTime ? (
                      <p className="font-praxis -mt-3 text-sm text-red-600">
                        {fieldErrors.startTime}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-3">
                    <ReservationTimePicker
                      label="Hora de fin"
                      value={endTime}
                      options={availableEndSlots}
                      onChange={(value) => {
                        setEndTime(value)
                        setFieldErrors((prev) => ({ ...prev, endTime: undefined }))
                      }}
                      disabled={isSubmitting || !startTime}
                      emptyHint={
                        startTime
                          ? 'No hay más horas en el calendario para extender la sesión hasta 6 horas.'
                          : 'Selecciona primero la hora de inicio.'
                      }
                    />
                    {startTime && availableEndSlots.length > 0 ? (
                      <p className="font-praxis text-xs text-uach-purple-900/60">
                        Elige si la asesoría termina 1, 2 o 3 horas después de las {startTime}.
                      </p>
                    ) : null}
                    {fieldErrors.endTime ? (
                      <p className="font-praxis -mt-3 text-sm text-red-600">{fieldErrors.endTime}</p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <label htmlFor="tutoring-topic" className={labelClass}>
                  Motivo o dudas de la asesoría
                </label>
                <textarea
                  id="tutoring-topic"
                  name="topic"
                  value={topic}
                  onChange={(event) => {
                    setTopic(event.target.value)
                    setFieldErrors((prev) => ({ ...prev, topic: undefined }))
                  }}
                  disabled={isSubmitting}
                  rows={4}
                  placeholder="Ej. Tengo dudas sobre consultas SQL y normalización de tablas…"
                  className={inputClass}
                />
                {fieldErrors.topic ? (
                  <p className="font-praxis text-sm text-red-600">{fieldErrors.topic}</p>
                ) : null}
              </div>
            </section>

            <Link
              to={catalogPath}
              className="font-praxis inline-block text-sm text-uach-purple-900/70 transition hover:text-uach-purple-900"
            >
              Volver al catálogo de docentes
            </Link>
          </form>
        </div>
      </main>

      {formReady ? (
        <div
          className="fixed inset-x-0 bottom-0 z-40 animate-slide-up-action-bar border-t border-uach-purple-900/10 bg-white/95 shadow-[0_-12px_40px_rgba(30,15,58,0.12)] backdrop-blur-md"
          role="region"
          aria-label="Confirmar solicitud de asesoría"
        >
          <div className="page-shell flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="font-praxis text-sm text-uach-purple-900/80">
              <span className="font-alverata font-semibold capitalize text-uach-purple-900">
                {formatTutoringDateLabel(reservationDate)}
              </span>
              {' · '}
              {startTime} – {endTime}
            </p>
            <button
              type="submit"
              form="tutoring-request-form"
              disabled={isSubmitting}
              className="button-primary w-full shrink-0 sm:w-auto sm:min-w-[14rem]"
            >
              {isSubmitting ? (
                <>
                  <span
                    className="inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent"
                    aria-hidden="true"
                  />
                  Enviando solicitud…
                </>
              ) : (
                'Solicitar asesoría'
              )}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
