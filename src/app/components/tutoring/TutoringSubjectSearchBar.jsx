import { IconSearch } from '@/app/components/common/icons'

export function TutoringSubjectSearchBar({
  value,
  onChange,
  resultCount,
  totalCount,
  searchLabel = 'Buscar materia',
  searchPlaceholder = 'Buscar por nombre o descripción de la materia…',
  countLabel = 'materias',
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative min-w-0">
        <label htmlFor="tutoring-subject-search" className="sr-only">
          {searchLabel}
        </label>
        <span
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-uach-purple-900/45"
          aria-hidden="true"
        >
          <IconSearch className="size-5" aria-hidden />
        </span>
        <input
          id="tutoring-subject-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="font-praxis w-full rounded-lg border border-uach-purple-900/15 bg-white py-3 pr-4 pl-11 text-base text-uach-purple-900 shadow-sm placeholder:text-uach-purple-900/40 focus:border-uach-gold-500/60 focus:outline-none focus:ring-2 focus:ring-uach-gold-400/25"
          autoComplete="off"
        />
      </div>

      <p className="font-praxis text-sm text-uach-purple-900/65">
        {resultCount === totalCount
          ? `${totalCount} ${totalCount === 1 ? countLabel.replace(/s$/, '') : countLabel}`
          : `${resultCount} de ${totalCount} ${countLabel}`}
      </p>
    </div>
  )
}
