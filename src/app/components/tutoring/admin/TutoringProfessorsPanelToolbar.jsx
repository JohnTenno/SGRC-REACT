import { IconSearch } from '@/app/components/common/icons'

const searchInputClass =
  'font-praxis box-border w-full rounded-md border border-uach-purple-900/20 bg-white py-4 pr-3 pl-10 text-base leading-normal text-uach-purple-900 shadow-sm placeholder:text-uach-purple-900/45 transition focus:border-uach-gold-400 focus:outline-none focus:ring-2 focus:ring-uach-gold-400/25 sm:h-full'

export function TutoringProfessorsPanelToolbar({
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
  children,
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
        <label className="relative flex min-w-0 w-full flex-1">
          <span className="sr-only">Buscar docentes</span>
          <IconSearch
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-uach-purple-900/40"
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar por nombre, no. de empleado o perfil…"
            className={searchInputClass}
            autoComplete="off"
          />
        </label>
        {children}
      </div>

      <p className="font-praxis text-sm text-uach-purple-900/65">
        {resultCount === totalCount
          ? `${totalCount} ${totalCount === 1 ? 'docente' : 'docentes'}`
          : `${resultCount} de ${totalCount} docentes`}
      </p>
    </div>
  )
}
