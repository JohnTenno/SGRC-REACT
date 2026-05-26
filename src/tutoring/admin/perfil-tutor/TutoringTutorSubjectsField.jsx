const checkboxClass =
  'size-4 shrink-0 rounded border-uach-purple-900/25 text-uach-gold-500 focus:ring-uach-gold-400/30'

export function formatTutoringSubjectNames(subjectIds, catalog) {
  if (!subjectIds?.length) return []
  const byId = new Map(catalog.map((item) => [item.id, item.name]))
  return subjectIds.map((id) => byId.get(id)).filter(Boolean)
}

export function getSelectedSubjectsFromCatalog(subjectIds, catalog) {
  if (!subjectIds?.length || !catalog?.length) return []
  const idSet = new Set(subjectIds)
  return catalog.filter((item) => idSet.has(item.id))
}

export function TutoringTutorSubjectsField({
  subjects,
  selectedIds,
  onToggle,
  disabled = false,
  idPrefix = 'tutor-subject',
}) {
  if (subjects.length === 0) {
    return (
      <section className="w-full rounded-xl border border-dashed border-uach-purple-900/20 bg-uach-purple-50/40 px-4 py-5 sm:px-5">
        <h3 className="font-alverata text-sm font-semibold text-uach-purple-900">Materias de asesoría</h3>
        <p className="font-praxis mt-2 text-sm text-uach-purple-900/60">
          No hay materias en el catálogo de materias. Pide al administrador que registre materias en{' '}
          <span className="font-semibold">Tutorías → Catálogo de materias</span>.
        </p>
      </section>
    )
  }

  return (
    <section className="w-full rounded-xl border border-uach-purple-900/15 bg-uach-purple-50/40 px-4 py-5 sm:px-5">
      <h3 className="font-alverata text-sm font-semibold text-uach-purple-900">Materias de asesoría</h3>
      <p className="font-praxis mt-1 text-xs text-uach-purple-900/55">
        Opciones del catálogo de materias. Marca en cuáles puedes dar tutorías.
      </p>
      <ul className="mt-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject) => {
          const inputId = `${idPrefix}-${subject.id}`
          const checked = selectedIds.includes(subject.id)
          return (
            <li key={subject.id} className="min-w-0">
              <label
                htmlFor={inputId}
                className={`font-praxis flex h-full cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 text-sm transition ${
                  checked
                    ? 'border-uach-gold-400/50 bg-white shadow-sm ring-2 ring-uach-gold-400/20'
                    : 'border-uach-purple-900/12 bg-white/80 hover:border-uach-purple-900/25 hover:bg-white'
                } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <input
                  id={inputId}
                  type="checkbox"
                  className={`${checkboxClass} mt-0.5`}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onToggle(subject.id)}
                />
                <span className="min-w-0 flex-1">
                  <span className="font-alverata font-semibold text-uach-purple-900">{subject.name}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-uach-purple-900/65">
                    {subject.description || 'Sin descripción en el catálogo.'}
                  </span>
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
