import { useEffect, useMemo, useState } from 'react'
import { EquipmentAdminCard } from '@/app/components/equipment/admin/EquipmentAdminCard'
import { EquipmentAdminForm } from '@/app/components/equipment/admin/EquipmentAdminForm'
import { EquipmentPanelToolbar } from '@/app/components/equipment/admin/EquipmentPanelToolbar'
import {
  createEquipmentAdmin,
  deleteEquipmentAdmin,
  fetchEquipmentAdmin,
  getEquipmentCategoryLabel,
  updateEquipmentAdmin,
} from '@/app/services/equipment/catalog.service'

export function EquipmentPanelPage() {
  const [equipment, setEquipment] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [panelError, setPanelError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilters, setCategoryFilters] = useState([])
  const [stockFilters, setStockFilters] = useState([])

  const filteredEquipment = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return equipment.filter((item) => {
      if (categoryFilters.length > 0 && !categoryFilters.includes(item.category)) return false
      if (stockFilters.includes('in_stock') && stockFilters.includes('out_of_stock')) {
        /* both selected = no stock filter */
      } else if (stockFilters.includes('in_stock') && item.availableStock <= 0) return false
      else if (stockFilters.includes('out_of_stock') && item.availableStock > 0) return false

      if (!query) return true
      const categoryLabel = getEquipmentCategoryLabel(item.category).toLowerCase()
      const stockLabel = item.availableStock <= 0 ? 'sin stock' : 'con stock'
      return (
        item.type.toLowerCase().includes(query) ||
        String(item.id).includes(query) ||
        String(item.availableStock).includes(query) ||
        item.category.toLowerCase().includes(query) ||
        categoryLabel.includes(query) ||
        stockLabel.includes(query)
      )
    })
  }, [equipment, searchQuery, categoryFilters, stockFilters])

  const hasActiveFilters = categoryFilters.length > 0 || stockFilters.length > 0

  function clearFilters() {
    setCategoryFilters([])
    setStockFilters([])
  }

  useEffect(() => {
    async function load() {
      setLoadError(null)
      try {
        const list = await fetchEquipmentAdmin()
        setEquipment(list)
      } catch (err) {
        setLoadError(err.message ?? 'No se pudo cargar el catálogo de equipo.')
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
      const created = await createEquipmentAdmin(values)
      setShowCreateForm(false)
      setEquipment((list) => [...list, created])
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
      const updated = await updateEquipmentAdmin(editingEquipment.id, values)
      setEquipment((list) => list.map((item) => (item.id === updated.id ? updated : item)))
      setEditingEquipment(null)
    } catch (err) {
      setPanelError(err.message ?? 'No se pudo crear el equipo.')
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
      setEquipment((list) => list.filter((entry) => entry.id !== item.id))
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
          categoryFilters={categoryFilters}
          onCategoryFiltersChange={setCategoryFilters}
          stockFilters={stockFilters}
          onStockFiltersChange={setStockFilters}
          resultCount={filteredEquipment.length}
          totalCount={equipment.length}
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
            No hay equipo registrado. Agrega el primero con el botón de arriba.
          </p>
        ) : filteredEquipment.length === 0 ? (
          <p className="font-praxis rounded-xl border border-dashed border-uach-purple-900/20 px-4 py-12 text-center text-sm text-uach-purple-900/60">
            No hay equipo que coincida con tu búsqueda o filtros.
          </p>
        ) : (
          <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEquipment.map((item) => (
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
        )}
      </section>
    </div>
  )
}
