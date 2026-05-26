import { useCallback, useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { getAuthSession } from '@/app/services/auth.service'
import { fetchMyNotifications, markNotificationAsRead } from '@/app/services/notifications.service'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const session = getAuthSession()
  const userId = session?.user?.id

  const reload = useCallback(() => {
    if (!userId) return
    fetchMyNotifications().then(setNotifications).catch(() => {})
  }, [userId])

  useEffect(() => { reload() }, [reload])

  const clientRef = useRef(null)
  useEffect(() => {
    if (!userId) return

    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/user/${userId}`, () => { reload() })
      },
    })

    client.activate()
    clientRef.current = client
    return () => { client.deactivate() }
  }, [userId, reload])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  async function markAsRead(id) {
    await markNotificationAsRead(id).catch(() => {})
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  async function markAllAsRead() {
    const unread = notifications.filter((n) => !n.isRead)
    await Promise.allSettled(unread.map((n) => markNotificationAsRead(n.id)))
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return { notifications, unreadCount, markAsRead, markAllAsRead }
}
