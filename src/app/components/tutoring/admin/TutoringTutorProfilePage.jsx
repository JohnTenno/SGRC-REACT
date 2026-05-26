import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TutoringProfessorAdminForm } from '@/app/components/tutoring/admin/TutoringProfessorAdminForm'
import { getSelectedSubjectsFromCatalog } from '@/app/components/tutoring/admin/tutoringSubjectsUtils'
import { formatAvailableWeekdays } from '@/app/components/tutoring/admin/tutoringWeekdaysUtils'
import {
  getTutoringProfessorCatalogByEmployeeNumber,
  updateTutoringProfessorAdmin,
} from '@/app/services/tutoring/professors.service'
import { updateTutoringProfessorOfferingAdmin } from '@/app/components/tutoring/admin/tutoringProfessorOfferingsAdminApi'
import { fetchTutoringSubjectsAdmin } from '@/app/services/tutoring/subjects.service'
import {
  getTutorProfileEmployeeNumber,
  setTutorProfileEmployeeNumber,
} from '@/app/components/tutoring/admin/tutoringTutorProfileSession'
import { getTutoringProfessorOffering } from '@/app/services/tutoring/offerings.service'
import { TutoringProfessorAvatar } from '@/app/components/tutoring/TutoringProfessorAvatar'

function buildTutorProfile(catalogEntry) {
  const offering = getTutoringProfessorOffering(catalogEntry.employeeNumber)
  return {
    ...catalogEntry,
    scheduleSummary: offering.scheduleSummary,
    tutoringLocation: offering.tutoringLocation,
    subjectIds: offering.subjectIds ?? [],
    availableWeekdays: offering.availableWeekdays ?? [],
  }
}

