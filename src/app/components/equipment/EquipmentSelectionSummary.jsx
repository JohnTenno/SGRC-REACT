
export function EquipmentSelectionSummary({ items, onRemove, onQuantityChange }) {
  if (items.length === 0) return null

  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-w-0 flex-1">
      <p className="font-alverata text-sm font-semibold text-uach-purple-900">
        Resumen de tu solicitud
      </p>
      <ul className="font-praxis mt-2 flex max-h-28 flex-wrap gap-2 overflow-y-auto overflow-x-visible pt-1 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            className="group flex items-center gap-1.5 rounded-full border border-uach-purple-900/15 bg-uach-purple-50/80 py-1 pl-3 pr-1.5"
          >
            <span className="font-medium text-uach-purple-900">{item.type}</span>

            <div className="flex items-center gap-0.5 text-uach-purple-900">
              <button
                type="button"
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                aria-label={`Menos ${item.type}`}
                className="flex size-6 items-center justify-center rounded-full text-sm font-semibold transition hover:bg-uach-purple-900/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                −
              </button>
              <span className="min-w-[1.25rem] text-center text-xs font-semibold tabular-nums">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.availableStock}
                aria-label={`Más ${item.type}`}
                className="flex size-6 items-center justify-center rounded-full text-sm font-semibold transition hover:bg-uach-purple-900/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label={`Quitar ${item.type}`}
              className="flex size-5 shrink-0 items-center justify-center rounded-full bg-uach-purple-900 text-xs font-bold leading-none text-white opacity-0 shadow-sm transition hover:bg-red-600 group-hover:opacity-100"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <p className="font-praxis mt-1.5 text-xs text-uach-purple-900/55">
        Llevas {totalUnits} unidad{totalUnits === 1 ? '' : 'es'} en total
      </p>
    </div>
  )
}
