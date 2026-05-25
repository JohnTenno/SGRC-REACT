export const EQUIPMENT_REQUEST_STATUS = {
  PENDING_PICKUP: 'PENDING_PICKUP',
  AWAITING_RETURN: 'AWAITING_RETURN',
  COMPLETED: 'COMPLETED',
}

export const EQUIPMENT_REQUEST_STATUS_LABELS = {
  PENDING_PICKUP: 'Pendiente de recoger',
  AWAITING_RETURN: 'En espera de devolución',
  COMPLETED: 'Completada',
}

export function getEquipmentRequestStatusLabel(status) {
  return EQUIPMENT_REQUEST_STATUS_LABELS[status] ?? status
}

export const EQUIPMENT_REQUEST_STATUS_BADGE_CLASS = {
  PENDING_PICKUP: 'border-amber-200 bg-amber-50 text-amber-950',
  AWAITING_RETURN: 'border-sky-200 bg-sky-50 text-sky-900',
  COMPLETED: 'border-emerald-200 bg-emerald-50 text-emerald-900',
}
