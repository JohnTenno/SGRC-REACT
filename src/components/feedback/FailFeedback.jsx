/**
 * Feedback animado de error (login fallido, tarea incompleta, etc.)
 *
 * @param {object} props
 * @param {string} [props.title]
 * @param {string} [props.message]
 * @param {() => void} [props.onClose]
 */
export function FailFeedback({
  title = 'Algo salió mal',
  message = 'No se pudo completar la operación.',
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-uach-purple-950/80 p-4 backdrop-blur-sm animate-feedback-fade-in"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="fail-feedback-title"
    >
      <div className="w-full max-w-sm animate-feedback-scale-in animate-feedback-shake rounded-3xl border border-red-400/30 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-red-500/15">
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
              className="text-red-400/80"
            />
            <path
              d="M18 18l16 16M34 18L18 34"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-red-400 animate-feedback-x-draw"
            />
          </svg>
        </div>

        <h2 id="fail-feedback-title" className="text-xl font-semibold text-white">
          {title}
        </h2>
        <p className="mt-2 text-sm text-red-100/90">{message}</p>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="mt-6 rounded-xl border border-white/25 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Intentar de nuevo
          </button>
        ) : null}
      </div>
    </div>
  )
}
