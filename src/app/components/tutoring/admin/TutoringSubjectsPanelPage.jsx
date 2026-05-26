import { useEffect, useMemo, useState } from 'react'
import { TutoringAdminFormDialog } from '@/app/components/tutoring/admin/TutoringAdminFormDialog'
import { TutoringSubjectAdminCard } from '@/app/components/tutoring/admin/TutoringSubjectAdminCard'
import { TutoringSubjectAdminForm } from '@/app/components/tutoring/admin/TutoringSubjectAdminForm'
import { TutoringSubjectsPanelToolbar } from '@/app/components/tutoring/admin/TutoringSubjectsPanelToolbar'
import {
  createTutoringSubjectAdmin,
  deleteTutoringSubjectAdmin,
  fetchTutoringSubjectsAdmin,
  updateTutoringSubjectAdmin,
} from '@/app/services/tutoring/subjects.service'

export function TutoringSubjectsPanelPage() {
  const [subjects, setSubjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [panelError, setPanelError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSubjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return subjects
    return subjects.filter((subject) => {
      return (
        subject.name.toLowerCase().includes(query) ||
        subject.description.toLowerCase().includes(query) ||
        String(subject.id).includes(query)
      )
    })
  }, [subjects, searchQuery])

  useEffect(() => {
    async function load() {
      setLoadError(null)
      try {
        const list = await fetchTutoringSubjectsAdmin()
        setSubjects(list)
      } catch (err) {
        setLoadError(err.message ?? 'No se pudo cargar el catálogo de materias.')
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
      const created = await createTutoringSubjectAdmin(values)
      setShowCreateForm(false)
      setSubjects((list) => [...list, created])
    } catch (err) {
      setPanelError(err.message ?? 'No se pudo crear la materia.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleEdit(values) {
    if (!editingSubject) return
    setIsSubmitting(true)
    setPanelError(null)
    try {
      const updated = await updateTutoringSubjectAdmin(editingSubject.id, values)
      setSubjects((list) => list.map((item) => (item.id === updated.id ? updated : item)))
      setEditingSubject(null)
    } catch (err) {
      setPanelError(err.message ?? 'No se pudo crear la materia.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `¿Eliminar "${item.name}"? Esta acción no se puede deshacer.`,
    )
    if (!confirmed) return

    setDeletingId(item.id)
    setPanelError(null)
    try {
      await deleteTutoringSubjectAdmin(item.id)
      setSubjects((list) => list.filter((entry) => entry.id !== item.id))
    } catch (err) {
      setPanelError(err.message ?? 'No se pudo eliminar la materia.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="font-alverata text-2xl font-semibold text-uach-purple-900 sm:text-3xl">
            Catálogo de materias
          </h1>
          <p className="font-praxis mt-2 max-w-2xl text-sm text-uach-purple-900/70 sm:text-base">
            Administra las materias que los estudiantes ven al buscar tutorías con profesores.
          </p>
        </div>

        <TutoringSubjectsPanelToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={filteredSubjects.length}
          totalCount={subjects.length}
        >
          <button
            type="button"
            className="button-primary shrink-0"
            onClick={() => {
              setShowCreateForm((open) => !open)
              setEditingSubject(null)
            }}
          >
            {showCreateForm ? 'Cerrar formulario' : 'Agregar materia'}
          </button>
        </TutoringSubjectsPanelToolbar>
      </header>

      {panelError ? (
        <p className="font-praxis rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {panelError}
        </p>
      ) : null}

      {showCreateForm ? (
        <section className="rounded-xl border border-uach-purple-900/15 bg-uach-purple-50/40 p-5 sm:p-6">
          <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">Nueva materia</h2>
          <div className="mt-4">
            <TutoringSubjectAdminForm
              mode="create"
              onSubmit={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </section>
      ) : null}

      <section aria-label="Listado de materias">
        {isLoading ? (
          <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <li key={n} className="h-48 w-full animate-pulse rounded-lg bg-uach-purple-900/8" />
            ))}
          </ul>
        ) : loadError ? (
          <p className="font-praxis rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-600">
            {loadError}
          </p>
        ) : subjects.length === 0 ? (
          <p className="font-praxis rounded-xl border border-dashed border-uach-purple-900/20 px-4 py-12 text-center text-sm text-uach-purple-900/60">
            No hay materias registradas. Agrega la primera con el botón de arriba.
          </p>
        ) : filteredSubjects.length === 0 ? (
          <p className="font-praxis rounded-xl border border-dashed border-uach-purple-900/20 px-4 py-12 text-center text-sm text-uach-purple-900/60">
            No hay materias que coincidan con tu búsqueda.
          </p>
        ) : (
          <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.map((item) => (
              <li key={item.id} className="flex w-full">
                <TutoringSubjectAdminCard
                  subject={item}
                  isEditing={editingSubject?.id === item.id}
                  isDeleting={deletingId === item.id}
                  onEdit={() => {
                    setEditingSubject(item)
                    setShowCreateForm(false)
                  }}
                  onDelete={() => handleDelete(item)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {editingSubject ? (
        <TutoringAdminFormDialog
          title="Editar materia"
          subtitle={editingSubject.name}
          onClose={() => setEditingSubject(null)}
        >
          <TutoringSubjectAdminForm
            mode="edit"
            initial={editingSubject}
            onSubmit={handleEdit}
            onCancel={() => setEditingSubject(null)}
            isSubmitting={isSubmitting}
          />
        </TutoringAdminFormDialog>
      ) : null}
    </div>
  )
}
