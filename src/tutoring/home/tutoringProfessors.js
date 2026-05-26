import {
  getTutoringProfessorCatalogByEmployeeNumber,
  getTutoringProfessorsCatalog,
} from '@/tutoring/admin/docentes/tutoringProfessorsAdminApi'
import {
  EMPTY_TUTORING_PROFESSOR_OFFERING,
  getTutoringProfessorOffering,
} from '@/tutoring/home/tutoringProfessorOfferings'

export function buildTutoringProfessor(catalogEntry) {
  const offering = getTutoringProfessorOffering(catalogEntry.employeeNumber)
  return {
    employeeNumber: catalogEntry.employeeNumber,
    fullName: catalogEntry.fullName,
    bio: catalogEntry.bio,
    scheduleSummary: offering.scheduleSummary ?? EMPTY_TUTORING_PROFESSOR_OFFERING.scheduleSummary,
    tutoringLocation: offering.tutoringLocation ?? EMPTY_TUTORING_PROFESSOR_OFFERING.tutoringLocation,
    availableWeekdays:
      offering.availableWeekdays ?? EMPTY_TUTORING_PROFESSOR_OFFERING.availableWeekdays,
    tutoringHourSlots:
      offering.tutoringHourSlots ?? EMPTY_TUTORING_PROFESSOR_OFFERING.tutoringHourSlots,
    subjectIds: offering.subjectIds ?? EMPTY_TUTORING_PROFESSOR_OFFERING.subjectIds,
  }
}

export function getTutoringProfessorsForDisplay() {
  return getTutoringProfessorsCatalog().map(buildTutoringProfessor)
}

export function getTutoringProfessorByEmployeeNumber(employeeNumber) {
  const normalized = String(employeeNumber ?? '').trim()
  if (!normalized) return null
  const catalogEntry = getTutoringProfessorCatalogByEmployeeNumber(normalized)
  if (!catalogEntry) return null
  return buildTutoringProfessor(catalogEntry)
}

/** @deprecated Usa getTutoringProfessorByEmployeeNumber */
export function getTutoringProfessorById(employeeNumber) {
  return getTutoringProfessorByEmployeeNumber(employeeNumber)
}

export function professorTeachesSubject(employeeNumber, subjectId) {
  const professor = getTutoringProfessorByEmployeeNumber(employeeNumber)
  return professor?.subjectIds.includes(subjectId) ?? false
}
