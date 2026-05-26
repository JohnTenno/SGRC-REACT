export const TUTORING_PROFESSOR_OFFERINGS_SEED = {
  '100001': {
    scheduleSummary: 'Lun y mié · 10:00–13:00',
    tutoringLocation: 'Cubículo 204, edificio de Administración',
    availableWeekdays: [1, 3],
    tutoringHourSlots: ['10:00', '11:00', '12:00'],
    subjectIds: [1, 6],
  },
  '100002': {
    scheduleSummary: 'Mar y jue · 09:00–12:00',
    tutoringLocation: 'Cubículo 118, edificio de Administración',
    availableWeekdays: [2, 4],
    tutoringHourSlots: ['09:00', '10:00', '11:00'],
    subjectIds: [1],
  },
  '100003': {
    scheduleSummary: 'Lun a vie · 14:00–17:00',
    tutoringLocation: 'Cubículo 312, edificio de Administración',
    availableWeekdays: [1, 2, 3, 4, 5],
    tutoringHourSlots: ['14:00', '15:00', '16:00'],
    subjectIds: [2],
  },
  '100004': {
    scheduleSummary: 'Mié y vie · 11:00–14:00',
    tutoringLocation: 'Cubículo 215, edificio de Administración',
    availableWeekdays: [3, 5],
    tutoringHourSlots: ['11:00', '12:00', '13:00'],
    subjectIds: [2, 5],
  },
  '100005': {
    scheduleSummary: 'Mar · 15:00–18:00',
    tutoringLocation: 'Cubículo 107, edificio de Administración',
    availableWeekdays: [2],
    tutoringHourSlots: ['15:00', '16:00', '17:00'],
    subjectIds: [3],
  },
  '100006': {
    scheduleSummary: 'Jue · 10:00–13:00',
    tutoringLocation: 'Cubículo 226, edificio de Administración',
    availableWeekdays: [4],
    tutoringHourSlots: ['10:00', '11:00', '12:00'],
    subjectIds: [3, 4],
  },
  '100007': {
    scheduleSummary: 'Lun y jue · 16:00–19:00',
    tutoringLocation: 'Cubículo 141, edificio de Administración',
    availableWeekdays: [1, 4],
    tutoringHourSlots: ['16:00', '17:00', '18:00'],
    subjectIds: [4],
  },
  '100008': {
    scheduleSummary: 'Vie · 09:00–12:00',
    tutoringLocation: 'Cubículo 198, edificio de Administración',
    availableWeekdays: [5],
    tutoringHourSlots: ['09:00', '10:00', '11:00'],
    subjectIds: [5],
  },
  '100009': {
    scheduleSummary: 'Mar y vie · 13:00–16:00',
    tutoringLocation: 'Cubículo 253, edificio de Administración',
    availableWeekdays: [2, 5],
    tutoringHourSlots: ['13:00', '14:00', '15:00'],
    subjectIds: [5, 6],
  },
  '100010': {
    scheduleSummary: 'Mié · 08:00–11:00',
    tutoringLocation: 'Cubículo 172, edificio de Administración',
    availableWeekdays: [3],
    tutoringHourSlots: ['08:00', '09:00', '10:00'],
    subjectIds: [6],
  },
}

const LEGACY_OFFERING_ID_TO_EMPLOYEE = {
  1: '100001',
  2: '100002',
  3: '100003',
  4: '100004',
  5: '100005',
  6: '100006',
  7: '100007',
  8: '100008',
  9: '100009',
  10: '100010',
}

const STORAGE_KEY = 'sgrc-tutoring-professor-offerings'

export const EMPTY_TUTORING_PROFESSOR_OFFERING = {
  scheduleSummary: 'Por definir',
  tutoringLocation: 'Por definir',
  availableWeekdays: [],
  tutoringHourSlots: [],
  subjectIds: [],
}

let storedOfferings = {}

function normalizeEmployeeNumber(value) {
  return String(value ?? '').trim()
}

function resolveEmployeeKey(employeeNumber) {
  const normalized = normalizeEmployeeNumber(employeeNumber)
  return LEGACY_OFFERING_ID_TO_EMPLOYEE[normalized] ?? normalized
}

function cloneOffering(offering) {
  return {
    scheduleSummary: offering.scheduleSummary,
    tutoringLocation: offering.tutoringLocation,
    availableWeekdays: [...offering.availableWeekdays],
    tutoringHourSlots: [...offering.tutoringHourSlots],
    subjectIds: [...offering.subjectIds],
  }
}

function getSeedOffering(employeeKey) {
  const seed = TUTORING_PROFESSOR_OFFERINGS_SEED[employeeKey]
  return seed ? cloneOffering(seed) : cloneOffering(EMPTY_TUTORING_PROFESSOR_OFFERING)
}

function normalizeOffering(raw, fallback) {
  const base = fallback ?? EMPTY_TUTORING_PROFESSOR_OFFERING
  const scheduleSummary = String(raw?.scheduleSummary ?? '').trim()
  const tutoringLocation = String(raw?.tutoringLocation ?? '').trim()

  return {
    scheduleSummary: scheduleSummary || base.scheduleSummary,
    tutoringLocation: tutoringLocation || base.tutoringLocation,
    availableWeekdays: Array.isArray(raw?.availableWeekdays)
      ? raw.availableWeekdays
      : base.availableWeekdays,
    tutoringHourSlots: Array.isArray(raw?.tutoringHourSlots)
      ? raw.tutoringHourSlots.map(String)
      : base.tutoringHourSlots,
    subjectIds: Array.isArray(raw?.subjectIds) ? raw.subjectIds : base.subjectIds,
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return
    storedOfferings = Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [
        resolveEmployeeKey(key),
        normalizeOffering(value, getSeedOffering(resolveEmployeeKey(key))),
      ]),
    )
  } catch {
    storedOfferings = {}
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedOfferings))
  } catch {}
}

export function getTutoringProfessorOffering(employeeNumber) {
  loadFromStorage()
  const employeeKey = resolveEmployeeKey(employeeNumber)
  if (!employeeKey) return cloneOffering(EMPTY_TUTORING_PROFESSOR_OFFERING)

  const seed = getSeedOffering(employeeKey)
  const stored = storedOfferings[employeeKey]
  if (!stored) return seed
  return normalizeOffering(stored, seed)
}

export function updateTutoringProfessorOffering(employeeNumber, patch) {
  loadFromStorage()
  const employeeKey = resolveEmployeeKey(employeeNumber)
  if (!employeeKey) throw { message: 'Número de empleado no válido.' }

  const current = getTutoringProfessorOffering(employeeKey)
  const updated = normalizeOffering({ ...current, ...patch }, current)
  storedOfferings[employeeKey] = updated
  persist()
  return cloneOffering(updated)
}

loadFromStorage()
