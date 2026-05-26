import { useEffect, useRef } from 'react'
import { IconBell, IconClose } from '@/app/components/common/icons'

export function BellButton({ unreadCount, onClick, dark = false }) {
  const base = dark
    ? 'rounded-md p-2 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uach-gold-400'
    : 'rounded-lg p-2 text-uach-purple-900 transition hover:bg-uach-purple-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uach-purple-600'

  return (
    <button type="button" className={`relative ${base}`} onClick={onClick} aria-label="Notificaciones">
      <IconBell className="size-5 shrink-0" aria-hidden />
      {unreadCount > 0 && (
        <span
          aria-label={`${unreadCount} notificaciones sin leer`}
          className="absolute -top-0.5 -right-0.5 flex min-w-[1.1rem] items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] font-bold leading-none text-white ring-1 ring-white/20"
          style={{ height: '1.1rem' }}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  )
}

export function DropdownShell({ onClose, title, onMarkAll, hasUnread, children }) {
  const ref = useRef(null)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <div className="fixed inset-0 z-40" aria-hidden onClick={onClose} />

      <div
        ref={ref}
        role="dialog"
        aria-label="Notificaciones"
        className="absolute right-0 top-full z-50 mt-2 flex w-80 flex-col overflow-hidden rounded-xl border border-uach-purple-900/10 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-uach-purple-900/10 px-4 py-3">
          <span className="font-alverata text-sm font-semibold text-uach-purple-900">
            {title}
          </span>
          <div className="flex items-center gap-1">
            {hasUnread && (
              <button
                type="button"
                onClick={onMarkAll}
                className="rounded px-2 py-1 font-praxis text-xs text-uach-purple-700 transition hover:bg-uach-purple-50"
              >
                Marcar todas leídas
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-uach-purple-900/50 transition hover:bg-uach-purple-50 hover:text-uach-purple-900"
              aria-label="Cerrar"
            >
              <IconClose className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}

export function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-uach-purple-900/40">
      <IconBell className="size-8" aria-hidden />
      <p className="font-praxis text-sm">{message}</p>
    </div>
  )
}
