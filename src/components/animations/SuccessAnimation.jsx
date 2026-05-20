import { useEffect } from 'react'

/** @param {object} props */
export function SuccessAnimation({
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-uach-purple-950/60 p-4 backdrop-blur-sm animate-animations-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-animation-title"
    >
      <div className="w-full max-w-sm animate-animations-scale-in rounded-3xl border border-uach-gold-200 bg-white p-8 text-center shadow-xl">
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
              className="text-uach-gold-400 animate-animations-circle-draw"
            />
            <path
              d="M14 27l8 8 16-18"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-uach-gold-400 animate-animations-check-draw"
            />
          </svg>
        </div>

        <h2
          id="success-animation-title"
          className="font-alverata text-xl font-semibold text-uach-purple-950"
        >
          {title}
        </h2>
        <p className="font-praxis mt-2 text-sm leading-relaxed text-uach-purple-900/70">
          {message}
        </p>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="font-praxis mt-6 rounded-xl bg-uach-gold-500 px-5 py-2 text-sm font-semibold text-uach-purple-950 transition hover:brightness-105"
          >
            Continuar
          </button>
        ) : null}
      </div>
    </div>
  )
}
