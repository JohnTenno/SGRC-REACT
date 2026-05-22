import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TutoringSubjectCard } from '@/components/tutoring/TutoringSubjectCard'
import { TutoringSubjectSearchBar } from '@/components/tutoring/TutoringSubjectSearchBar'
import { HeroHeader } from '@/components/layout/HeroHeader'
import { Navbar } from '@/components/layout/Navbar'
import { MOCK_TUTORING_SUBJECTS } from '@/data/mockTutoringSubjects'
import { filterTutoringSubjects } from '@/lib/filterTutoringSubjects'

export function ProfessorTutoringPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSubjects = useMemo(
    () => filterTutoringSubjects({ searchQuery }),
    [searchQuery],
  )

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex flex-1 flex-col gap-8 bg-white">
        <div className="professor-tutoring-hero">
          <HeroHeader
            title="Tutorías con profesores"
            description="Agenda sesiones de tutoría impartidas por docentes y confirma tu asistencia desde el mismo sistema."
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
            <span className="text-uach-purple-900">Tutorías con profesores</span>
          </nav>

          <section className="flex flex-1 flex-col gap-8">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-alverata text-xl font-semibold text-uach-purple-900">
                  Materias con tutoría
                </h2>
                <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">
                  Elige una materia para consultar horarios y docentes disponibles.
                </p>
              </div>

              <TutoringSubjectSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                resultCount={filteredSubjects.length}
                totalCount={MOCK_TUTORING_SUBJECTS.length}
              />

              {filteredSubjects.length === 0 ? (
                <p className="font-praxis rounded-xl border border-dashed border-uach-purple-900/20 bg-uach-purple-50/40 px-5 py-8 text-center text-sm text-uach-purple-900/60">
                  No hay materias que coincidan con tu búsqueda.
                </p>
              ) : (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSubjects.map((subject) => (
                    <li key={subject.id}>
                      <TutoringSubjectCard
                        name={subject.name}
                        description={subject.description}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link
              to="/home"
              className="font-praxis inline-block text-sm text-uach-purple-900/70 transition hover:text-uach-purple-900"
            >
              Volver al inicio
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}
