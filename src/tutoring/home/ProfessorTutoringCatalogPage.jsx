import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { TutoringProfessorCard } from '@/tutoring/home/components/TutoringProfessorCard'
import { TutoringSubjectSearchBar } from '@/tutoring/home/components/TutoringSubjectSearchBar'
import { HeroHeader } from '@/components/layout/HeroHeader'
import { Navbar } from '@/components/layout/Navbar'
import { getTutoringSubjectById } from '@/data/mockTutoringSubjects'
import {
  filterTutoringProfessors,
  getTutoringProfessorsBySubjectId,
} from '@/tutoring/home/filterTutoringProfessors'

export function ProfessorTutoringCatalogPage() {
  const { subjectId: subjectIdParam } = useParams()
  const subjectId = Number(subjectIdParam)
  const subject = Number.isFinite(subjectId) ? getTutoringSubjectById(subjectId) : null

  const [searchQuery, setSearchQuery] = useState('')

  const professorsForSubject = useMemo(() => {
    if (!subject) return []
    return getTutoringProfessorsBySubjectId({ subjectId: subject.id })
  }, [subject])

  const filteredProfessors = useMemo(
    () =>
      filterTutoringProfessors({
        searchQuery,
        items: professorsForSubject,
      }),
    [searchQuery, professorsForSubject],
  )

  if (!subject) {
    return <Navigate to="/professor-tutoring" replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex flex-1 flex-col gap-8 bg-white">
        <div className="professor-tutoring-hero">
          <HeroHeader
            title="Tutorías con profesores"
            description="Consulta los docentes disponibles para la materia que elegiste."
          />
        </div>

        <div className="page-shell flex flex-1 flex-col pb-8">
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
            <span className="text-uach-purple-900">{subject.name}</span>
          </nav>

          <section className="flex flex-1 flex-col gap-8">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-alverata text-xl font-semibold text-uach-purple-900">
                  Docentes de {subject.name}
                </h2>
                <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">
                  Solo se muestran maestros que imparten tutoría de esta materia.
                </p>
              </div>

              <TutoringSubjectSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                resultCount={filteredProfessors.length}
                totalCount={professorsForSubject.length}
                searchLabel="Buscar docente"
                searchPlaceholder="Buscar por nombre, perfil o lugar de asesoría…"
                countLabel={
                  professorsForSubject.length === 1 ? 'docente' : 'docentes'
                }
              />

              {filteredProfessors.length === 0 ? (
                <p className="font-praxis rounded-xl border border-dashed border-uach-purple-900/20 bg-uach-purple-50/40 px-5 py-8 text-center text-sm text-uach-purple-900/60">
                  {professorsForSubject.length === 0
                    ? 'No hay docentes registrados para esta materia por el momento.'
                    : 'No hay docentes que coincidan con tu búsqueda.'}
                </p>
              ) : (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProfessors.map((professor) => (
                    <li key={professor.employeeNumber}>
                      <TutoringProfessorCard
                        fullName={professor.fullName}
                        bio={professor.bio}
                        scheduleSummary={professor.scheduleSummary}
                        tutoringLocation={professor.tutoringLocation}
                        to={`/professor-tutoring/${subject.id}/${encodeURIComponent(professor.employeeNumber)}`}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link
              to="/professor-tutoring"
              className="font-praxis inline-block text-sm text-uach-purple-900/70 transition hover:text-uach-purple-900"
            >
              Volver a materias
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}
