export function EquipmentStockBadge({ availableStock }) {
  const outOfStock = availableStock <= 0
  return (
    <span
      className={`font-praxis inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        outOfStock
          ? 'border-red-200 bg-red-50 text-red-800'
          : 'border-emerald-200 bg-emerald-50 text-emerald-900'
      }`}
    >
      {outOfStock ? 'Sin stock' : 'Con stock'}
    </span>
  )
}
