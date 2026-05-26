import { IconSearch } from '@/components/icons'

export function TutoringPromoteTutorsToolbar({
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="relative min-w-0 flex-1 sm:max-w-md">
        <span className="sr-only">Buscar alumno</span>
        <IconSearch
          className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-uach-purple-900/40"
          aria-hidden
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nombre, matrícula, CURP o carrera…"
          className="font-praxis w-full rounded-lg border border-uach-purple-900/20 py-2.5 pr-3 pl-10 text-sm text-uach-purple-900 focus:border-uach-gold-400 focus:outline-none focus:ring-2 focus:ring-uach-gold-400/25"
        />
      </label>
      <p className="font-praxis shrink-0 text-sm text-uach-purple-900/60">
        {resultCount === totalCount
          ? `${totalCount} alumno${totalCount === 1 ? '' : 's'}`
          : `${resultCount} de ${totalCount}`}
      </p>
    </div>
  )
}
