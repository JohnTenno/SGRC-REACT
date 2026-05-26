import { TUTORING_PROFESSORS_SEED } from '@/tutoring/home/tutoringConstants'

const STORAGE_KEY = 'sgrc-tutoring-professors-admin-catalog'

let catalog = cloneCatalog(TUTORING_PROFESSORS_SEED)

function cloneCatalog(items) {
  return items.map((item) => ({ ...item }))
}

function normalizeEmployeeNumber(value) {
  return String(value ?? '').trim()
}

function migrateLegacyProfessor(raw) {
  const employeeNumber = normalizeEmployeeNumber(raw.employeeNumber ?? raw.id)
  return {
    employeeNumber,
    fullName: typeof raw.fullName === 'string' ? raw.fullName.trim() : '',
    bio: typeof raw.bio === 'string' ? raw.bio.trim() : '',
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return
    catalog = parsed.map(migrateLegacyProfessor).filter((item) => item.employeeNumber)
  } catch {
    catalog = cloneCatalog(TUTORING_PROFESSORS_SEED)
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog))
  } catch {
    /* ignore quota errors in dev */
  }
}

function normalizeProfessor(raw) {
  return migrateLegacyProfessor(raw)
}

function assertUniqueEmployeeNumber(employeeNumber, excludeEmployeeNumber) {
  const exists = catalog.some(
    (item) =>
      item.employeeNumber === employeeNumber && item.employeeNumber !== excludeEmployeeNumber,
  )
  if (exists) throw { message: 'Ya existe un docente con ese número de empleado.' }
}

export function getTutoringProfessorsCatalog() {
  loadFromStorage()
  return cloneCatalog(catalog)
}

export function getTutoringProfessorCatalogByEmployeeNumber(employeeNumber) {
  const normalized = normalizeEmployeeNumber(employeeNumber)
  if (!normalized) return null
  return getTutoringProfessorsCatalog().find((item) => item.employeeNumber === normalized) ?? null
}

function delay(ms = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function fetchTutoringProfessorsAdmin() {
  await delay()
  return getTutoringProfessorsCatalog()
}

export async function createTutoringProfessorAdmin({ employeeNumber, fullName, bio }) {
  await delay()
  const normalizedNumber = normalizeEmployeeNumber(employeeNumber)
  if (!normalizedNumber) throw { message: 'El número de empleado es obligatorio.' }
  assertUniqueEmployeeNumber(normalizedNumber)

  const item = normalizeProfessor({
    employeeNumber: normalizedNumber,
    fullName,
    bio,
  })
  if (!item.fullName) throw { message: 'El nombre del docente es obligatorio.' }
  catalog = [...catalog, item]
  persist()
  return item
}

export async function updateTutoringProfessorAdmin(employeeNumber, patch) {
  await delay()
  const currentNumber = normalizeEmployeeNumber(employeeNumber)
  const index = catalog.findIndex((item) => item.employeeNumber === currentNumber)
  if (index < 0) throw { message: 'Docente no encontrado.' }

  const updated = normalizeProfessor({
    ...catalog[index],
    ...patch,
    employeeNumber: catalog[index].employeeNumber,
  })
  if (!updated.fullName) throw { message: 'El nombre del docente es obligatorio.' }
  catalog = catalog.map((item) => (item.employeeNumber === currentNumber ? updated : item))
  persist()
  return updated
}

export async function deleteTutoringProfessorAdmin(employeeNumber) {
  await delay()
  const normalized = normalizeEmployeeNumber(employeeNumber)
  catalog = catalog.filter((item) => item.employeeNumber !== normalized)
  persist()
}

loadFromStorage()
