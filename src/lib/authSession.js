const AUTH_STORAGE_KEY = 'sgrc.auth'

/**
 * @typedef {object} AuthUser
 * @property {number} id
 * @property {string} enrollment
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {boolean} isTutor
 * @property {number} facultyId
 */

/**
 * @typedef {object} AuthSession
 * @property {string} token
 * @property {AuthUser} user
 */

/** @param {AuthSession} session */
export function saveAuthSession(session) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

/** @returns {AuthSession | null} */
export function getAuthSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
