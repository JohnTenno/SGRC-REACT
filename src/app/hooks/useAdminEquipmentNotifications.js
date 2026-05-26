import { useEffect, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export function useAdminEquipmentNotifications() {
  const [events, setEvents] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/topic/admin/equipment', (message) => {
          try {
            const payload = JSON.parse(message.body)
            setEvents((prev) => [
              { ...payload, id: Date.now(), isRead: false, receivedAt: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) },
              ...prev,
            ])
            setUnreadCount((c) => c + 1)
          } catch {
            // ignore malformed frams
          }
        })
      },
    })

    client.activate()
    return () => { client.deactivate() }
  }, [])

  function markAllRead() {
    setUnreadCount(0)
    setEvents((prev) => prev.map((e) => ({ ...e, isRead: true })))
  }

  return { events, unreadCount, markAllRead }
}
