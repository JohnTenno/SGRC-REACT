import { Link } from 'react-router-dom'
import {
  EQUIPMENT_REQUEST_STATUS_BADGE_CLASS,
  getEquipmentRequestStatusLabel,
} from '@/app/components/equipment/equipmentRequestStatus'
import {
  getEquipmentRequestStatusBannerClass,
  getEquipmentRequestStatusMessage,
} from '@/app/components/equipment/equipmentRequestTimeline'
import {
  formatEquipmentRequestDate,
} from '@/app/services/equipment/requests.service'

export function MyEquipmentRequestCard({ request }) {
  const badgeClass =
    EQUIPMENT_REQUEST_STATUS_BADGE_CLASS[request.status] ??
    'border-uach-purple-900/15 bg-uach-purple-50 text-uach-purple-900'
  const statusMessage = getEquipmentRequestStatusMessage(request.status)
  const bannerClass = getEquipmentRequestStatusBannerClass(request.status)

  return (
    <article className="overflow-hidden rounded-xl border border-uach-purple-900/12 bg-white shadow-sm">
      {statusMessage ? (
        <div
          className={`border-b px-4 py-3 font-praxis text-sm leading-relaxed ${bannerClass}`}
          role="status"
        >
          <p className="font-semibold">{getEquipmentRequestStatusLabel(request.status)}</p>
          <p className="mt-1">{statusMessage}</p>
          {request.statusUpdatedAt ? (
            <p className="mt-2 text-xs opacity-80">
              Última actualización: {formatEquipmentRequestDate(request.statusUpdatedAt)}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-alverata text-lg font-semibold text-uach-purple-900">
              Folio {request.id}
            </h3>
            <span
              className={`font-praxis shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass}`}
            >
              {getEquipmentRequestStatusLabel(request.status)}
            </span>
          </div>
          <p className="font-praxis mt-2 text-sm text-uach-purple-900/70">
            Solicitada el {formatEquipmentRequestDate(request.createdAt)}
          </p>
          <p className="font-praxis mt-2 text-sm text-uach-purple-900/85">
            {request.itemsSummary}
          </p>
          <p className="font-praxis mt-1 text-xs text-uach-purple-900/55">
            {request.totalUnits}{' '}
            {request.totalUnits === 1 ? 'unidad solicitada' : 'unidades solicitadas'}
          </p>
        </div>

        <Link
          to={`/equipment-rental/order/${request.id}`}
          className="button-primary w-full shrink-0 text-center sm:w-auto sm:min-w-[10rem]"
        >
          Ver orden
        </Link>
      </div>
    </article>
  )
}
