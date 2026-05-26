import { useCallback, useEffect, useMemo, useState } from 'react'
import { IconEye } from '@/components/icons'
import { TutoringPromoteTutorsToolbar } from '@/tutoring/admin/promover-tutores/TutoringPromoteTutorsToolbar'
import { TutoringStudentDetailDialog } from '@/tutoring/admin/promover-tutores/TutoringStudentDetailDialog'
import { fetchTutoringStudentsAdmin } from '@/tutoring/admin/promover-tutores/tutoringStudentsAdminApi'

export function TutoringPromoteTutorsPage() {
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return students
    return students.filter((student) => {
      return (
        student.fullName.toLowerCase().includes(query) ||
        student.enrollment.toLowerCase().includes(query) ||
        student.curp.toLowerCase().includes(query) ||
        student.career.toLowerCase().includes(query)
      )
    })
  }, [students, searchQuery])

  const loadStudents = useCallback(async () => {
    setLoadError(null)
    try {
      const list = await fetchTutoringStudentsAdmin()
      setStudents(list)
    } catch (err) {
      setLoadError(err.message ?? 'No se pudo cargar el listado de alumnos.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  function handleStudentPromoted(updated) {
    setStudents((list) =>
      list.map((item) => (item.enrollment === updated.enrollment ? updated : item)),
    )
    setSelectedStudent(updated)
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="font-alverata text-2xl font-semibold text-uach-purple-900 sm:text-3xl">
            Promover tutores
          </h1>
          <p className="font-praxis mt-2 max-w-2xl text-sm text-uach-purple-900/70 sm:text-base">
            Consulta alumnos registrados y promuévelos a tutor para que puedan usar su perfil y
            ofrecer asesorías.
          </p>
        </div>

        {!isLoading && !loadError && students.length > 0 ? (
          <TutoringPromoteTutorsToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            resultCount={filteredStudents.length}
            totalCount={students.length}
          />
        ) : null}
      </header>

      <section
        className="overflow-hidden rounded-xl border border-uach-purple-900/15 bg-white shadow-sm"
        aria-label="Tabla de alumnos"
      >
        {isLoading ? (
          <p className="font-praxis px-4 py-12 text-center text-sm text-uach-purple-900/60">
            Cargando alumnos…
          </p>
        ) : loadError ? (
          <p className="font-praxis px-4 py-12 text-center text-sm text-red-600">{loadError}</p>
        ) : students.length === 0 ? (
          <p className="font-praxis px-4 py-12 text-center text-sm text-uach-purple-900/60">
            No hay alumnos registrados.
          </p>
        ) : filteredStudents.length === 0 ? (
          <p className="font-praxis px-4 py-12 text-center text-sm text-uach-purple-900/60">
            No hay alumnos que coincidan con tu búsqueda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="font-praxis w-full min-w-[48rem] border-collapse text-left text-sm text-uach-purple-900">
              <thead>
                <tr className="border-b border-uach-purple-900/10 bg-uach-purple-50/80">
                  <th className="px-4 py-3 font-semibold">Nombre</th>
                  <th className="px-4 py-3 font-semibold">Matrícula</th>
                  <th className="px-4 py-3 font-semibold">CURP</th>
                  <th className="px-4 py-3 font-semibold">Carrera</th>
                  <th className="px-4 py-3 font-semibold">Estatus</th>
                  <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.enrollment}
                    className="border-b border-uach-purple-900/8 transition last:border-b-0 hover:bg-uach-purple-50/40"
                  >
                    <td className="px-4 py-3 font-semibold">{student.fullName}</td>
                    <td className="px-4 py-3 tabular-nums">{student.enrollment}</td>
                    <td className="max-w-[12rem] px-4 py-3 text-xs break-all text-uach-purple-900/85 sm:max-w-none sm:text-sm">
                      {student.curp}
                    </td>
                    <td className="px-4 py-3 text-uach-purple-900/85">{student.career}</td>
                    <td className="px-4 py-3">
                      {student.isTutor ? (
                        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                          Tutor
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full border border-uach-purple-900/15 bg-uach-purple-50 px-2.5 py-0.5 text-xs font-semibold text-uach-purple-900/80">
                          Alumno
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(student)}
                        className="inline-flex size-10 items-center justify-center rounded-lg border border-uach-purple-900/15 text-uach-purple-900 transition hover:border-uach-purple-700/30 hover:bg-uach-purple-50"
                        aria-label={`Ver alumno ${student.fullName}`}
                      >
                        <IconEye className="size-5" aria-hidden />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedStudent ? (
        <TutoringStudentDetailDialog
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onPromoted={handleStudentPromoted}
        />
      ) : null}
    </div>
  )
}
