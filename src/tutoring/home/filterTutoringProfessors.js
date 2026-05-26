import { getTutoringProfessorsForDisplay } from '@/tutoring/home/tutoringProfessors'

export function getTutoringProfessorsBySubjectId({
  subjectId,
  items = getTutoringProfessorsForDisplay(),
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
