import { MOCK_TUTORING_PROFESSORS } from '@/data/mockTutoringProfessors'

export function getTutoringProfessorsBySubjectId({
  subjectId,
  items = MOCK_TUTORING_PROFESSORS,
}) {
  return items.filter((professor) => professor.subjectIds.includes(subjectId))
}

export function filterTutoringProfessors({
  searchQuery = '',
  items,
}) {
  const query = searchQuery.trim().toLowerCase()
  if (!query) return items

  return items.filter((professor) => {
    const name = professor.fullName.toLowerCase()
    const bio = professor.bio.toLowerCase()
    const location = professor.tutoringLocation.toLowerCase()
    return name.includes(query) || bio.includes(query) || location.includes(query)
  })
}
