import {
  createTutoringProfessorAdmin,
  getTutoringProfessorCatalogByEmployeeNumber,
} from '@/tutoring/admin/docentes/tutoringProfessorsAdminApi'
import { TUTORING_STUDENTS_SEED } from '@/tutoring/admin/promover-tutores/tutoringStudentsConstants'
import { setTutorProfileEmployeeNumber } from '@/tutoring/admin/perfil-tutor/tutoringTutorProfileSession'
import {
  EMPTY_TUTORING_PROFESSOR_OFFERING,
  updateTutoringProfessorOffering,
} from '@/tutoring/home/tutoringProfessorOfferings'

const STORAGE_KEY = 'sgrc-tutoring-students-admin'

let students = cloneStudents(TUTORING_STUDENTS_SEED)

function cloneStudents(items) {
  return items.map((item) => normalizeStudent(item))
}

function normalizeEnrollment(value) {
  return String(value ?? '').trim().toUpperCase()
}

function normalizeStudent(raw) {
  const enrollment = normalizeEnrollment(raw.enrollment)
  return {
    enrollment,
    fullName: String(raw.fullName ?? '').trim(),
    curp: String(raw.curp ?? '').trim().toUpperCase(),
    career: String(raw.career ?? '').trim(),
    isTutor: Boolean(raw.isTutor),
    promotedAt: raw.promotedAt ?? null,
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return
    students = parsed.map(normalizeStudent).filter((item) => item.enrollment)
  } catch {
    students = cloneStudents(TUTORING_STUDENTS_SEED)
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
  } catch {}
}

function syncTutorFlagsFromCatalog() {
  students = students.map((student) => {
    const inCatalog = Boolean(getTutoringProfessorCatalogByEmployeeNumber(student.enrollment))
    if (inCatalog && !student.isTutor) {
      return { ...student, isTutor: true, promotedAt: student.promotedAt ?? new Date().toISOString() }
    }
    return student
  })
}

export function getTutoringStudentsAdmin() {
  loadFromStorage()
  syncTutorFlagsFromCatalog()
  return students.map((item) => ({ ...item }))
}

export function getTutoringStudentByEnrollment(enrollment) {
  const normalized = normalizeEnrollment(enrollment)
  if (!normalized) return null
  return getTutoringStudentsAdmin().find((item) => item.enrollment === normalized) ?? null
}

function delay(ms = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function fetchTutoringStudentsAdmin() {
  await delay()
  return getTutoringStudentsAdmin()
}

export async function promoteStudentToTutorAdmin(enrollment) {
  await delay()
  loadFromStorage()
  const normalized = normalizeEnrollment(enrollment)
  const index = students.findIndex((item) => item.enrollment === normalized)
  if (index < 0) throw { message: 'Alumno no encontrado.' }

  const student = students[index]
  if (student.isTutor) {
    throw { message: 'Este alumno ya está registrado como tutor.' }
  }

  const existingCatalog = getTutoringProfessorCatalogByEmployeeNumber(normalized)
  if (existingCatalog) {
    students = students.map((item, i) =>
      i === index
        ? { ...item, isTutor: true, promotedAt: item.promotedAt ?? new Date().toISOString() }
        : item,
    )
    persist()
    setTutorProfileEmployeeNumber(normalized)
    return { ...students[index] }
  }

  const defaultBio = `Tutor estudiante · ${student.career}`

  await createTutoringProfessorAdmin({
    employeeNumber: normalized,
    fullName: student.fullName,
    bio: defaultBio,
  })

  updateTutoringProfessorOffering(normalized, {
    scheduleSummary: EMPTY_TUTORING_PROFESSOR_OFFERING.scheduleSummary,
    tutoringLocation: EMPTY_TUTORING_PROFESSOR_OFFERING.tutoringLocation,
  })

  const promotedAt = new Date().toISOString()
  students = students.map((item, i) =>
    i === index ? { ...item, isTutor: true, promotedAt } : item,
  )
  persist()
  setTutorProfileEmployeeNumber(normalized)

  return { ...students[index] }
}

loadFromStorage()
