import { useEffect } from 'react'
import { IconClose } from '@/app/components/common/icons'

export function TutoringAdminFormDialog({ title, subtitle, onClose, children }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-uach-purple-950/50"
        aria-hidden
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutoring-admin-form-dialog-title"
        className="relative z-10 flex max-h-[min(90vh,36rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-uach-purple-900/15 bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-uach-purple-900/10 px-5 py-4">
          <div className="min-w-0">
            <h2
              id="tutoring-admin-form-dialog-title"
              className="font-alverata text-xl font-semibold text-uach-purple-900"
            >
              {title}
            </h2>
            {subtitle ? (
              <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-uach-purple-900/70 transition hover:bg-uach-purple-50 hover:text-uach-purple-900"
            aria-label="Cerrar"
          >
            <IconClose className="size-5" aria-hidden />
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
