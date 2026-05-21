import { CheckInQrReader } from '@/components/reservation/CheckInQrReader'

/**
 * Modal con escáner QR (legado; preferir ruta /check-in/:id).
 * @param {object} props
 * @param {import('@/data/mockUserReservations').CubicleReservation} props.reservation
 * @param {(scannedPayload: string) => void | Promise<void>} props.onScanSuccess
 * @param {() => void} props.onClose
 * @param {boolean} [props.isSubmitting]
 */
export function CheckInQrScanner({ reservation, onScanSuccess, onClose, isSubmitting = false }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-uach-purple-950/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="check-in-qr-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-uach-gold-400/40 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b border-uach-purple-900/10 px-5 py-4">
          <div>
            <h2
              id="check-in-qr-title"
              className="font-alverata text-lg font-semibold text-uach-purple-900"
            >
              Escanear QR de acceso
            </h2>
            <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">
              Enfoca el QR de la pantalla en el recuadro.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="shrink-0 rounded-md p-1 text-uach-purple-900/60 transition hover:bg-uach-purple-50 hover:text-uach-purple-900"
            aria-label="Cerrar escáner"
          >
            <svg
              className="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          <CheckInQrReader
            reservation={reservation}
            onScanSuccess={onScanSuccess}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}
