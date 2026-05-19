import { getSlotsWithStatus } from '@/data/mockCubiculoAvailability'

/**
 * @param {object} props
 * @param {number} props.cubicleId
 * @param {string} props.reservationDate YYYY-MM-DD
 * @param {string} [props.startTime]
 * @param {string} [props.endTime]
 */
export function CubiculoHorariosPanel({
  cubicleId,
  reservationDate,
  startTime,
  endTime,
}) {
  const slots = getSlotsWithStatus(cubicleId, reservationDate)
  const startIdx = startTime ? slots.findIndex((s) => s.time === startTime) : -1
  const endIdx = endTime ? slots.findIndex((s) => s.time === endTime) : -1

  const availableCount = slots.filter((s) => s.status === 'available').length
  const occupiedCount = slots.filter((s) => s.status === 'occupied').length

  return (
    <section className="rounded-xl border border-uach-purple-900/15 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">
        Disponibilidad del día
      </h2>
      <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">
        {reservationDate
          ? `Horarios para el ${formatDateLabel(reservationDate)}.`
          : 'Selecciona una fecha para ver los horarios.'}
      </p>

      <div className="font-praxis mt-4 flex flex-wrap gap-3 text-xs font-medium">
        <span className="inline-flex items-center gap-1.5 text-emerald-800">
          <span className="size-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
          Disponible ({availableCount})
        </span>
        <span className="inline-flex items-center gap-1.5 text-red-700">
          <span className="size-2.5 rounded-full bg-red-400" aria-hidden="true" />
          Ocupado ({occupiedCount})
        </span>
        {startTime && endTime ? (
          <span className="inline-flex items-center gap-1.5 text-uach-purple-900">
            <span className="size-2.5 rounded-full bg-uach-gold-500" aria-hidden="true" />
            Tu selección: {startTime} – {endTime}
          </span>
        ) : null}
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slots.map((slot, index) => {
          const isInSelection =
            startIdx >= 0 && endIdx > startIdx && index >= startIdx && index < endIdx
          const isOccupied = slot.status === 'occupied'

          return (
            <li key={slot.time}>
              <div
                className={`rounded-lg border px-3 py-2.5 text-center text-sm font-medium transition ${
                  isInSelection
                    ? 'border-uach-gold-500 bg-uach-gold-400/20 text-uach-purple-900'
                    : isOccupied
                      ? 'border-red-200 bg-red-50 text-red-800'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-900'
                }`}
              >
                <span className="font-alverata block">{slot.time}</span>
                <span className="font-praxis mt-0.5 block text-xs opacity-80">
                  {isOccupied ? 'Ocupado' : 'Disponible'}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function formatDateLabel(isoDate) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
