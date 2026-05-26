import { getAuthSession } from '@/lib/authSession'

const STORAGE_KEY = 'sgrc-tutoring-tutor-profile-employee-number'

const DEFAULT_EMPLOYEE_NUMBER = '100001'

function normalizeEmployeeNumber(value) {
  return String(value ?? '').trim()
}

export function getTutorProfileEmployeeNumber() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const normalized = normalizeEmployeeNumber(stored)
    if (normalized) return normalized
  } catch {}

  const session = getAuthSession()
  const fromUser = normalizeEmployeeNumber(session?.user?.employeeNumber)
  if (fromUser) return fromUser

  return DEFAULT_EMPLOYEE_NUMBER
}

export function setTutorProfileEmployeeNumber(employeeNumber) {
  const normalized = normalizeEmployeeNumber(employeeNumber)
  if (!normalized) return
  try {
    localStorage.setItem(STORAGE_KEY, normalized)
  } catch {}
}
