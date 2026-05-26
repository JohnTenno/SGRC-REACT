import { TUTORING_SUBJECTS_SEED } from '@/tutoring/home/tutoringConstants'

const STORAGE_KEY = 'sgrc-tutoring-subjects-admin-catalog'

let catalog = cloneCatalog(TUTORING_SUBJECTS_SEED)
let nextId = Math.max(0, ...catalog.map((item) => item.id)) + 1

function cloneCatalog(items) {
  return items.map((item) => ({ ...item }))
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return
    catalog = cloneCatalog(parsed)
    nextId = Math.max(0, ...catalog.map((item) => item.id)) + 1
  } catch {
    catalog = cloneCatalog(TUTORING_SUBJECTS_SEED)
    nextId = Math.max(0, ...catalog.map((item) => item.id)) + 1
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog))
  } catch {
    /* ignore quota errors in dev */
  }
}

function normalizeSubject(raw) {
  return {
    id: raw.id,
    name: typeof raw.name === 'string' ? raw.name.trim() : '',
    description: typeof raw.description === 'string' ? raw.description.trim() : '',
  }
}

export function getTutoringSubjectsCatalog() {
  loadFromStorage()
  return cloneCatalog(catalog)
}

export function getTutoringSubjectById(id) {
  const numericId = Number(id)
  if (!Number.isInteger(numericId) || numericId < 1) return null
  return getTutoringSubjectsCatalog().find((item) => item.id === numericId) ?? null
}

function delay(ms = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function fetchTutoringSubjectsAdmin() {
  await delay()
  return getTutoringSubjectsCatalog()
}

export async function createTutoringSubjectAdmin({ name, description }) {
  await delay()
  const item = normalizeSubject({
    id: nextId++,
    name,
    description,
  })
  if (!item.name) throw { message: 'El nombre de la materia es obligatorio.' }
  catalog = [...catalog, item]
  persist()
  return item
}

export async function updateTutoringSubjectAdmin(id, patch) {
  await delay()
  const index = catalog.findIndex((item) => item.id === id)
  if (index < 0) throw { message: 'Materia no encontrada.' }
  const updated = normalizeSubject({
    ...catalog[index],
    ...patch,
    id: catalog[index].id,
  })
  if (!updated.name) throw { message: 'El nombre de la materia es obligatorio.' }
  catalog = catalog.map((item) => (item.id === id ? updated : item))
  persist()
  return updated
}

export async function deleteTutoringSubjectAdmin(id) {
  await delay()
  catalog = catalog.filter((item) => item.id !== id)
  persist()
}

loadFromStorage()
