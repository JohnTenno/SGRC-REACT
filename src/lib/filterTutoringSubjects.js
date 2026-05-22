import { MOCK_TUTORING_SUBJECTS } from '@/data/mockTutoringSubjects'

/**
 * @param {object} options
 * @param {string} [options.searchQuery]
 * @param {typeof MOCK_TUTORING_SUBJECTS} [options.items]
 */
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
