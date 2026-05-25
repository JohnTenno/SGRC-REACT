import { useEffect, useState } from 'react'
import { CUBICLE_STATUSES } from '@/cubicles/admin/cubiclesAdminApi'

const inputClass =
  'font-praxis w-full rounded-lg border border-uach-purple-900/20 px-3 py-2.5 text-sm text-uach-purple-900 focus:border-uach-gold-400 focus:outline-none focus:ring-2 focus:ring-uach-gold-400/25'

export function CubicleAdminForm({ mode, initial, onSubmit, onCancel, isSubmitting = false }) {
  const [identifier, setIdentifier] = useState(initial?.identifier ?? '')
  const [capacity, setCapacity] = useState(String(initial?.capacity ?? 6))
  const [status, setStatus] = useState(initial?.status ?? 'AVAILABLE')
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl ?? '')
  const [error, setError] = useState(null)

  useEffect(() => {
    setIdentifier(initial?.identifier ?? '')
    setCapacity(String(initial?.capacity ?? 6))
    setStatus(initial?.status ?? 'AVAILABLE')
    setLogoUrl(initial?.logoUrl ?? '')
    setError(null)
  }, [initial, mode])

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedName = identifier.trim()
    const capacityNum = Number(capacity)
    const trimmedLogoUrl = logoUrl.trim()

    if (!trimmedName) {
      setError('El nombre del cubículo es obligatorio.')
      return
    }
    if (!Number.isInteger(capacityNum) || capacityNum < 1) {
      setError('La capacidad debe ser un número entero mayor a 0.')
      return
    }
    if (
      trimmedLogoUrl &&
      !trimmedLogoUrl.startsWith('https://') &&
      !trimmedLogoUrl.startsWith('http://') &&
      !trimmedLogoUrl.startsWith('/')
    ) {
      setError('La URL de la imagen debe comenzar con http://, https:// o /.')
      return
    }

    setError(null)
    try {
      await onSubmit({
        identifier: trimmedName,
        capacity: capacityNum,
        status,
        logoUrl: trimmedLogoUrl || null,
      })
    } catch (err) {
      setError(err.message ?? 'No se pudo guardar el cubículo.')
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:items-end xl:grid-cols-[minmax(0,1.4fr)_minmax(0,6rem)_minmax(0,10rem)_minmax(0,1.6fr)]">
        <div className="min-w-0">
          <label htmlFor="cubicle-name" className="font-alverata text-sm font-semibold text-uach-purple-900">
            Nombre del cubículo
          </label>
          <input
            id="cubicle-name"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className={`${inputClass} mt-1.5`}
            placeholder="Ej. Cubículo biblioteca 07"
            disabled={isSubmitting}
          />
        </div>

        <div className="min-w-0">
          <label htmlFor="cubicle-capacity" className="font-alverata text-sm font-semibold text-uach-purple-900">
            Capacidad máxima
          </label>
          <input
            id="cubicle-capacity"
            type="number"
            min={1}
            max={20}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className={`${inputClass} mt-1.5`}
            disabled={isSubmitting}
          />
        </div>

        <div className="min-w-0">
          <label htmlFor="cubicle-status" className="font-alverata text-sm font-semibold text-uach-purple-900">
            Estatus
          </label>
          <select
            id="cubicle-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`${inputClass} mt-1.5`}
            disabled={isSubmitting}
          >
            {CUBICLE_STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label htmlFor="cubicle-logo-url" className="font-alverata text-sm font-semibold text-uach-purple-900">
            URL de la imagen
          </label>
          <input
            id="cubicle-logo-url"
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
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
          {isSubmitting ? 'Guardando…' : mode === 'create' ? 'Agregar cubículo' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
