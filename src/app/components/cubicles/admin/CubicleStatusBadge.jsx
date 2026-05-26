import { getCubicleStatusLabel } from '@/app/services/cubicles/admin.service'

const STATUS_STYLES = {
  AVAILABLE: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  OCCUPIED: 'border-amber-200 bg-amber-50 text-amber-950',
  MAINTENANCE: 'border-slate-200 bg-slate-100 text-slate-800',
}

export function CubicleStatusBadge({ status }) {
  return (
    <span
      className={`font-praxis inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        STATUS_STYLES[status] ?? 'border-uach-purple-900/15 bg-uach-purple-50 text-uach-purple-900'
      }`}
    >
      {getCubicleStatusLabel(status)}
    </span>
  )
}
