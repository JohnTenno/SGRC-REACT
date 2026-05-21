import { useEffect } from 'react'
import { formatTimeForDisplay } from '@/lib/reservationTimeline'

/**
 * @param {object} props
 * @param {string} props.cubicleName
 * @param {string} props.startTime HH:MM:SS
 * @param {string} props.endTime HH:MM:SS
 * @param {number} [props.duration]
 * @param {() => void} props.onComplete
 */
export function CheckInWelcomeAnimation({
  cubicleName,
  startTime,
  endTime,
  duration = 4500,
  onComplete,
}) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), duration)
    return () => clearTimeout(timer)
  }, [duration, onComplete])

  const startLabel = formatTimeForDisplay(startTime)
  const endLabel = formatTimeForDisplay(endTime)

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-uach-purple-950/65 p-4 backdrop-blur-sm animate-animations-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="check-in-welcome-title"
    >
      <div className="w-full max-w-sm animate-animations-scale-in rounded-3xl border border-uach-gold-300 bg-gradient-to-b from-white to-uach-gold-400/10 p-8 text-center shadow-xl">
        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-uach-gold-400/25">
          <span className="text-4xl" aria-hidden="true">
            ✓
          </span>
        </div>

        <h2
          id="check-in-welcome-title"
          className="font-alverata text-2xl font-semibold text-uach-purple-950"
        >
          ¡Acceso concedido!
        </h2>
        <p className="font-praxis mt-3 text-base leading-relaxed text-uach-purple-900/80">
          Disfruta tu sesión en{' '}
          <span className="font-alverata font-semibold text-uach-purple-900">{cubicleName}</span>.
        </p>
        <p className="font-praxis mt-2 text-sm text-uach-purple-900/65">
          Horario reservado: {startLabel} – {endLabel}
        </p>
        <p className="font-praxis mt-4 text-xs text-uach-gold-700">
          Recuerda salir al terminar tu horario.
        </p>
      </div>
    </div>
  )
}