export function TutoringTutorProfilePage() {
  const employeeNumber = getTutorProfileEmployeeNumber()
  const [professor, setProfessor] = useState(null)
  const [subjectsCatalog, setSubjectsCatalog] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)
  const [saveError, setSaveError] = useState(null)

  async function loadProfessor() {
    setIsLoading(true)
    setSaveMessage(null)
    setSaveError(null)
    try {
      const [entry, subjects] = await Promise.all([
        Promise.resolve(getTutoringProfessorCatalogByEmployeeNumber(employeeNumber)),
        fetchTutoringSubjectsAdmin(),
      ])
      setSubjectsCatalog(subjects)
      setProfessor(entry ? buildTutorProfile(entry) : null)
    } catch {
      setSubjectsCatalog([])
      setProfessor(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setTutorProfileEmployeeNumber(employeeNumber)
    async function load() {
      setIsLoading(true)
      setSaveMessage(null)
      setSaveError(null)
      try {
        const [entry, subjects] = await Promise.all([
          Promise.resolve(getTutoringProfessorCatalogByEmployeeNumber(employeeNumber)),
          fetchTutoringSubjectsAdmin(),
        ])
        setSubjectsCatalog(subjects)
        setProfessor(entry ? buildTutorProfile(entry) : null)
      } catch {
        setSubjectsCatalog([])
        setProfessor(null)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [employeeNumber])

  const selectedSubjects = useMemo(() => {
    if (!professor) return []
    return getSelectedSubjectsFromCatalog(professor.subjectIds, subjectsCatalog)
  }, [professor, subjectsCatalog])

  async function handleSave(values) {
    if (!professor) return
    setIsSubmitting(true)
    setSaveMessage(null)
    setSaveError(null)
    try {
      const updatedCatalog = await updateTutoringProfessorAdmin(professor.employeeNumber, {
        employeeNumber: professor.employeeNumber,
        fullName: professor.fullName,
        bio: values.bio,
      })
      const updatedOffering = await updateTutoringProfessorOfferingAdmin(professor.employeeNumber, {
        scheduleSummary: values.scheduleSummary,
        tutoringLocation: values.tutoringLocation,
        subjectIds: values.subjectIds,
        availableWeekdays: values.availableWeekdays,
      })
      const subjects = await fetchTutoringSubjectsAdmin()
      setSubjectsCatalog(subjects)
      setProfessor({
        ...updatedCatalog,
        scheduleSummary: updatedOffering.scheduleSummary,
        tutoringLocation: updatedOffering.tutoringLocation,
        subjectIds: updatedOffering.subjectIds,
        availableWeekdays: updatedOffering.availableWeekdays,
      })
      setSaveMessage('Tu perfil se actualizó correctamente.')
    } catch (err) {
      setSaveError(err.message ?? 'No se pudo guardar tu perfil.')
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-alverata text-2xl font-semibold text-uach-purple-900 sm:text-3xl">
          Perfil del tutor
        </h1>
        <p className="font-praxis mt-2 max-w-2xl text-sm text-uach-purple-900/70 sm:text-base">
          Consulta tu ficha y actualiza tu perfil breve, materias, días, horario y lugar de
          tutorías. El número de empleado y tu nombre solo los modifica el administrador.
        </p>
      </header>

      {isLoading ? (
        <div className="h-56 animate-pulse rounded-xl bg-uach-purple-900/8" aria-busy="true" />
      ) : !professor ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">
            Perfil no disponible
          </h2>
          <p className="font-praxis mt-2 text-sm text-uach-purple-900/75">
            No encontramos un docente con el número de empleado{' '}
            <span className="font-semibold">{employeeNumber}</span> en el catálogo. Pide al
            administrador que registre tu ficha en el catálogo de docentes.
          </p>
          <Link to="/admin/tutorias-docentes" className="button-secondary mt-4 inline-flex">
            Ir al catálogo de docentes
          </Link>
        </section>
      ) : (
        <>
          <section className="rounded-xl border border-uach-purple-900/15 bg-uach-purple-50/40 p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <TutoringProfessorAvatar fullName={professor.fullName} size="lg" />
                <div className="min-w-0 flex-1">
                  <h2 className="font-alverata text-xl font-semibold leading-tight text-uach-purple-900 sm:text-2xl">
                    {professor.fullName}
                  </h2>
                  <p className="font-praxis mt-1.5 text-xs font-semibold text-uach-gold-600">
                    {professor.employeeNumber}
                  </p>
                  <p className="font-praxis mt-3 text-sm text-uach-purple-900/70">
                    {professor.bio || 'Aún no has escrito un perfil breve.'}
                  </p>
                </div>
              </div>

              <dl className="font-praxis flex min-w-0 flex-col justify-center gap-4 border-uach-purple-900/15 text-sm md:border-l md:pl-8">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-uach-purple-900/55">
                    Días de tutorías
                  </dt>
                  <dd className="mt-1 font-semibold text-uach-purple-900/90">
                    {formatAvailableWeekdays(professor.availableWeekdays)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-uach-purple-900/55">
                    Horario de tutorías
                  </dt>
                  <dd className="mt-1 font-semibold text-uach-gold-600">{professor.scheduleSummary}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-uach-purple-900/55">
                    Lugar de tutorías
                  </dt>
                  <dd className="mt-1 font-semibold text-uach-purple-900/90">
                    {professor.tutoringLocation}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 border-t border-uach-purple-900/10 pt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-uach-purple-900/55">
                Materias de asesoría
              </p>
              {selectedSubjects.length > 0 ? (
                <ul className="mt-3 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedSubjects.map((subject) => (
                    <li
                      key={subject.id}
                      className="rounded-lg border border-uach-purple-900/12 bg-white px-3 py-3"
                    >
                      <p className="font-alverata text-sm font-semibold text-uach-purple-900">
                        {subject.name}
                      </p>
                      <p className="font-praxis mt-1 text-xs leading-relaxed text-uach-purple-900/65">
                        {subject.description || 'Sin descripción en el catálogo.'}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-praxis mt-2 text-sm text-uach-purple-900/55">
                  Sin materias seleccionadas del catálogo.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-uach-purple-900/15 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">
              Tu información
            </h2>
            <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">
              Los estudiantes verán estos datos al buscar tutorías contigo.
            </p>

            <div className="mt-6">
              <TutoringProfessorAdminForm
                mode="edit"
                variant="tutorProfile"
                initial={professor}
                availableSubjects={subjectsCatalog}
                onSubmit={handleSave}
                onCancel={loadProfessor}
                isSubmitting={isSubmitting}
              />
            </div>

            {saveMessage ? (
              <p className="font-praxis mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {saveMessage}
              </p>
            ) : null}
            {saveError ? (
              <p className="font-praxis mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {saveError}
              </p>
            ) : null}
          </section>
        </>
      )}
    </div>
  )
}
