import { useEffect, useState, useCallback } from 'react'
import { CubicleAdminCard } from '@/app/components/cubicles/admin/CubicleAdminCard'
import { CubicleAdminForm } from '@/app/components/cubicles/admin/CubicleAdminForm'
import { CubiclesPanelToolbar } from '@/app/components/cubicles/admin/CubiclesPanelToolbar'
import {
  createCubicleAdmin,
  deleteCubicleAdmin,
  fetchCubiclesAdmin,
  updateCubicleAdmin,
} from '@/app/services/cubicles/admin.service'

export function CubiclesPanelPage() {
  const [cubicles, setCubicles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [panelError, setPanelError] = useState(null)

  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCubicle, setEditingCubicle] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilters, setStatusFilters] = useState([])
  const [minCapacity, setMinCapacity] = useState(0)

  const hasActiveFilters = statusFilters.length > 0 || minCapacity > 0

  const loadCubicles = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await fetchCubiclesAdmin({
        page,
        size: 10,
        search: searchQuery,
        statusFilters,
        minCapacity
      })
      setCubicles(data.content || [])
      setTotalPages(data.totalPages ?? data.page?.totalPages ?? 0)
      setTotalElements(data.totalElements ?? data.page?.totalElements ?? 0)
    } catch (err) {
      setLoadError(err.message ?? 'No se pudieron cargar los cubículos.')
    } finally {
      setIsLoading(false)
    }
  }, [page, searchQuery, statusFilters, minCapacity])

  useEffect(() => {
    async function run() {
      await loadCubicles()
    }

    run()
  }, [loadCubicles])

  function clearFilters() {
    setStatusFilters([])
    setMinCapacity(0)
    setSearchQuery('')
    setPage(0)
  }

  async function handleCreate(values) {
    setIsSubmitting(true)
    setPanelError(null)
    try {
      await createCubicleAdmin(values)
      setShowCreateForm(false)
      loadCubicles()
    } catch (err) {
      setPanelError(err.message ?? 'No se pudo crear el cubículo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleEdit(values) {
    if (!editingCubicle) return
    setIsSubmitting(true)
    setPanelError(null)
    try {
      await updateCubicleAdmin(editingCubicle.id, values)
      setEditingCubicle(null)
      loadCubicles()
    } catch (err) {
      setPanelError(err.message ?? 'No se pudo actualizar el cubículo.')
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
      loadCubicles()
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
          resultCount={cubicles.length}
          totalCount={totalElements}
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
            No se encontraron cubículos.
          </p>
        ) : (
          <>
            <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cubicles.map((cubicle) => (
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

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-uach-purple-900/10 pt-4">
                <span className="font-praxis text-sm text-uach-purple-900/70">
                  Página <strong>{page + 1}</strong> de <strong>{totalPages}</strong> ({totalElements} totales)
                </span>
                <div className="flex gap-2">
                  <button
                    className="font-praxis rounded-md border border-uach-purple-900/20 px-4 py-1.5 text-sm text-uach-purple-900 transition-colors hover:bg-uach-purple-900/5 disabled:opacity-50 disabled:hover:bg-transparent"
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </button>
                  <button
                    className="font-praxis rounded-md border border-uach-purple-900/20 px-4 py-1.5 text-sm text-uach-purple-900 transition-colors hover:bg-uach-purple-900/5 disabled:opacity-50 disabled:hover:bg-transparent"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}

