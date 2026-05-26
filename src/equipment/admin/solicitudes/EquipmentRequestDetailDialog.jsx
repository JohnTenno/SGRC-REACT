import { useEffect, useState } from 'react'
import { IconClose } from '@/components/icons'
import {
  formatEquipmentRequestDate,
  updateEquipmentRequestStatusAdmin,
} from '@/equipment/admin/solicitudes/equipmentRequestsApi'
import {
  EQUIPMENT_REQUEST_STATUS,
  EQUIPMENT_REQUEST_STATUS_BADGE_CLASS,
  getEquipmentRequestStatusLabel,
} from '@/equipment/home/equipmentRequestStatus'
import { EQUIPMENT_PICKUP_LOCATION } from '@/equipment/home/equipmentRentalApi'

export function EquipmentRequestDetailDialog({ request, onClose, onUpdated }) {
  const [status, setStatus] = useState(request.status)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setStatus(request.status)
    setError(null)
  }, [request])

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  async function applyStatus(nextStatus) {
    setIsSaving(true)
    setError(null)
    try {
      const updated = await updateEquipmentRequestStatusAdmin(request.id, nextStatus)
      setStatus(updated.status)
      onUpdated(updated)
      if (nextStatus === EQUIPMENT_REQUEST_STATUS.COMPLETED) {
        onClose()
      }
    } catch (err) {
      setError(err.message ?? 'No se pudo actualizar el estatus.')
    } finally {
      setIsSaving(false)
    }
  }

  const badgeClass =
    EQUIPMENT_REQUEST_STATUS_BADGE_CLASS[status] ??
    'border-uach-purple-900/15 bg-uach-purple-50 text-uach-purple-900'

  const isPending = status === EQUIPMENT_REQUEST_STATUS.PENDING_PICKUP
  const isAwaitingReturn = status === EQUIPMENT_REQUEST_STATUS.AWAITING_RETURN
  const isCompleted = status === EQUIPMENT_REQUEST_STATUS.COMPLETED

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-uach-purple-950/50"
        aria-hidden
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="equipment-request-detail-title"
        className="relative z-10 flex max-h-[min(90vh,40rem)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-uach-purple-900/15 bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-uach-purple-900/10 px-5 py-4">
          <div className="min-w-0">
            <p className="font-praxis text-xs font-semibold uppercase tracking-wide text-uach-gold-600">
              Orden de equipo
            </p>
            <h2
              id="equipment-request-detail-title"
              className="font-alverata mt-1 text-xl font-semibold text-uach-purple-900"
            >
              Folio #{request.id}
            </h2>
            <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">
              {formatEquipmentRequestDate(request.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-uach-purple-900/60 transition hover:bg-uach-purple-50 hover:text-uach-purple-900"
            aria-label="Cerrar"
          >
            <IconClose className="size-5" aria-hidden />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <dl className="font-praxis grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-uach-purple-900/50">
                Solicitante
              </dt>
              <dd className="mt-0.5 font-medium text-uach-purple-900">{request.studentName}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-uach-purple-900/50">
                Estatus
              </dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeClass}`}
                >
                  {getEquipmentRequestStatusLabel(status)}
                </span>
              </dd>
            </div>
          </dl>

          <section className="mt-5 overflow-hidden rounded-lg border border-uach-purple-900/12">
            <h3 className="font-alverata border-b border-uach-purple-900/10 bg-uach-purple-50/60 px-4 py-2.5 text-sm font-semibold text-uach-purple-900">
              Material solicitado
            </h3>
            <ul className="divide-y divide-uach-purple-900/8">
              {request.items.map((item) => (
                <li
                  key={`${item.id}-${item.type}`}
                  className="font-praxis flex items-center justify-between gap-3 px-4 py-3 text-sm"
                >
                  <span className="font-medium text-uach-purple-900">{item.type}</span>
                  <span className="shrink-0 tabular-nums text-uach-purple-900/75">
                    {item.quantity} {item.quantity === 1 ? 'unidad' : 'unidades'}
                  </span>
                </li>
              ))}
            </ul>
            <p className="font-praxis border-t border-uach-purple-900/10 bg-uach-purple-50/30 px-4 py-2.5 text-sm font-semibold text-uach-purple-900">
              Total: {request.totalUnits}{' '}
              {request.totalUnits === 1 ? 'unidad' : 'unidades'}
            </p>
          </section>

          <p className="font-praxis mt-4 text-xs text-uach-purple-900/55">
            Recoger en: {request.pickupLocation || EQUIPMENT_PICKUP_LOCATION}
          </p>

          {isCompleted ? (
            <p className="font-praxis mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900">
              Esta orden ya fue completada. El equipo fue devuelto.
            </p>
          ) : null}

          {error ? <p className="font-praxis mt-3 text-sm text-red-600">{error}</p> : null}
        </div>

        <footer className="flex flex-col gap-2 border-t border-uach-purple-900/10 p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="button-secondary w-full sm:w-auto"
            onClick={onClose}
            disabled={isSaving}
          >
            {isCompleted ? 'Cerrar' : 'Cancelar'}
          </button>
          {isPending ? (
            <button
              type="button"
              className="button-primary w-full sm:w-auto"
              disabled={isSaving}
              onClick={() => applyStatus(EQUIPMENT_REQUEST_STATUS.AWAITING_RETURN)}
            >
              {isSaving ? 'Guardando…' : 'Marcar como recogido'}
            </button>
          ) : null}
          {isAwaitingReturn ? (
            <button
              type="button"
              className="button-primary w-full sm:w-auto"
              disabled={isSaving}
              onClick={() => applyStatus(EQUIPMENT_REQUEST_STATUS.COMPLETED)}
            >
              {isSaving ? 'Guardando…' : 'Equipo devuelto'}
            </button>
          ) : null}
        </footer>
      </div>
    </div>
  )
}
