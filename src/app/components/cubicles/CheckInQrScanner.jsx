import { IconClose } from '@/app/components/common/icons'
import { CheckInQrReader } from '@/app/components/cubicles/CheckInQrReader'

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
            <IconClose className="size-6" aria-hidden />
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
