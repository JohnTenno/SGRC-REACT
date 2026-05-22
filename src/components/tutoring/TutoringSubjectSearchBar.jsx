/**
 * @param {object} props
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {number} props.resultCount
 * @param {number} props.totalCount
 */
export function TutoringSubjectSearchBar({ value, onChange, resultCount, totalCount }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative min-w-0">
        <label htmlFor="tutoring-subject-search" className="sr-only">
          Buscar materia
        </label>
        <span
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-uach-purple-900/45"
          aria-hidden="true"
        >
          <SearchIcon />
        </span>
        <input
          id="tutoring-subject-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar por nombre o descripción de la materia…"
          className="font-praxis w-full rounded-lg border border-uach-purple-900/15 bg-white py-3 pr-4 pl-11 text-base text-uach-purple-900 shadow-sm placeholder:text-uach-purple-900/40 focus:border-uach-gold-500/60 focus:outline-none focus:ring-2 focus:ring-uach-gold-400/25"
          autoComplete="off"
        />
      </div>

      <p className="font-praxis text-sm text-uach-purple-900/65">
        {resultCount === totalCount
          ? `${totalCount} ${totalCount === 1 ? 'materia' : 'materias'}`
          : `${resultCount} de ${totalCount} materias`}
      </p>
    </div>
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
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  )
}
