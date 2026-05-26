export function CheckInWindowCountdown({ onCheckIn, isSubmitting = false }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-praxis text-sm leading-relaxed text-uach-purple-900/70">
        Escanea el código QR en la entrada del cubículo cuando estés listo para entrar.
      </p>
      <button
        type="button"
        onClick={onCheckIn}
        disabled={isSubmitting}
        className="button-primary w-full sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <span
              className="inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent"
              aria-hidden="true"
            />
            Validando acceso...
          </>
        ) : (
          'Escanear QR para check-in'
        )}
      </button>
    </div>
  )
}
