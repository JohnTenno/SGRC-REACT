import { useEffect, useState } from 'react'
import {
  formatScheduleSummary,
  parseScheduleSummary,
  validateScheduleRange,
} from '@/tutoring/admin/perfil-tutor/tutoringScheduleUtils'
import { TutoringTutorSubjectsField } from '@/tutoring/admin/perfil-tutor/TutoringTutorSubjectsField'
import { TutoringTutorWeekdaysField } from '@/tutoring/admin/perfil-tutor/TutoringTutorWeekdaysField'
import { normalizeAvailableWeekdays } from '@/tutoring/admin/perfil-tutor/tutoringWeekdaysUtils'

const inputClass =
  'font-praxis w-full rounded-lg border border-uach-purple-900/20 px-3 py-2.5 text-sm text-uach-purple-900 focus:border-uach-gold-400 focus:outline-none focus:ring-2 focus:ring-uach-gold-400/25'

const textareaClass = `${inputClass} min-h-[5rem] resize-y`

const readOnlyInputClass = `${inputClass} mt-1.5 cursor-default bg-uach-purple-50/80 text-uach-purple-900/80`

export function TutoringProfessorAdminForm({
  mode,
  variant = 'admin',
  initial,
  availableSubjects = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const isTutorProfile = variant === 'tutorProfile'
  const employeeNumberReadOnly = mode === 'edit' || isTutorProfile
  const fullNameReadOnly = isTutorProfile
  const [employeeNumber, setEmployeeNumber] = useState(initial?.employeeNumber ?? '')
  const [fullName, setFullName] = useState(initial?.fullName ?? '')
  const [bio, setBio] = useState(initial?.bio ?? '')
  const [scheduleStart, setScheduleStart] = useState(() =>
    parseScheduleSummary(initial?.scheduleSummary).start,
  )
  const [scheduleEnd, setScheduleEnd] = useState(() =>
    parseScheduleSummary(initial?.scheduleSummary).end,
  )
  const [tutoringLocation, setTutoringLocation] = useState(initial?.tutoringLocation ?? '')
  const [subjectIds, setSubjectIds] = useState(() =>
    Array.isArray(initial?.subjectIds) ? [...initial.subjectIds] : [],
  )
  const [availableWeekdays, setAvailableWeekdays] = useState(() =>
    normalizeAvailableWeekdays(initial?.availableWeekdays),
  )
  const [error, setError] = useState(null)

  useEffect(() => {
    setEmployeeNumber(initial?.employeeNumber ?? '')
    setFullName(initial?.fullName ?? '')
    setBio(initial?.bio ?? '')
    const parsedSchedule = parseScheduleSummary(initial?.scheduleSummary)
    setScheduleStart(parsedSchedule.start)
    setScheduleEnd(parsedSchedule.end)
    setTutoringLocation(initial?.tutoringLocation ?? '')
    setSubjectIds(Array.isArray(initial?.subjectIds) ? [...initial.subjectIds] : [])
    setAvailableWeekdays(normalizeAvailableWeekdays(initial?.availableWeekdays))
    setError(null)
  }, [initial, mode])

  function toggleWeekday(weekday) {
    setAvailableWeekdays((current) => {
      const normalized = normalizeAvailableWeekdays(current)
      if (normalized.includes(weekday)) {
        return normalized.filter((day) => day !== weekday)
      }
      return normalizeAvailableWeekdays([...normalized, weekday])
    })
  }

  function toggleSubjectId(subjectId) {
    setSubjectIds((current) => {
      if (current.includes(subjectId)) {
        return current.filter((id) => id !== subjectId)
      }
      return [...current, subjectId]
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedNumber = employeeNumber.trim()
    const trimmedName = fullName.trim()
    const trimmedBio = bio.trim()
    const trimmedLocation = tutoringLocation.trim()
    let trimmedSchedule = ''

    if (mode === 'create' && !trimmedNumber) {
      setError('El número de empleado es obligatorio.')
      return
    }
    const resolvedName = isTutorProfile ? (initial?.fullName ?? '').trim() : trimmedName
    const resolvedNumber = isTutorProfile
      ? (initial?.employeeNumber ?? '').trim()
      : trimmedNumber

    if (!resolvedName) {
      setError('El nombre del docente es obligatorio.')
      return
    }

    if (isTutorProfile) {
      const normalizedWeekdays = normalizeAvailableWeekdays(availableWeekdays)
      if (normalizedWeekdays.length === 0) {
        setError('Selecciona al menos un día de la semana.')
        return
      }
      const scheduleError = validateScheduleRange(scheduleStart, scheduleEnd)
      if (scheduleError) {
        setError(scheduleError)
        return
      }
      trimmedSchedule = formatScheduleSummary(scheduleStart, scheduleEnd)
      if (!trimmedLocation) {
        setError('El lugar donde impartirás las tutorías es obligatorio.')
        return
      }
      if (subjectIds.length === 0) {
        setError('Selecciona al menos una materia de asesoría.')
        return
      }
    }

    setError(null)
    try {
      await onSubmit({
        employeeNumber: resolvedNumber,
        fullName: resolvedName,
        bio: trimmedBio,
        ...(isTutorProfile
          ? {
              scheduleSummary: trimmedSchedule,
              tutoringLocation: trimmedLocation,
              subjectIds,
              availableWeekdays: normalizeAvailableWeekdays(availableWeekdays),
            }
          : {}),
      })
    } catch (err) {
      setError(err.message ?? 'No se pudo guardar el docente.')
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <div
        className={
          isTutorProfile
            ? 'grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8'
            : 'grid grid-cols-1 gap-4'
        }
      >
        <div className="flex min-w-0 flex-col gap-4">
          <div className="min-w-0">
            <label
              htmlFor="tutoring-professor-employee-number"
              className="font-alverata text-sm font-semibold text-uach-purple-900"
            >
              Número de empleado
            </label>
            <input
              id="tutoring-professor-employee-number"
              type="text"
              value={employeeNumber}
              onChange={(event) => setEmployeeNumber(event.target.value)}
              placeholder="Ej. 100245"
              disabled={isSubmitting || employeeNumberReadOnly}
              readOnly={employeeNumberReadOnly}
              className={employeeNumberReadOnly ? readOnlyInputClass : `${inputClass} mt-1.5`}
            />
          </div>

          <div className="min-w-0">
            <label
              htmlFor="tutoring-professor-name"
              className="font-alverata text-sm font-semibold text-uach-purple-900"
            >
              Nombre del docente
            </label>
            <input
              id="tutoring-professor-name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={fullNameReadOnly ? readOnlyInputClass : `${inputClass} mt-1.5`}
              placeholder="Ej. Dra. Ana López"
              disabled={isSubmitting || fullNameReadOnly}
              readOnly={fullNameReadOnly}
            />
          </div>

          <div className="min-w-0">
            <label htmlFor="tutoring-professor-bio" className="font-alverata text-sm font-semibold text-uach-purple-900">
              Perfil breve
            </label>
            <textarea
              id="tutoring-professor-bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className={`${textareaClass} mt-1.5`}
              placeholder="Opcional: especialidad o enfoque de sus tutorías…"
              disabled={isSubmitting}
              rows={3}
            />
          </div>
        </div>

        {isTutorProfile ? (
          <div className="flex min-w-0 flex-col gap-4 md:border-l md:border-uach-purple-900/15 md:pl-8">
            <TutoringTutorWeekdaysField
              selectedWeekdays={availableWeekdays}
              onToggle={toggleWeekday}
              disabled={isSubmitting}
            />

            <div className="min-w-0">
              <span className="font-alverata text-sm font-semibold text-uach-purple-900">
                Horario de tutorías
              </span>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <label htmlFor="tutoring-professor-schedule-start" className="sr-only">
                  Hora de inicio
                </label>
                <input
                  id="tutoring-professor-schedule-start"
                  type="time"
                  value={scheduleStart}
                  onChange={(event) => setScheduleStart(event.target.value)}
                  className={`${inputClass} min-w-0 flex-1`}
                  disabled={isSubmitting}
                />
                <span className="font-praxis shrink-0 text-sm font-semibold text-uach-purple-900/70">
                  a
                </span>
                <label htmlFor="tutoring-professor-schedule-end" className="sr-only">
                  Hora de fin
                </label>
                <input
                  id="tutoring-professor-schedule-end"
                  type="time"
                  value={scheduleEnd}
                  onChange={(event) => setScheduleEnd(event.target.value)}
                  className={`${inputClass} min-w-0 flex-1`}
                  disabled={isSubmitting}
                />
              </div>
              <p className="font-praxis mt-1.5 text-xs text-uach-purple-900/55">
                Elige de qué hora a qué hora ofreces asesorías cada día.
              </p>
            </div>

            <div className="min-w-0">
              <label
                htmlFor="tutoring-professor-location"
                className="font-alverata text-sm font-semibold text-uach-purple-900"
              >
                Lugar donde impartirás las tutorías
              </label>
              <input
                id="tutoring-professor-location"
                type="text"
                value={tutoringLocation}
                onChange={(event) => setTutoringLocation(event.target.value)}
                className={`${inputClass} mt-1.5`}
                placeholder="Ej. Cubículo 204, edificio de Administración"
                disabled={isSubmitting}
              />
            </div>
          </div>
        ) : null}
      </div>

      {isTutorProfile ? (
        <TutoringTutorSubjectsField
          subjects={availableSubjects}
          selectedIds={subjectIds}
          onToggle={toggleSubjectId}
          disabled={isSubmitting}
        />
      ) : null}

      {error ? <p className="font-praxis text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="button-secondary w-full sm:w-auto"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button type="submit" className="button-primary w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting
            ? 'Guardando…'
            : mode === 'create'
              ? 'Agregar docente'
              : isTutorProfile
                ? 'Guardar perfil'
                : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
