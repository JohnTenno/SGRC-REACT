import { useEffect, useMemo, useState } from 'react'
import { TutoringAdminFormDialog } from '@/app/components/tutoring/admin/TutoringAdminFormDialog'
import { TutoringProfessorAdminCard } from '@/app/components/tutoring/admin/TutoringProfessorAdminCard'
import { TutoringProfessorAdminForm } from '@/app/components/tutoring/admin/TutoringProfessorAdminForm'
import { TutoringProfessorsPanelToolbar } from '@/app/components/tutoring/admin/TutoringProfessorsPanelToolbar'
import {
  createTutoringProfessorAdmin,
  deleteTutoringProfessorAdmin,
  fetchTutoringProfessorsAdmin,
  updateTutoringProfessorAdmin,
} from '@/app/services/tutoring/professors.service'

export function TutoringProfessorsPanelPage() {
  const [professors, setProfessors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [panelError, setPanelError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingProfessor, setEditingProfessor] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingEmployeeNumber, setDeletingEmployeeNumber] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProfessors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return professors
    return professors.filter((professor) => {
      return (
        professor.fullName.toLowerCase().includes(query) ||
        professor.bio.toLowerCase().includes(query) ||
        professor.employeeNumber.toLowerCase().includes(query)
      )
    })
  }, [professors, searchQuery])

  useEffect(() => {
    async function load() {
      setLoadError(null)
      try {
        const list = await fetchTutoringProfessorsAdmin()
        setProfessors(list)
      } catch (err) {
        setLoadError(err.message ?? 'No se pudo cargar el catálogo de docentes.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  async function handleCreate(values) {
    setIsSubmitting(true)
    setPanelError(null)
    try {
      const created = await createTutoringProfessorAdmin(values)
      setShowCreateForm(false)
      setProfessors((list) => [...list, created])
    } catch (err) {
      setPanelError(err.message ?? 'No se pudo crear el docente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleEdit(values) {
    if (!editingProfessor) return
    setIsSubmitting(true)
    setPanelError(null)
    try {
      const updated = await updateTutoringProfessorAdmin(editingProfessor.employeeNumber, values)
      setProfessors((list) =>
        list.map((item) => (item.employeeNumber === updated.employeeNumber ? updated : item)),
      )
      setEditingProfessor(null)
    } catch (err) {
      setPanelError(err.message ?? 'No se pudo crear el docente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `¿Eliminar a "${item.fullName}"? Esta acción no se puede deshacer.`,
    )
    if (!confirmed) return

    setDeletingEmployeeNumber(item.employeeNumber)
    setPanelError(null)
    try {
      await deleteTutoringProfessorAdmin(item.employeeNumber)
      setProfessors((list) => list.filter((entry) => entry.employeeNumber !== item.employeeNumber))
    } catch (err) {
      setPanelError(err.message ?? 'No se pudo eliminar el docente.')
    } finally {
      setDeletingEmployeeNumber(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="font-alverata text-2xl font-semibold text-uach-purple-900 sm:text-3xl">
            Catálogo de docentes
          </h1>
          <p className="font-praxis mt-2 max-w-2xl text-sm text-uach-purple-900/70 sm:text-base">
            Administra el catálogo general de docentes para tutorías.
          </p>
        </div>

        <TutoringProfessorsPanelToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={filteredProfessors.length}
          totalCount={professors.length}
        >
          <button
            type="button"
            className="button-primary shrink-0"
            onClick={() => {
              setShowCreateForm((open) => !open)
              setEditingProfessor(null)
            }}
          >
            {showCreateForm ? 'Cerrar formulario' : 'Agregar docente'}
          </button>
        </TutoringProfessorsPanelToolbar>
      </header>

      {panelError ? (
        <p className="font-praxis rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {panelError}
        </p>
      ) : null}

      {showCreateForm ? (
        <section className="rounded-xl border border-uach-purple-900/15 bg-uach-purple-50/40 p-5 sm:p-6">
          <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">Nuevo docente</h2>
          <div className="mt-4">
            <TutoringProfessorAdminForm
              mode="create"
              onSubmit={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </section>
      ) : null}

      <section aria-label="Listado de docentes">
        {isLoading ? (
          <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <li key={n} className="h-52 w-full animate-pulse rounded-lg bg-uach-purple-900/8" />
            ))}
          </ul>
        ) : loadError ? (
          <p className="font-praxis rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-600">
            {loadError}
          </p>
        ) : professors.length === 0 ? (
          <p className="font-praxis rounded-xl border border-dashed border-uach-purple-900/20 px-4 py-12 text-center text-sm text-uach-purple-900/60">
            No hay docentes registrados. Agrega el primero con el botón de arriba.
          </p>
        ) : filteredProfessors.length === 0 ? (
          <p className="font-praxis rounded-xl border border-dashed border-uach-purple-900/20 px-4 py-12 text-center text-sm text-uach-purple-900/60">
            No hay docentes que coincidan con tu búsqueda.
          </p>
        ) : (
          <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProfessors.map((item) => (
              <li key={item.employeeNumber} className="flex w-full">
                <TutoringProfessorAdminCard
                  professor={item}
                  isEditing={editingProfessor?.employeeNumber === item.employeeNumber}
                  isDeleting={deletingEmployeeNumber === item.employeeNumber}
                  onEdit={() => {
                    setEditingProfessor(item)
                    setShowCreateForm(false)
                  }}
                  onDelete={() => handleDelete(item)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {editingProfessor ? (
        <TutoringAdminFormDialog
          title="Editar docente"
          subtitle={editingProfessor.fullName}
          onClose={() => setEditingProfessor(null)}
        >
          <TutoringProfessorAdminForm
            mode="edit"
            initial={editingProfessor}
            onSubmit={handleEdit}
            onCancel={() => setEditingProfessor(null)}
            isSubmitting={isSubmitting}
          />
        </TutoringAdminFormDialog>
      ) : null}
    </div>
  )
}
