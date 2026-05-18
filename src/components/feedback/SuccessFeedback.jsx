import { useEffect } from 'react'

/**
 * Feedback animado de éxito (login, guardado, etc.)
 *
 * @param {object} props
 * @param {string} [props.title]
 * @param {string} [props.message]
 * @param {number} [props.duration] ms antes de llamar onComplete
 * @param {() => void} [props.onComplete]
 * @param {() => void} [props.onClose] si el usuario cierra manualmente
 */
export function SuccessFeedback({
  title = '¡Éxito!',
  message = 'La operación se completó correctamente.',
  duration = 1600,
  onComplete,
  onClose,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-uach-purple-950/80 p-4 backdrop-blur-sm animate-feedback-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-feedback-title"
    >
      <div className="w-full max-w-sm animate-feedback-scale-in rounded-3xl border border-uach-gold-400/30 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-uach-gold-400/15">
          <svg
            className="size-16"
            viewBox="0 0 52 52"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="26"
              cy="26"
              r="24"
              stroke="currentColor"
              strokeWidth="3"
              className="text-uach-gold-400 animate-feedback-circle-draw"
            />
            <path
              d="M14 27l8 8 16-18"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-uach-gold-400 animate-feedback-check-draw"
            />
          </svg>
        </div>

        <h2
          id="success-feedback-title"
          className="text-xl font-semibold text-white"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm text-white/75">{message}</p>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="mt-6 rounded-xl bg-uach-gold-500 px-5 py-2 text-sm font-semibold text-uach-purple-950 transition hover:brightness-105"
          >
            Continuar
          </button>
        ) : null}
      </div>
    </div>
  )
}
