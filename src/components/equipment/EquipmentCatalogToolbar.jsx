import { useEffect, useState } from 'react'
import { EQUIPMENT_CATEGORY_LABELS } from '@/data/mockEquioment'

/** @typedef {'all' | 'in_stock' | 'out_of_stock'} StockFilter */
/** @typedef {'all' | keyof typeof EQUIPMENT_CATEGORY_LABELS} CategoryFilter */

const STOCK_OPTIONS = [
  { value: 'all', label: 'Todo el stock' },
  { value: 'in_stock', label: 'Con disponibilidad' },
  { value: 'out_of_stock', label: 'Sin stock' },
]

/**
 * @param {object} props
 * @param {string} props.searchQuery
 * @param {(value: string) => void} props.onSearchChange
 * @param {StockFilter} props.stockFilter
 * @param {(value: StockFilter) => void} props.onStockFilterChange
 * @param {CategoryFilter} props.categoryFilter
 * @param {(value: CategoryFilter) => void} props.onCategoryFilterChange
 * @param {number} props.resultCount
 * @param {number} props.totalCount
 * @param {() => void} [props.onClearFilters]
 * @param {boolean} props.hasActiveFilters
 */
export function EquipmentCatalogToolbar({
  searchQuery,
  onSearchChange,
  stockFilter,
  onStockFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  resultCount,
  totalCount,
  onClearFilters,
  hasActiveFilters,
}) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  useEffect(() => {
    if (!isFiltersOpen) return undefined

    function handleEscape(event) {
      if (event.key === 'Escape') setIsFiltersOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isFiltersOpen])

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="relative min-w-0 flex-1">
            <label htmlFor="equipment-search" className="sr-only">
              Buscar equipo
            </label>
            <span
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-uach-purple-900/45"
              aria-hidden="true"
            >
              <SearchIcon />
            </span>
            <input
              id="equipment-search"
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar por nombre de equipo…"
              className="font-praxis w-full rounded-lg border border-uach-purple-900/15 bg-white py-3 pr-4 pl-11 text-base text-uach-purple-900 shadow-sm placeholder:text-uach-purple-900/40 focus:border-uach-gold-500/60 focus:outline-none focus:ring-2 focus:ring-uach-gold-400/25"
              autoComplete="off"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsFiltersOpen(true)}
            className="relative flex size-12 shrink-0 items-center justify-center rounded-lg border border-uach-purple-900/15 bg-white text-uach-purple-900 shadow-sm transition hover:border-uach-purple-700/30 hover:bg-uach-purple-50"
            aria-label="Abrir filtros"
            aria-expanded={isFiltersOpen}
            aria-controls="equipment-filters-sidebar"
          >
            <FiltersIcon />
            {hasActiveFilters ? (
              <span
                className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-uach-gold-500 ring-2 ring-white"
                aria-hidden="true"
              />
            ) : null}
          </button>
        </div>

        <p className="font-praxis text-sm text-uach-purple-900/65">
          {resultCount === totalCount
            ? `${totalCount} equipos`
            : `${resultCount} de ${totalCount} equipos`}
        </p>
      </div>

      <EquipmentFiltersSidebar
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        stockFilter={stockFilter}
        onStockFilterChange={onStockFilterChange}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={onCategoryFilterChange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        resultCount={resultCount}
      />
    </>
  )
}

/**
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {StockFilter} props.stockFilter
 * @param {(value: StockFilter) => void} props.onStockFilterChange
 * @param {CategoryFilter} props.categoryFilter
 * @param {(value: CategoryFilter) => void} props.onCategoryFilterChange
 * @param {boolean} props.hasActiveFilters
 * @param {() => void} [props.onClearFilters]
 * @param {number} props.resultCount
 */
function EquipmentFiltersSidebar({
  isOpen,
  onClose,
  stockFilter,
  onStockFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  hasActiveFilters,
  onClearFilters,
  resultCount,
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-uach-purple-950/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!isOpen}
        onClick={onClose}
      />

      <aside
        id="equipment-filters-sidebar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="equipment-filters-title"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-uach-purple-900/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-uach-purple-50 text-uach-purple-900">
              <FiltersIcon />
            </span>
            <h2
              id="equipment-filters-title"
              className="font-alverata text-lg font-semibold text-uach-purple-900"
            >
              Filtros
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-lg text-uach-purple-900/70 transition hover:bg-uach-purple-50 hover:text-uach-purple-900"
            aria-label="Cerrar filtros"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-praxis text-xs font-semibold tracking-wide text-uach-purple-900/55 uppercase">
                Categoría
              </span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
                <FilterChip
                  active={categoryFilter === 'all'}
                  onClick={() => onCategoryFilterChange('all')}
                >
                  Todas
                </FilterChip>
                {Object.entries(EQUIPMENT_CATEGORY_LABELS).map(([value, label]) => (
                  <FilterChip
                    key={value}
                    active={categoryFilter === value}
                    onClick={() => onCategoryFilterChange(value)}
                  >
                    {label}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="equipment-stock-filter-sidebar"
                className="font-praxis text-xs font-semibold tracking-wide text-uach-purple-900/55 uppercase"
              >
                Disponibilidad
              </label>
              <select
                id="equipment-stock-filter-sidebar"
                value={stockFilter}
                onChange={(event) => onStockFilterChange(event.target.value)}
                className="font-praxis w-full rounded-lg border border-uach-purple-900/15 bg-white px-3 py-3 text-sm text-uach-purple-900 shadow-sm focus:border-uach-gold-500/60 focus:outline-none focus:ring-2 focus:ring-uach-gold-400/25"
              >
                {STOCK_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && onClearFilters ? (
              <button
                type="button"
                onClick={() => {
                  onClearFilters()
                }}
                className="font-praxis w-full rounded-lg border border-uach-purple-900/15 py-2.5 text-sm font-medium text-uach-purple-900 transition hover:bg-uach-purple-50"
              >
                Limpiar filtros
              </button>
            ) : null}
          </div>
        </div>

        <footer className="border-t border-uach-purple-900/10 p-5">
          <button
            type="button"
            onClick={onClose}
            className="button-primary w-full"
          >
            Ver {resultCount} {resultCount === 1 ? 'equipo' : 'equipos'}
          </button>
        </footer>
      </aside>
    </>
  )
}

function SearchIcon() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  )
}

function FiltersIcon() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 5h16" />
      <path d="M7 12h10" />
      <path d="M10 19h4" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

/**
 * @param {object} props
 * @param {boolean} props.active
 * @param {() => void} props.onClick
 * @param {import('react').ReactNode} props.children
 */
function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`font-praxis rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
        active
          ? 'border-uach-gold-500 bg-uach-gold-500 text-uach-purple-950'
          : 'border-uach-purple-900/15 bg-white text-uach-purple-900 hover:border-uach-purple-700/30'
      }`}
    >
      {children}
    </button>
  )
}
