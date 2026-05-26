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
