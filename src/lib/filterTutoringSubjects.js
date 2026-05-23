import { MOCK_TUTORING_SUBJECTS } from '@/data/mockTutoringSubjects'

export function filterTutoringSubjects({
  searchQuery = '',
  items = MOCK_TUTORING_SUBJECTS,
}) {
  const query = searchQuery.trim().toLowerCase()
  if (!query) return items

  return items.filter((subject) => {
    const name = subject.name.toLowerCase()
    const description = subject.description.toLowerCase()
    return name.includes(query) || description.includes(query)
  })
}
