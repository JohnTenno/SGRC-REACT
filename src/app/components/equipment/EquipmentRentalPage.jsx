import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EquipmentCatalogToolbar } from '@/app/components/equipment/EquipmentCatalogToolbar'
import { EquipmentSelectionSummary } from '@/app/components/equipment/EquipmentSelectionSummary'
import { EquipmentCard } from '@/app/components/equipment/EquipmentCard'
import { FailAnimation } from '@/app/components/common/animations/FailAnimation'
import { SuccessAnimation } from '@/app/components/common/animations/SuccessAnimation'
import { HeroHeader } from '@/app/components/layout/HeroHeader'
import { Navbar } from '@/app/components/layout/Navbar'
import { fetchEquipmentAdminPage } from '@/app/services/equipment/catalog.service'
import { createEquipmentRentalRequest } from '@/app/services/equipment/rental.service'
import { hasActiveEquipmentFilters } from '@/app/components/equipment/filterEquipmentCatalog'

function clampQuantityForItem(item, quantity) {
  if (!item || item.availableStock <= 0) return 0
  return Math.max(1, Math.min(quantity, item.availableStock))
}

export function EquipmentRentalPage() {
  const navigate = useNavigate()

  const [catalogEquipment, setCatalogEquipment] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [stockFilter, setStockFilter] = useState('all')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const [selectionById, setSelectionById] = useState({})
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [failMessage, setFailMessage] = useState(null)
  const [pendingOrder, setPendingOrder] = useState(null)

  const loadCatalog = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const data = await fetchEquipmentAdminPage({ search: debouncedSearch, stockFilter, page })
      setCatalogEquipment(data.content || [])
      setTotalPages(data.totalPages ?? 0)
      setTotalElements(data.totalElements ?? 0)
    } catch (err) {
      setLoadError(err.message ?? 'No se pudo cargar el catálogo de equipo.')
    } finally {
      setIsLoading(false)
    }
  }, [page, debouncedSearch, stockFilter])

  useEffect(() => {
    async function run() {
      await loadCatalog()
    }
    run()
  }, [loadCatalog])

  function clearFilters() {
    setSearchQuery('')
    setDebouncedSearch('')
    setStockFilter('all')
    setPage(0)
  }

  const hasActiveFilters = hasActiveEquipmentFilters({ searchQuery, stockFilter })

  const selectedEquipment = useMemo(
    () => Object.values(selectionById).map((s) => ({ ...s.item, quantity: s.quantity })),
    [selectionById],
  )

  const hasSelection = selectedEquipment.length > 0

  function toggleSelection(item) {
    if (!item || item.availableStock <= 0) return
    setSelectionById((current) => {
      if (current[item.id]) {
        const next = { ...current }
        delete next[item.id]
        return next
      }
      return { ...current, [item.id]: { item, quantity: 1 } }
    })
    setFieldErrors({})
  }

  function removeFromSelection(id) {
    setSelectionById((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
    setFieldErrors({})
  }

  function updateQuantity(id, nextQuantity) {
    setSelectionById((current) => {
      const entry = current[id]
      if (!entry) return current
      if (nextQuantity < 1) {
        const next = { ...current }
        delete next[id]
        return next
      }
      const quantity = clampQuantityForItem(entry.item, nextQuantity)
      return { ...current, [id]: { ...entry, quantity } }
    })
    setFieldErrors({})
  }

  async function handleSubmitRequest() {
    if (selectedEquipment.length === 0) {
      setFieldErrors({ equipment: 'Selecciona al menos un equipo para solicitar.' })
      return
    }

    const selections = selectedEquipment.map((item) => ({
      equipmentId: item.id,
      quantity: item.quantity,
    }))

    setFieldErrors({})
    setFailMessage(null)
    setIsSubmitting(true)

    try {
      const order = await createEquipmentRentalRequest(selections)
      setPendingOrder(order)
      setShowSuccess(true)
    } catch (error) {
      setFailMessage(error?.message ?? 'No se pudo enviar la solicitud. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleSuccessComplete() {
    setShowSuccess(false)
    setSelectionById({})
    navigate(`/equipment-rental/order/${pendingOrder.id}`, { state: { order: pendingOrder } })
    setPendingOrder(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {showSuccess && pendingOrder ? (
        <SuccessAnimation
          title="¡Solicitud enviada!"
          message={`Tu solicitud quedó registrada con folio ${pendingOrder.id} (pendiente de recoger). En un momento verás el detalle y dónde pasar por tu equipo.`}
          actionLabel="Ver mi solicitud"
          onAction={handleSuccessComplete}
        />
      ) : null}

      {failMessage ? (
        <FailAnimation
          title="No se pudo solicitar"
          message={failMessage}
          onClose={() => setFailMessage(null)}
        />
      ) : null}

      <main className="flex flex-1 flex-col gap-8 bg-white">
        <div className="equipment-rental-hero">
          <HeroHeader
            title="Renta de equipo universitario"
            description="Arma tu solicitud con los artículos y cantidades que necesitas. Al enviarla generaremos tu orden de recogida."
          />
        </div>

        <div
          className={`page-shell flex flex-1 flex-col ${hasSelection ? 'pb-36 sm:pb-32' : 'pb-8'}`}
        >
          <nav className="font-praxis mb-6 text-sm text-uach-purple-900/60" aria-label="Ruta">
            <Link to="/home" className="transition hover:text-uach-purple-900">
              Inicio
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-uach-purple-900">Renta de equipo</span>
          </nav>

          <section className="flex flex-1 flex-col gap-8">
            <div>
              <h2 className="font-alverata text-xl font-semibold text-uach-purple-900">
                Arma tu solicitud
              </h2>
              <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">
                Una sola solicitud puede incluir varios tipos de equipo y cantidades. Revisa
                el resumen y pulsa Solicitar.
              </p>

              {fieldErrors.equipment ? (
                <p className="font-praxis mt-3 text-sm text-red-600">{fieldErrors.equipment}</p>
              ) : null}

              <div className="mt-6">
                <EquipmentCatalogToolbar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  stockFilter={stockFilter}
                  onStockFilterChange={setStockFilter}
                  resultCount={catalogEquipment.length}
                  totalCount={totalElements}
                  hasActiveFilters={hasActiveFilters}
                  onClearFilters={clearFilters}
                />
              </div>

              {isLoading ? (
                <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((n) => (
                    <li key={n} className="h-56 w-full animate-pulse rounded-lg bg-uach-purple-900/8" />
                  ))}
                </ul>
              ) : loadError ? (
                <p className="font-praxis mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-600">
                  {loadError}
                </p>
              ) : catalogEquipment.length === 0 ? (
                <div className="font-praxis mt-8 rounded-xl border border-dashed border-uach-purple-900/20 bg-uach-purple-50/30 px-6 py-10 text-center text-sm text-uach-purple-900/70">
                  <p className="font-medium text-uach-purple-900">
                    No hay equipos con esos criterios
                  </p>
                  <p className="mt-2">
                    Prueba otro término de búsqueda o cambia los filtros.
                  </p>
                </div>
              ) : (
                <>
                  <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {catalogEquipment.map((item) => (
                      <li key={item.id} className="flex">
                        <EquipmentCard
                          type={item.type}
                          availableStock={item.availableStock}
                          image={item.image}
                          imageAlt={item.imageAlt}
                          selected={Boolean(selectionById[item.id])}
                          onSelect={() => toggleSelection(item)}
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
            </div>

            <Link
              to="/home"
              className="font-praxis inline-block text-sm text-uach-purple-900/70 transition hover:text-uach-purple-900"
            >
              Volver al inicio
            </Link>
          </section>
        </div>

        {hasSelection ? (
          <div
            className="fixed inset-x-0 bottom-0 z-40 animate-slide-up-action-bar border-t border-uach-purple-900/10 bg-white/95 shadow-[0_-12px_40px_rgba(30,15,58,0.12)] backdrop-blur-md"
            role="region"
            aria-label="Enviar solicitud"
          >
            <div className="page-shell flex flex-col gap-4 py-4 sm:flex-row sm:items-end sm:justify-between">
              <EquipmentSelectionSummary
                items={selectedEquipment}
                onRemove={removeFromSelection}
                onQuantityChange={updateQuantity}
              />
              <button
                type="button"
                onClick={handleSubmitRequest}
                disabled={isSubmitting}
                className="button-primary w-full shrink-0 sm:w-auto sm:min-w-[14rem]"
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent"
                      aria-hidden="true"
                    />
                    Solicitando...
                  </>
                ) : (
                  'Solicitar'
                )}
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
