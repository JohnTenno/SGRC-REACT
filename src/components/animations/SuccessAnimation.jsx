import { useEffect } from 'react'

/**
 * @param {object} props
 * @param {import('react').ReactNode} [props.message]
 * @param {string} [props.actionLabel]
 * @param {() => void} [props.onAction]
 */
export function SuccessAnimation({
  title = '¡Éxito!',
  message = 'La operación se completó correctamente.',
  duration = 1600,
  onComplete,
  onClose,
  actionLabel,
  onAction,
}) {
  const handleAction = onAction ?? onClose
  const showActionButton = Boolean(actionLabel && handleAction)
  const shouldAutoClose = !showActionButton && Boolean(onComplete)

  useEffect(() => {
    if (!shouldAutoClose) return undefined

    const timer = setTimeout(() => {
      onComplete?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete, shouldAutoClose])

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

        {showActionButton ? (
          <button
            type="button"
            onClick={handleAction}
            className="button-primary font-praxis mt-6 w-full sm:w-auto sm:min-w-[12rem]"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}
