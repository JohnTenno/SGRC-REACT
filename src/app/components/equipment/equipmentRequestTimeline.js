import { EQUIPMENT_REQUEST_STATUS } from '@/app/components/equipment/equipmentRequestStatus'

export function splitEquipmentRequests(requests) {
  const active = []
  const past = []

  for (const request of requests) {
    if (request.status === EQUIPMENT_REQUEST_STATUS.COMPLETED) {
      past.push(request)
    } else {
      active.push(request)
    }
  }

  const byNewest = (a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0)
  active.sort(byNewest)
  past.sort(byNewest)

  return { active, past }
}

export function getEquipmentRequestStatusMessage(status) {
  switch (status) {
    case EQUIPMENT_REQUEST_STATUS.PENDING_PICKUP:
      return 'Tu solicitud está registrada. Pasa por el mostrador de biblioteca con tu orden para recoger el material.'
    case EQUIPMENT_REQUEST_STATUS.AWAITING_RETURN:
      return 'El personal confirmó que ya recogiste el equipo. Cuando lo devuelvas, el administrador marcará la solicitud como completada.'
    case EQUIPMENT_REQUEST_STATUS.COMPLETED:
      return 'La biblioteca confirmó la devolución de tu equipo. Esta solicitud quedó cerrada.'
    default:
      return ''
  }
}

export function getEquipmentRequestStatusBannerClass(status) {
  switch (status) {
    case EQUIPMENT_REQUEST_STATUS.PENDING_PICKUP:
      return 'border-amber-200 bg-amber-50 text-amber-950'
    case EQUIPMENT_REQUEST_STATUS.AWAITING_RETURN:
      return 'border-sky-200 bg-sky-50 text-sky-950'
    case EQUIPMENT_REQUEST_STATUS.COMPLETED:
      return 'border-emerald-200 bg-emerald-50 text-emerald-950'
    default:
      return 'border-uach-purple-900/15 bg-uach-purple-50 text-uach-purple-900'
  }
}

export function hasEquipmentStatusUpdate(request) {
  return Boolean(request?.statusUpdatedAt)
}
