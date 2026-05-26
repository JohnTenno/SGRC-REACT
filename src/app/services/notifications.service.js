import { getAuthSession } from '@/app/services/auth.service'

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}

async function parseJson(response) {
  const ct = response.headers.get('content-type') ?? ''
  return ct.includes('application/json') ? response.json() : null
}

export async function fetchMyNotifications() {
  const session = getAuthSession()
  if (!session?.token) throw { status: 401, message: 'Debes iniciar sesión.' }
  const res = await fetch('/api/notifications/my', {
    headers: authHeaders(session.token),
  })
  const data = await parseJson(res)
  if (!res.ok) throw { status: res.status, message: data?.message ?? 'Error al cargar notificaciones.' }
  return Array.isArray(data) ? data : []
}

export async function markNotificationAsRead(id) {
  const session = getAuthSession()
  if (!session?.token) return
  await fetch(`/api/notifications/${id}/read`, {
    method: 'PUT',
    headers: authHeaders(session.token),
  })
}
