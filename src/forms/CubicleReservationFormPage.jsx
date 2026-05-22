import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { HeroHeader } from '@/components/layout/HeroHeader'
import { Navbar } from '@/components/layout/Navbar'
import { ReservationCalendar } from '@/components/reservation/ReservationCalendar'
import { ReservationTimePicker } from '@/components/reservation/ReservationTimePicker'
import {
  MAX_CUBICLE_RESERVATION_HOURS,
  RESERVATION_TIME_OPTIONS,
  buildCubicleReservationBody,
  createCubicleReservation,
  fetchCubicleOccupiedSlots,
  isWithinMaxReservationDuration,
} from '@/lib/cubicleReservationApi'

const labelClass =
  'font-alverata text-sm font-semibold uppercase tracking-[0.1em] text-uach-purple-900'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function addDays(isoDate, days) {
  const date = new Date(`${isoDate}T12:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function formatDateLabel(isoDate) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function isRangeAvailable(occupiedSlots, startTime, endTime) {
  const startIdx = RESERVATION_TIME_OPTIONS.indexOf(startTime)
  const endIdx = RESERVATION_TIME_OPTIONS.indexOf(endTime)
  if (startIdx === -1 || endIdx === -1) return false
  const range = RESERVATION_TIME_OPTIONS.slice(startIdx, endIdx)
  return range.every((hour) => !occupiedSlots.has(hour))
}

function validateForm({ cubicleId, reservationDate, startTime, endTime, minDate, maxDate, occupiedSlots }) {
  const errors = {}

  if (!reservationDate) {
    errors.reservationDate = 'Selecciona la fecha de la reserva.'
  } else if (reservationDate < minDate || reservationDate > maxDate) {
    errors.reservationDate = 'La fecha no está dentro del rango permitido.'
  }

  if (!startTime) errors.startTime = 'Selecciona la hora de inicio.'
  if (!endTime) errors.endTime = 'Selecciona la hora de fin.'

  if (startTime && endTime &&
    RESERVATION_TIME_OPTIONS.indexOf(endTime) <= RESERVATION_TIME_OPTIONS.indexOf(startTime)) {
    errors.endTime = 'La hora de fin debe ser posterior a la de inicio.'
  }

  if (startTime && endTime && !isWithinMaxReservationDuration(startTime, endTime)) {
    errors.endTime = `La reserva no puede exceder ${MAX_CUBICLE_RESERVATION_HOURS} horas.`
  }

  if (startTime && endTime && occupiedSlots && !isRangeAvailable(occupiedSlots, startTime, endTime)) {
    errors.endTime = 'Ese horario incluye bloques ocupados. Elige otro rango.'
  }

  return errors
}

function resolveInitialDate(stateDate, minDate, maxDate) {
  if (typeof stateDate === 'string' && stateDate >= minDate && stateDate <= maxDate) return stateDate
  return minDate
}

export function CubicleReservationFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const minDate = todayIso()
  const maxDate = addDays(minDate, 14)

  const [cubicle, setCubicle] = useState(null)
  const [cubicleLoading, setCubicleLoading] = useState(true)
  const [cubicleError, setCubicleError] = useState(null)

  const [reservationDate, setReservationDate] = useState(() =>
    resolveInitialDate(location.state?.reservationDate, minDate, maxDate),
  )
  const [occupiedSlots, setOccupiedSlots] = useState(new Set())
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    fetch(`/api/cubicles/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then(setCubicle)
      .catch(() => setCubicleError('Cubículo no encontrado.'))
      .finally(() => setCubicleLoading(false))
  }, [id])

  useEffect(() => {
    if (!cubicle) return
    fetchCubicleOccupiedSlots(cubicle.id, reservationDate).then((slots) => {
      const next = new Set(slots)
      setOccupiedSlots(next)
      setStartTime((prev) => {
        if (prev && next.has(prev)) {
          setEndTime('')
          return ''
        }
        return prev
      })
      setEndTime((prev) => (prev && next.has(prev) ? '' : prev))
    })
  }, [cubicle, reservationDate])

  const cubicleId = cubicle?.id ?? 0

  const availableStartOptions = useMemo(
    () => RESERVATION_TIME_OPTIONS.slice(0, -1).filter((slot) => !occupiedSlots.has(slot)),
    [occupiedSlots],
  )

  const availableEndOptions = useMemo(() => {
    if (!startTime) return []
    const startIdx = RESERVATION_TIME_OPTIONS.indexOf(startTime)
    return RESERVATION_TIME_OPTIONS.filter((slot, slotIdx) => {
      if (slotIdx <= startIdx) return false
      if (slotIdx - startIdx > MAX_CUBICLE_RESERVATION_HOURS) return false
      const range = RESERVATION_TIME_OPTIONS.slice(startIdx, slotIdx)
      return range.every((hour) => !occupiedSlots.has(hour))
    })
  }, [startTime, occupiedSlots])

  const formReady = useMemo(
    () =>
      Object.keys(
        validateForm({ cubicleId, reservationDate, startTime, endTime, minDate, maxDate, occupiedSlots }),
      ).length === 0,
    [cubicleId, reservationDate, startTime, endTime, minDate, maxDate, occupiedSlots],
  )

  if (cubicleLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="font-praxis text-uach-purple-900/60">Cargando…</p>
        </div>
      </div>
    )
  }

  if (cubicleError || !cubicle) {
    return <Navigate to="/cubicle-reservation" replace />
  }

  function handleDateChange(value) {
    setReservationDate(value)
    setFieldErrors((prev) => ({ ...prev, reservationDate: undefined }))
  }

  function handleStartTimeChange(value) {
    setStartTime(value)
    const startIdx = RESERVATION_TIME_OPTIONS.indexOf(value)
    const nextSlot = RESERVATION_TIME_OPTIONS[startIdx + 1]

    if (
      nextSlot &&
      !occupiedSlots.has(nextSlot) &&
      (!endTime || RESERVATION_TIME_OPTIONS.indexOf(endTime) <= startIdx)
    ) {
      setEndTime(nextSlot)
    } else if (endTime) {
      const endIdx = RESERVATION_TIME_OPTIONS.indexOf(endTime)
      const range = RESERVATION_TIME_OPTIONS.slice(startIdx, endIdx)
      const durationHours = endIdx - startIdx
      const endStillValid =
        endIdx > startIdx &&
        durationHours <= MAX_CUBICLE_RESERVATION_HOURS &&
        range.every((hour) => !occupiedSlots.has(hour))
      if (!endStillValid) setEndTime('')
    }

    setFieldErrors((prev) => ({ ...prev, startTime: undefined, endTime: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const errors = validateForm({ cubicleId, reservationDate, startTime, endTime, minDate, maxDate, occupiedSlots })
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setFormError(null)
    setIsSubmitting(true)

    try {
      const body = buildCubicleReservationBody({ cubicleId, date: reservationDate, startTime, endTime })
      await createCubicleReservation(body)
      navigate('/my-reservations', { replace: true })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : error?.message ?? 'No se pudo completar la reserva. Intenta de nuevo.'
      setFormError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex flex-1 flex-col gap-8 bg-white">
        <div className="cubicle-reservation-hero">
          <HeroHeader
            title={cubicle.identifier}
            capacity={cubicle.capacity}
          />
        </div>

        <div className={`page-shell flex flex-1 flex-col ${formReady ? 'pb-28' : 'pb-8'}`}>
          <nav className="font-praxis mb-6 text-sm text-uach-purple-900/60" aria-label="Ruta">
            <Link to="/home" className="transition hover:text-uach-purple-900">Inicio</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link to="/cubicle-reservation" className="transition hover:text-uach-purple-900">
              Reserva de cubículos
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-uach-purple-900">{cubicle.identifier}</span>
          </nav>

          <div className="mx-auto w-full max-w-6xl">
            <form
              id="cubicle-reservation-form"
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-6"
            >
              <input type="hidden" name="cubicleId" value={cubicleId} readOnly />

              <section className="rounded-xl border border-uach-purple-900/15 bg-uach-purple-50/30 p-6 shadow-sm sm:p-8">
                <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">
                  Datos de la reserva
                </h2>
                <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">
                  Elige fecha y horario (máximo {MAX_CUBICLE_RESERVATION_HOURS} horas por reserva).
                  Los bloques ocupados no se pueden seleccionar.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
                  <div className="flex flex-col gap-3">
                    <p className={labelClass}>Fecha de la reserva</p>
                    <ReservationCalendar
                      value={reservationDate}
                      minDate={minDate}
                      maxDate={maxDate}
                      onChange={handleDateChange}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.reservationDate ? (
                      <p className="font-praxis text-sm text-red-600">{fieldErrors.reservationDate}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-8">
                    <ReservationTimePicker
                      label="Hora de inicio"
                      value={startTime}
                      options={availableStartOptions}
                      onChange={handleStartTimeChange}
                      disabled={isSubmitting}
                      emptyHint="No hay horarios de inicio libres este día."
                    />
                    {fieldErrors.startTime ? (
                      <p className="font-praxis -mt-6 text-sm text-red-600">{fieldErrors.startTime}</p>
                    ) : null}

                    <ReservationTimePicker
                      label="Hora de fin"
                      value={endTime}
                      options={availableEndOptions}
                      onChange={(value) => {
                        setEndTime(value)
                        setFieldErrors((prev) => ({ ...prev, endTime: undefined }))
                      }}
                      disabled={isSubmitting || !startTime}
                      emptyHint={
                        startTime
                          ? 'No hay horarios de fin disponibles para ese inicio.'
                          : 'Selecciona primero la hora de inicio.'
                      }
                    />
                    {fieldErrors.endTime ? (
                      <p className="font-praxis -mt-6 text-sm text-red-600">{fieldErrors.endTime}</p>
                    ) : null}
                  </div>
                </div>
              </section>

              {formError ? (
                <p className="font-praxis rounded-lg border border-red-400/40 bg-red-950/10 px-4 py-3 text-sm text-red-700">
                  {formError}
                </p>
              ) : null}

              <Link
                to="/cubicle-reservation"
                className="font-praxis inline-block text-sm text-uach-purple-900/70 transition hover:text-uach-purple-900"
              >
                Cambiar cubículo
              </Link>
            </form>
          </div>
        </div>
      </main>

      {formReady ? (
        <div
          className="fixed inset-x-0 bottom-0 z-40 animate-slide-up-action-bar border-t border-uach-purple-900/10 bg-white/95 shadow-[0_-12px_40px_rgba(30,15,58,0.12)] backdrop-blur-md"
          role="region"
          aria-label="Confirmar reserva"
        >
          <div className="page-shell flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="font-praxis text-sm text-uach-purple-900/80">
              <span className="font-alverata font-semibold text-uach-purple-900">
                {formatDateLabel(reservationDate)}
              </span>
              {' · '}
              {startTime} – {endTime}
            </p>
            <button
              type="submit"
              form="cubicle-reservation-form"
              disabled={isSubmitting}
              className="button-primary w-full shrink-0 sm:w-auto sm:min-w-[14rem]"
            >
              {isSubmitting ? (
                <>
                  <span
                    className="inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent"
                    aria-hidden="true"
                  />
                  Reservando...
                </>
              ) : (
                'Reservar'
              )}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
