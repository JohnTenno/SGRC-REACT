import { normalizeAvailableWeekdays } from '@/tutoring/admin/perfil-tutor/tutoringWeekdaysUtils'
import { updateTutoringProfessorOffering } from '@/tutoring/home/tutoringProfessorOfferings'

function delay(ms = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function normalizeSubjectIds(value) {
  if (!Array.isArray(value)) return []
  return [...new Set(value.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0))]
}

export async function updateTutoringProfessorOfferingAdmin(employeeNumber, patch) {
  await delay()
  const scheduleSummary = String(patch?.scheduleSummary ?? '').trim()
  const tutoringLocation = String(patch?.tutoringLocation ?? '').trim()
  const subjectIds = normalizeSubjectIds(patch?.subjectIds)
  const availableWeekdays = normalizeAvailableWeekdays(patch?.availableWeekdays)

  if (availableWeekdays.length === 0) {
    throw { message: 'Selecciona al menos un día de la semana.' }
  }
  if (!scheduleSummary) {
    throw { message: 'El horario de tutorías es obligatorio.' }
  }
  if (!tutoringLocation) {
    throw { message: 'El lugar de las tutorías es obligatorio.' }
  }
  if (subjectIds.length === 0) {
    throw { message: 'Selecciona al menos una materia de asesoría.' }
  }

  return updateTutoringProfessorOffering(employeeNumber, {
    scheduleSummary,
    tutoringLocation,
    subjectIds,
    availableWeekdays,
  })
}
