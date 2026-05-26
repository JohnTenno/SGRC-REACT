import { useCallback, useEffect, useState } from 'react'
import { EquipmentAdminCard } from '@/app/components/equipment/admin/EquipmentAdminCard'
import { EquipmentAdminForm } from '@/app/components/equipment/admin/EquipmentAdminForm'
import { EquipmentPanelToolbar } from '@/app/components/equipment/admin/EquipmentPanelToolbar'
import {
  createEquipmentAdmin,
  deleteEquipmentAdmin,
  fetchEquipmentAdminPage,
  updateEquipmentAdmin,
} from '@/app/services/equipment/catalog.service'

function resolveStockFilter(stockFilters) {
  const hasIn = stockFilters.includes('in_stock')
  const hasOut = stockFilters.includes('out_of_stock')
  if (hasIn && !hasOut) return 'in_stock'
  if (hasOut && !hasIn) return 'out_of_stock'
  return 'all'
}

export function EquipmentPanelPage() {
  const [equipment, setEquipment] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [panelError, setPanelError] = useState(null)

  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [stockFilters, setStockFilters] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const hasActiveFilters = searchQuery.trim().length > 0 || stockFilters.length > 0

  const loadEquipment = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await fetchEquipmentAdminPage({
        search: debouncedSearch,
        stockFilter: resolveStockFilter(stockFilters),
        page,
      })
      setEquipment(data.content || [])
      setTotalPages(data.totalPages ?? 0)
      setTotalElements(data.totalElements ?? 0)
    } catch (err) {
      setLoadError(err.message ?? 'No se pudo cargar el catálogo de equipo.')
    } finally {
      setIsLoading(false)
    }
  }, [page, debouncedSearch, stockFilters])

  useEffect(() => {
    async function run() {
      await loadEquipment()
    }
    run()
  }, [loadEquipment])

  function clearFilters() {
    setSearchQuery('')
    setDebouncedSearch('')
    setStockFilters([])
    setPage(0)
  }

  async function handleCreate(values) {
    setIsSubmitting(true)
    setPanelError(null)
    try {
      await createEquipmentAdmin(values)
      setShowCreateForm(false)
      loadEquipment()
    } catch (err) {
      setPanelError(err.message ?? 'No se pudo crear el equipo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleEdit(values) {
    if (!editingEquipment) return
    setIsSubmitting(true)
    setPanelError(null)
    try {
      await updateEquipmentAdmin(editingEquipment.id, values)
      setEditingEquipment(null)
      loadEquipment()
    } catch (err) {
      setPanelError(err.message ?? 'No se pudo actualizar el equipo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `¿Eliminar "${item.type}"? Esta acción no se puede deshacer.`,
    )
    if (!confirmed) return

    setDeletingId(item.id)
    setPanelError(null)
    try {
      await deleteEquipmentAdmin(item.id)
      loadEquipment()
    } catch (err) {
      setPanelError(err.message ?? 'No se pudo eliminar el equipo.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="font-alverata text-2xl font-semibold text-uach-purple-900 sm:text-3xl">
            Renta de equipo
          </h1>
          <p className="font-praxis mt-2 max-w-2xl text-sm text-uach-purple-900/70 sm:text-base">
            Administra el catálogo que ven los estudiantes al solicitar equipo: alta, edición y stock.
          </p>
        </div>

        <EquipmentPanelToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          stockFilters={stockFilters}
          onStockFiltersChange={setStockFilters}
          resultCount={equipment.length}
          totalCount={totalElements}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        >
          <button
            type="button"
            className="button-primary shrink-0"
            onClick={() => {
              setShowCreateForm((open) => !open)
              setEditingEquipment(null)
            }}
          >
            {showCreateForm ? 'Cerrar formulario' : 'Agregar equipo'}
          </button>
        </EquipmentPanelToolbar>
      </header>

      {panelError ? (
        <p className="font-praxis rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {panelError}
        </p>
      ) : null}

      {showCreateForm ? (
        <section className="rounded-xl border border-uach-purple-900/15 bg-uach-purple-50/40 p-5 sm:p-6">
          <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">Nuevo equipo</h2>
          <div className="mt-4">
            <EquipmentAdminForm
              mode="create"
              onSubmit={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </section>
      ) : null}

      {editingEquipment ? (
        <section className="rounded-xl border border-uach-gold-400/40 bg-uach-gold-400/10 p-5 sm:p-6">
          <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">
            Editar equipo
          </h2>
          <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">{editingEquipment.type}</p>
          <div className="mt-4">
            <EquipmentAdminForm
              mode="edit"
              initial={editingEquipment}
              onSubmit={handleEdit}
              onCancel={() => setEditingEquipment(null)}
              isSubmitting={isSubmitting}
            />
          </div>
        </section>
      ) : null}

      <section aria-label="Listado de equipo">
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
        ) : equipment.length === 0 ? (
          <p className="font-praxis rounded-xl border border-dashed border-uach-purple-900/20 px-4 py-12 text-center text-sm text-uach-purple-900/60">
            No se encontró equipo.
          </p>
        ) : (
          <>
            <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {equipment.map((item) => (
                <li key={item.id} className="flex w-full">
                  <EquipmentAdminCard
                    equipment={item}
                    isEditing={editingEquipment?.id === item.id}
                    isDeleting={deletingId === item.id}
                    onEdit={() => {
                      setEditingEquipment(item)
                      setShowCreateForm(false)
                    }}
                    onDelete={() => handleDelete(item)}
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
