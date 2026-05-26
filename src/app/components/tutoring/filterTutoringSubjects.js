import { getTutoringSubjectsCatalog } from '@/app/services/tutoring/subjects.service'

export function filterTutoringSubjects({
  searchQuery = '',
  items = getTutoringSubjectsCatalog(),
}) {
  const query = searchQuery.trim().toLowerCase()
  if (!query) return items

  return items.filter((subject) => {
    const name = subject.name.toLowerCase()
    const description = subject.description.toLowerCase()
    return name.includes(query) || description.includes(query)
  })
}
