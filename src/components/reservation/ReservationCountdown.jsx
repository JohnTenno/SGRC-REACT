import { useEffect, useState } from 'react'
import { formatRemainingTime } from '@/lib/reservationTimeline'

/**
 * @param {object} props
 * @param {Date | null} props.deadline
 * @param {string} props.label
 * @param {'check-in' | 'usage'} [props.variant]
 * @param {string} [props.expiredMessage]
 */
export function ReservationCountdown({
  deadline,
  label,
  variant = 'check-in',
  expiredMessage,
}) {
  const remainingMs = useCountdown(deadline)
  const expired = remainingMs !== null && remainingMs <= 0

  if (!deadline || remainingMs === null) return null

  const variantClass =
    variant === 'usage'
      ? 'border-uach-gold-500/35 bg-uach-gold-400/10'
      : 'border-amber-300/60 bg-amber-50/80'

  return (
    <div
      className={`rounded-lg border px-4 py-3 ${variantClass}`}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      <p
        className={`font-praxis text-xs font-medium ${
          variant === 'usage' ? 'text-uach-purple-900/70' : 'text-amber-900/80'
        }`}
      >
        {label}
      </p>
      <p
        className={`font-alverata mt-1 text-3xl font-semibold tracking-tight tabular-nums ${
          expired
            ? 'text-uach-purple-900/40'
            : variant === 'usage'
              ? 'text-uach-purple-900'
              : 'text-amber-900'
        }`}
      >
        {expired ? '00:00' : formatRemainingTime(remainingMs)}
      </p>
      {expired && expiredMessage ? (
        <p className="font-praxis mt-1 text-xs text-uach-purple-900/55">{expiredMessage}</p>
      ) : null}
    </div>
  )
}

/** @param {Date | null} deadline */
function useCountdown(deadline) {
  const [remainingMs, setRemainingMs] = useState(() =>
    deadline ? deadline.getTime() - Date.now() : null,
  )

  useEffect(() => {
    if (!deadline) {
      setRemainingMs(null)
      return undefined
    }

    function tick() {
      setRemainingMs(deadline.getTime() - Date.now())
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [deadline])

  return remainingMs
}
