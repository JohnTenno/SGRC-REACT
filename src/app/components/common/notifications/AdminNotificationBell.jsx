import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminEquipmentNotifications } from '@/app/hooks/useAdminEquipmentNotifications'
import { BellButton, DropdownShell, EmptyState } from './shared'

function AdminDropdown({ events, onClose }) {
  const navigate = useNavigate()

  function handleClick() {
    navigate('/admin/equipo-solicitudes')
    onClose()
  }

  if (!events.length) {
    return <EmptyState message="Sin solicitudes de equipo pendientes." />
  }

  return events.map((e) => (
    <button
      key={e.id}
      type="button"
      onClick={handleClick}
      className={`flex w-full items-start gap-3 border-b border-uach-purple-900/5 px-4 py-3 text-left transition last:border-0 hover:bg-uach-purple-50 ${
        e.isRead ? 'opacity-60' : ''
      }`}
    >
      {!e.isRead && (
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-uach-purple-700" aria-hidden />
      )}
      {e.isRead && <span className="mt-1.5 size-2 shrink-0" aria-hidden />}
      <div className="min-w-0">
        <p className="font-praxis text-sm leading-snug text-uach-purple-900">
          Nueva solicitud de préstamo de equipo
        </p>
        {e.receivedAt && (
          <p className="mt-0.5 font-praxis text-xs text-uach-purple-900/50">{e.receivedAt}</p>
        )}
      </div>
    </button>
  ))
}

export function AdminNotificationBell({ dark = false }) {
  const [open, setOpen] = useState(false)
  const { events, unreadCount, markAllRead } = useAdminEquipmentNotifications()

  return (
    <div className="relative">
      <BellButton unreadCount={unreadCount} dark={dark} onClick={() => setOpen((v) => !v)} />

      {open && (
        <DropdownShell
          title="Solicitudes de equipo"
          hasUnread={unreadCount > 0}
          onMarkAll={markAllRead}
          onClose={() => setOpen(false)}
        >
          <AdminDropdown events={events} onClose={() => setOpen(false)} />
        </DropdownShell>
      )}
    </div>
  )
}
