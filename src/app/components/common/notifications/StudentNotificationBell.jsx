import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '@/app/hooks/useNotifications'
import { BellButton, DropdownShell, EmptyState } from './shared'

function StudentDropdown({ notifications, onClose }) {
  const navigate = useNavigate()

  function handleClick(n) {
    if (n.reservationId) {
      navigate('/my-reservations')
      onClose()
    }
  }

  if (!notifications.length) {
    return <EmptyState message="Sin notificaciones por el momento." />
  }

  return notifications.map((n) => (
    <button
      key={n.id}
      type="button"
      onClick={() => handleClick(n)}
      className="flex w-full items-start gap-3 border-b border-uach-purple-900/5 px-4 py-3 text-left transition last:border-0 hover:bg-uach-purple-50"
    >
      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-uach-purple-700" aria-hidden />
      <p className="font-praxis text-sm leading-snug text-uach-purple-900">{n.message}</p>
    </button>
  ))
}

export function StudentNotificationBell({ dark = false }) {
  const [open, setOpen] = useState(false)
  const [snapshot, setSnapshot] = useState([])
  const { notifications, unreadCount, markAllAsRead } = useNotifications()

  function handleToggle() {
    if (open) {
      setOpen(false)
      return
    }
    const unread = notifications.filter((n) => !n.isRead)
    setSnapshot(unread)
    if (unread.length > 0) markAllAsRead()
    setOpen(true)
  }

  return (
    <div className="relative">
      <BellButton unreadCount={unreadCount} dark={dark} onClick={handleToggle} />

      {open && (
        <DropdownShell
          title="Notificaciones"
          hasUnread={false}
          onClose={() => setOpen(false)}
        >
          <StudentDropdown
            notifications={snapshot}
            onClose={() => setOpen(false)}
          />
        </DropdownShell>
      )}
    </div>
  )
}
