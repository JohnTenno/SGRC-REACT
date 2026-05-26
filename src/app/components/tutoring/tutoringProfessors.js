import {
  getTutoringProfessorCatalogByEmployeeNumber,
  getTutoringProfessorsCatalog,
} from '@/app/services/tutoring/professors.service'
import {
  EMPTY_TUTORING_PROFESSOR_OFFERING,
  getTutoringProfessorOffering,
} from '@/app/services/tutoring/offerings.service'

export async function buildTutoringProfessor(catalogEntry) {
  const offering = await getTutoringProfessorOffering(catalogEntry.employeeNumber)
  return {
    employeeNumber: catalogEntry.employeeNumber,
    fullName: catalogEntry.fullName,
    bio: catalogEntry.bio,
    scheduleSummary: offering.scheduleSummary ?? EMPTY_TUTORING_PROFESSOR_OFFERING.scheduleSummary,
    tutoringLocation: offering.tutoringLocation ?? EMPTY_TUTORING_PROFESSOR_OFFERING.tutoringLocation,
    availableWeekdays: offering.availableWeekdays ?? EMPTY_TUTORING_PROFESSOR_OFFERING.availableWeekdays,
    tutoringHourSlots: offering.tutoringHourSlots ?? EMPTY_TUTORING_PROFESSOR_OFFERING.tutoringHourSlots,
    subjectIds: offering.subjectIds ?? EMPTY_TUTORING_PROFESSOR_OFFERING.subjectIds,
  }
}

export async function getTutoringProfessorsForDisplay() {
  const catalog = await getTutoringProfessorsCatalog()
  return Promise.all(catalog.map(buildTutoringProfessor))
}

export async function getTutoringProfessorByEmployeeNumber(employeeNumber) {
  const normalized = String(employeeNumber ?? '').trim()
  if (!normalized) return null
  const catalogEntry = await getTutoringProfessorCatalogByEmployeeNumber(normalized)
  if (!catalogEntry) return null
  return buildTutoringProfessor(catalogEntry)
}

export async function professorTeachesSubject(employeeNumber, subjectId) {
  const professor = await getTutoringProfessorByEmployeeNumber(employeeNumber)
  return professor?.subjectIds.includes(subjectId) ?? false
}
