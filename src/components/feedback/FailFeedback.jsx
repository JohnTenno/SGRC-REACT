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
      className="fixed inset-0 z-50 flex items-center justify-center bg-uach-purple-950/60 p-4 backdrop-blur-sm animate-feedback-fade-in"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="fail-feedback-title"
    >
      <div className="w-full max-w-sm animate-feedback-scale-in animate-feedback-shake rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
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

        <h2
          id="fail-feedback-title"
          className="font-alverata text-xl font-semibold text-uach-purple-950"
        >
          {title}
        </h2>
        <p className="font-praxis mt-2 text-sm text-red-600">{message}</p>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="font-praxis mt-6 rounded-xl border border-uach-purple-900/20 px-5 py-2 text-sm font-medium text-uach-purple-950 transition hover:bg-uach-purple-50"
          >
            Intentar de nuevo
          </button>
        ) : null}
      </div>
    </div>
  )
}
