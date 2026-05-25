import { useEffect, useState } from 'react'
import { IconClose, IconFilters, IconMinus, IconPlus, IconSearch } from '@/components/icons'
import { CUBICLE_STATUSES } from '@/cubicles/admin/cubiclesAdminApi'

export const CUBICLE_CAPACITY_FILTER_MAX = 20

const searchInputClass =
  'font-praxis box-border w-full rounded-md border border-uach-purple-900/20 bg-white py-4 pr-3 pl-10 text-base leading-normal text-uach-purple-900 shadow-sm placeholder:text-uach-purple-900/45 transition focus:border-uach-gold-400 focus:outline-none focus:ring-2 focus:ring-uach-gold-400/25 sm:h-full'

const filterToggleClass =
  'relative flex w-14 shrink-0 items-center justify-center self-stretch rounded-md border border-uach-purple-900/20 bg-white text-uach-purple-900 shadow-sm transition hover:border-uach-purple-700/30 hover:bg-uach-purple-50'

export function CubiclesPanelToolbar({
  searchQuery,
  onSearchChange,
  statusFilters,
  onStatusFiltersChange,
  minCapacity,
  onMinCapacityChange,
  resultCount,
  totalCount,
  hasActiveFilters,
  onClearFilters,
  children,
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

  function toggleStatus(value) {
    onStatusFiltersChange(
      statusFilters.includes(value)
        ? statusFilters.filter((item) => item !== value)
        : [...statusFilters, value],
    )
  }

  return (
    <>
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
          <label className="relative flex min-w-0 w-full flex-1">
            <span className="sr-only">Buscar cubículos</span>
            <IconSearch
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-uach-purple-900/40"
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar por nombre, ID, capacidad o estatus…"
              className={searchInputClass}
              autoComplete="off"
            />
          </label>

          <button
            type="button"
            onClick={() => setIsFiltersOpen(true)}
            className={filterToggleClass}
            aria-label="Abrir filtros"
            aria-expanded={isFiltersOpen}
            aria-controls="cubicles-filters-sidebar"
          >
            <IconFilters className="size-5" aria-hidden />
            {hasActiveFilters ? (
              <span
                className="absolute top-2 right-2 size-2.5 rounded-full bg-uach-gold-500 ring-2 ring-white"
                aria-hidden
              />
            ) : null}
          </button>

          {children}
        </div>

        <p className="font-praxis text-sm text-uach-purple-900/65">
          {resultCount === totalCount
            ? `${totalCount} ${totalCount === 1 ? 'cubículo' : 'cubículos'}`
            : `${resultCount} de ${totalCount} cubículos`}
        </p>
      </div>

      <CubiclesFiltersSidebar
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        statusFilters={statusFilters}
        onToggleStatus={toggleStatus}
        minCapacity={minCapacity}
        onMinCapacityChange={onMinCapacityChange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
        resultCount={resultCount}
      />
    </>
  )
}

function CubiclesFiltersSidebar({
  isOpen,
  onClose,
  statusFilters,
  onToggleStatus,
  minCapacity,
  onMinCapacityChange,
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
        id="cubicles-filters-sidebar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cubicles-filters-title"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-uach-purple-900/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-uach-purple-50 text-uach-purple-900">
              <IconFilters className="size-5" aria-hidden />
            </span>
            <h2
              id="cubicles-filters-title"
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
            <IconClose className="size-5" aria-hidden />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="flex flex-col gap-8">
            <fieldset className="flex flex-col gap-3 border-0 p-0">
              <legend className="font-praxis text-xs font-semibold tracking-wide text-uach-purple-900/55 uppercase">
                Estatus
              </legend>
              <ul className="flex flex-col gap-2" role="list">
                {CUBICLE_STATUSES.map((item) => (
                  <li key={item.value}>
                    <FilterCheckbox
                      id={`cubicle-filter-status-${item.value}`}
                      checked={statusFilters.includes(item.value)}
                      onChange={() => onToggleStatus(item.value)}
                      label={item.label}
                    />
                  </li>
                ))}
              </ul>
            </fieldset>

            <div className="flex flex-col gap-3">
              <div>
                <p className="font-praxis text-xs font-semibold tracking-wide text-uach-purple-900/55 uppercase">
                  Capacidad de personas
                </p>
                <p className="font-praxis mt-1 text-sm text-uach-purple-900/60">
                  Mínimo de personas que debe admitir el cubículo (0 = sin filtro).
                </p>
              </div>
              <CapacityCounter
                value={minCapacity}
                onChange={onMinCapacityChange}
                min={0}
                max={CUBICLE_CAPACITY_FILTER_MAX}
              />
            </div>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={onClearFilters}
                className="font-praxis w-full rounded-lg border border-uach-purple-900/15 py-2.5 text-sm font-medium text-uach-purple-900 transition hover:bg-uach-purple-50"
              >
                Limpiar filtros
              </button>
            ) : null}
          </div>
        </div>

        <footer className="border-t border-uach-purple-900/10 p-5">
          <button type="button" onClick={onClose} className="button-primary w-full">
            Ver {resultCount} {resultCount === 1 ? 'cubículo' : 'cubículos'}
          </button>
        </footer>
      </aside>
    </>
  )
}

function FilterCheckbox({ id, checked, onChange, label }) {
  return (
    <label
      htmlFor={id}
      className="font-praxis flex cursor-pointer items-center gap-3 rounded-lg border border-uach-purple-900/10 px-3 py-2.5 text-sm text-uach-purple-900 transition hover:border-uach-purple-900/20 hover:bg-uach-purple-50/60"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 rounded border-uach-purple-900/25 text-uach-gold-500 focus:ring-uach-gold-400/40"
      />
      <span className="font-medium">{label}</span>
    </label>
  )
}

function CapacityCounter({ value, onChange, min, max }) {
  function decrement() {
    onChange(Math.max(min, value - 1))
  }

  function increment() {
    onChange(Math.min(max, value + 1))
  }

  const stepperButtonClass =
    'flex size-11 shrink-0 items-center justify-center rounded-lg border border-uach-purple-900/15 bg-white text-uach-purple-900 transition hover:border-uach-purple-700/30 hover:bg-uach-purple-50 disabled:pointer-events-none disabled:opacity-40'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full items-center justify-center gap-3">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className={stepperButtonClass}
          aria-label="Disminuir capacidad mínima"
        >
          <IconMinus className="size-5" aria-hidden />
        </button>
        <div
          className="font-alverata flex min-w-[4.5rem] flex-col items-center justify-center rounded-lg border border-uach-purple-900/15 bg-uach-purple-50/50 px-4 py-3 text-center"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="text-3xl font-semibold leading-none text-uach-purple-900">{value}</span>
          <span className="font-praxis mt-1 text-xs text-uach-purple-900/55">
            {value === 1 ? 'persona' : 'personas'}
          </span>
        </div>
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className={stepperButtonClass}
          aria-label="Aumentar capacidad mínima"
        >
          <IconPlus className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  )
}
