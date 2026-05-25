import { useEffect, useState } from 'react'
import { EQUIPMENT_CATEGORIES } from '@/equipment/admin/equipmentAdminApi'

const inputClass =
  'font-praxis w-full rounded-lg border border-uach-purple-900/20 px-3 py-2.5 text-sm text-uach-purple-900 focus:border-uach-gold-400 focus:outline-none focus:ring-2 focus:ring-uach-gold-400/25'

export function EquipmentAdminForm({ mode, initial, onSubmit, onCancel, isSubmitting = false }) {
  const [type, setType] = useState(initial?.type ?? '')
  const [category, setCategory] = useState(initial?.category ?? 'computo')
  const [availableStock, setAvailableStock] = useState(String(initial?.availableStock ?? 0))
  const [imageUrl, setImageUrl] = useState(initial?.image ?? '')
  const [error, setError] = useState(null)

  useEffect(() => {
    setType(initial?.type ?? '')
    setCategory(initial?.category ?? 'computo')
    setAvailableStock(String(initial?.availableStock ?? 0))
    setImageUrl(initial?.image ?? '')
    setError(null)
  }, [initial, mode])

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedType = type.trim()
    const stockNum = Number(availableStock)
    const trimmedImageUrl = imageUrl.trim()

    if (!trimmedType) {
      setError('El nombre del equipo es obligatorio.')
      return
    }
    if (!Number.isInteger(stockNum) || stockNum < 0) {
      setError('El stock debe ser un número entero mayor o igual a 0.')
      return
    }
    if (
      trimmedImageUrl &&
      !trimmedImageUrl.startsWith('https://') &&
      !trimmedImageUrl.startsWith('http://') &&
      !trimmedImageUrl.startsWith('/')
    ) {
      setError('La URL de la imagen debe comenzar con http://, https:// o /.')
      return
    }

    setError(null)
    try {
      await onSubmit({
        type: trimmedType,
        category,
        availableStock: stockNum,
        image: trimmedImageUrl || null,
      })
    } catch (err) {
      setError(err.message ?? 'No se pudo guardar el equipo.')
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:items-end xl:grid-cols-[minmax(0,1.4fr)_minmax(0,10rem)_minmax(0,6rem)_minmax(0,1.6fr)]">
        <div className="min-w-0">
          <label htmlFor="equipment-type" className="font-alverata text-sm font-semibold text-uach-purple-900">
            Nombre del equipo
          </label>
          <input
            id="equipment-type"
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={`${inputClass} mt-1.5`}
            placeholder="Ej. Laptop"
            disabled={isSubmitting}
          />
        </div>

        <div className="min-w-0">
          <label htmlFor="equipment-category" className="font-alverata text-sm font-semibold text-uach-purple-900">
            Categoría
          </label>
          <select
            id="equipment-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputClass} mt-1.5`}
            disabled={isSubmitting}
          >
            {EQUIPMENT_CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label htmlFor="equipment-stock" className="font-alverata text-sm font-semibold text-uach-purple-900">
            Stock disponible
          </label>
          <input
            id="equipment-stock"
            type="number"
            min={0}
            max={999}
            value={availableStock}
            onChange={(e) => setAvailableStock(e.target.value)}
            className={`${inputClass} mt-1.5`}
            disabled={isSubmitting}
          />
        </div>

        <div className="min-w-0">
          <label htmlFor="equipment-image-url" className="font-alverata text-sm font-semibold text-uach-purple-900">
            URL de la imagen
          </label>
          <input
            id="equipment-image-url"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={`${inputClass} mt-1.5`}
            placeholder="https://…"
            disabled={isSubmitting}
            autoComplete="off"
          />
        </div>
      </div>

      {error ? <p className="font-praxis text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="button-secondary w-full sm:w-auto"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button type="submit" className="button-primary w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : mode === 'create' ? 'Agregar equipo' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
