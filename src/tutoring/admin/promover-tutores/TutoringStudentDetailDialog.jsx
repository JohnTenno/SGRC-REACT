import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconClose } from '@/components/icons'
import { promoteStudentToTutorAdmin } from '@/tutoring/admin/promover-tutores/tutoringStudentsAdminApi'
import { setTutorProfileEmployeeNumber } from '@/tutoring/admin/perfil-tutor/tutoringTutorProfileSession'

export function TutoringStudentDetailDialog({ student, onClose, onPromoted }) {
  const [current, setCurrent] = useState(student)
  const [isPromoting, setIsPromoting] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    setCurrent(student)
    setError(null)
    setSuccessMessage(null)
  }, [student])

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  async function handlePromote() {
    setIsPromoting(true)
    setError(null)
    setSuccessMessage(null)
    try {
      const updated = await promoteStudentToTutorAdmin(current.enrollment)
      setCurrent(updated)
      setSuccessMessage('El alumno fue promovido a tutor. Ya puede configurar su perfil.')
      onPromoted(updated)
    } catch (err) {
      setError(err.message ?? 'No se pudo promover al alumno.')
    } finally {
      setIsPromoting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-uach-purple-950/50" aria-hidden onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutoring-student-detail-title"
        className="relative z-10 flex max-h-[min(90vh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-uach-purple-900/15 bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-uach-purple-900/10 px-5 py-4">
          <div className="min-w-0">
            <p className="font-praxis text-xs font-semibold uppercase tracking-wide text-uach-gold-600">
              Alumno
            </p>
            <h2
              id="tutoring-student-detail-title"
              className="font-alverata text-xl font-semibold text-uach-purple-900"
            >
              {current.fullName}
            </h2>
            <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">{current.enrollment}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-uach-purple-900/70 transition hover:bg-uach-purple-50 hover:text-uach-purple-900"
            aria-label="Cerrar"
          >
            <IconClose className="size-5" aria-hidden />
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-4">
          <dl className="font-praxis grid gap-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-uach-purple-900/55">
                Nombre
              </dt>
              <dd className="mt-1 font-semibold text-uach-purple-900">{current.fullName}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-uach-purple-900/55">
                Matrícula
              </dt>
              <dd className="mt-1 font-semibold tabular-nums text-uach-purple-900">
                {current.enrollment}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-uach-purple-900/55">
                CURP
              </dt>
              <dd className="mt-1 break-all font-semibold text-uach-purple-900/90">{current.curp}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-uach-purple-900/55">
                Carrera
              </dt>
              <dd className="mt-1 font-semibold text-uach-purple-900/90">{current.career}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-uach-purple-900/55">
                Estatus
              </dt>
              <dd className="mt-1">
                {current.isTutor ? (
                  <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    Tutor activo
                  </span>
                ) : (
                  <span className="inline-flex rounded-full border border-uach-purple-900/15 bg-uach-purple-50 px-2.5 py-0.5 text-xs font-semibold text-uach-purple-900">
                    Alumno
                  </span>
                )}
              </dd>
            </div>
          </dl>

          {error ? (
            <p className="font-praxis mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {successMessage ? (
            <p className="font-praxis mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {successMessage}
            </p>
          ) : null}
        </div>

        <footer className="flex flex-col gap-2 border-t border-uach-purple-900/10 px-5 py-4 sm:flex-row sm:justify-end">
          <button type="button" className="button-secondary w-full sm:w-auto" onClick={onClose}>
            Cerrar
          </button>
          {current.isTutor ? (
            <Link
              to="/admin/tutorias-perfil-docente"
              className="button-primary w-full sm:w-auto"
              onClick={() => setTutorProfileEmployeeNumber(current.enrollment)}
            >
              Ir al perfil del tutor
            </Link>
          ) : (
            <button
              type="button"
              className="button-primary w-full sm:w-auto"
              disabled={isPromoting}
              onClick={handlePromote}
            >
              {isPromoting ? 'Promoviendo…' : 'Promover a tutor'}
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}
