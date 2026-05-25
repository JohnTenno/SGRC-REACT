import { useCallback, useEffect, useMemo, useState } from 'react'
import { CubicleAdminCard } from '@/cubicles/admin/CubicleAdminCard'
import { CubicleAdminForm } from '@/cubicles/admin/CubicleAdminForm'
import { CubiclesPanelToolbar } from '@/cubicles/admin/CubiclesPanelToolbar'
import {
  createCubicleAdmin,
  deleteCubicleAdmin,
  fetchCubiclesAdmin,
  getCubicleStatusLabel,
  updateCubicleAdmin,
} from '@/cubicles/admin/cubiclesAdminApi'

export function CubiclesPanelPage() {
  const [cubicles, setCubicles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [panelError, setPanelError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCubicle, setEditingCubicle] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilters, setStatusFilters] = useState([])
  const [minCapacity, setMinCapacity] = useState(0)

  const filteredCubicles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return cubicles.filter((cubicle) => {
      if (statusFilters.length > 0 && !statusFilters.includes(cubicle.status)) return false
      if (minCapacity > 0 && cubicle.capacity < minCapacity) return false
      if (!query) return true
      const statusLabel = getCubicleStatusLabel(cubicle.status).toLowerCase()
      return (
        cubicle.identifier.toLowerCase().includes(query) ||
        String(cubicle.id).includes(query) ||
        String(cubicle.capacity).includes(query) ||
        cubicle.status.toLowerCase().includes(query) ||
        statusLabel.includes(query)
      )
    })
  }, [cubicles, searchQuery, statusFilters, minCapacity])

  const hasActiveFilters = statusFilters.length > 0 || minCapacity > 0

  function clearFilters() {
    setStatusFilters([])
    setMinCapacity(0)
  }

  const loadCubicles = useCallback(async () => {
    setLoadError(null)
    try {
      const list = await fetchCubiclesAdmin()
      setCubicles(list)
    } catch (err) {
      setLoadError(err.message ?? 'No se pudieron cargar los cubículos.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCubicles()
  }, [loadCubicles])

  async function handleCreate(values) {
    setIsSubmitting(true)
    setPanelError(null)
    try {
      const created = await createCubicleAdmin(values)
      setShowCreateForm(false)
      setCubicles((list) => [...list, created])
    } catch (err) {
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleEdit(values) {
    if (!editingCubicle) return
    setIsSubmitting(true)
    setPanelError(null)
    try {
      const updated = await updateCubicleAdmin(editingCubicle.id, values)
      setCubicles((list) => list.map((item) => (item.id === updated.id ? updated : item)))
      setEditingCubicle(null)
    } catch (err) {
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(cubicle) {
    const confirmed = window.confirm(
      `¿Eliminar "${cubicle.identifier}"? Esta acción no se puede deshacer.`,
    )
    if (!confirmed) return

    setDeletingId(cubicle.id)
    setPanelError(null)
    try {
      await deleteCubicleAdmin(cubicle.id)
      setCubicles((list) => list.filter((item) => item.id !== cubicle.id))
    } catch (err) {
      setPanelError(err.message ?? 'No se pudo eliminar el cubículo.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="font-alverata text-2xl font-semibold text-uach-purple-900 sm:text-3xl">
            Cubículos
          </h1>
          <p className="font-praxis mt-2 max-w-2xl text-sm text-uach-purple-900/70 sm:text-base">
            Administra los cubículos que ven los estudiantes al reservar: alta, baja y estatus.
          </p>
        </div>

        <CubiclesPanelToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilters={statusFilters}
          onStatusFiltersChange={setStatusFilters}
          minCapacity={minCapacity}
          onMinCapacityChange={setMinCapacity}
          resultCount={filteredCubicles.length}
          totalCount={cubicles.length}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        >
          <button
            type="button"
            className="button-primary shrink-0"
            onClick={() => {
              setShowCreateForm((open) => !open)
              setEditingCubicle(null)
            }}
          >
            {showCreateForm ? 'Cerrar formulario' : 'Agregar cubículo'}
          </button>
        </CubiclesPanelToolbar>
      </header>

      {panelError ? (
        <p className="font-praxis rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {panelError}
        </p>
      ) : null}

      {showCreateForm ? (
        <section className="rounded-xl border border-uach-purple-900/15 bg-uach-purple-50/40 p-5 sm:p-6">
          <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">Nuevo cubículo</h2>
          <div className="mt-4">
            <CubicleAdminForm
              mode="create"
              onSubmit={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </section>
      ) : null}

      {editingCubicle ? (
        <section className="rounded-xl border border-uach-gold-400/40 bg-uach-gold-400/10 p-5 sm:p-6">
          <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">
            Editar cubículo
          </h2>
          <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">{editingCubicle.identifier}</p>
          <div className="mt-4">
            <CubicleAdminForm
              mode="edit"
              initial={editingCubicle}
              onSubmit={handleEdit}
              onCancel={() => setEditingCubicle(null)}
              isSubmitting={isSubmitting}
            />
          </div>
        </section>
      ) : null}

      <section aria-label="Listado de cubículos">
        {isLoading ? (
          <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <li key={n} className="h-56 w-full animate-pulse rounded-lg bg-uach-purple-900/8" />
            ))}
          </ul>
        ) : loadError ? (
          <p className="font-praxis rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-600">
            {loadError}
          </p>
        ) : cubicles.length === 0 ? (
          <p className="font-praxis rounded-xl border border-dashed border-uach-purple-900/20 px-4 py-12 text-center text-sm text-uach-purple-900/60">
            No hay cubículos registrados. Agrega el primero con el botón de arriba.
          </p>
        ) : filteredCubicles.length === 0 ? (
          <p className="font-praxis rounded-xl border border-dashed border-uach-purple-900/20 px-4 py-12 text-center text-sm text-uach-purple-900/60">
            No hay cubículos que coincidan con tu búsqueda o filtros.
          </p>
        ) : (
          <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCubicles.map((cubicle) => (
              <li key={cubicle.id} className="flex w-full">
                <CubicleAdminCard
                  cubicle={cubicle}
                  isEditing={editingCubicle?.id === cubicle.id}
                  isDeleting={deletingId === cubicle.id}
                  onEdit={() => {
                    setEditingCubicle(cubicle)
                    setShowCreateForm(false)
                  }}
                  onDelete={() => handleDelete(cubicle)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
