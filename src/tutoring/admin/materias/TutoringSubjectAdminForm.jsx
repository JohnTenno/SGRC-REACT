import { useEffect, useState } from 'react'

const inputClass =
  'font-praxis w-full rounded-lg border border-uach-purple-900/20 px-3 py-2.5 text-sm text-uach-purple-900 focus:border-uach-gold-400 focus:outline-none focus:ring-2 focus:ring-uach-gold-400/25'

const textareaClass = `${inputClass} min-h-[6rem] resize-y`

export function TutoringSubjectAdminForm({ mode, initial, onSubmit, onCancel, isSubmitting = false }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [error, setError] = useState(null)

  useEffect(() => {
    setName(initial?.name ?? '')
    setDescription(initial?.description ?? '')
    setError(null)
  }, [initial, mode])

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    if (!trimmedName) {
      setError('El nombre de la materia es obligatorio.')
      return
    }

    setError(null)
    try {
      await onSubmit({
        name: trimmedName,
        description: trimmedDescription,
      })
    } catch (err) {
      setError(err.message ?? 'No se pudo guardar la materia.')
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-w-0 lg:col-span-2">
          <label htmlFor="tutoring-subject-name" className="font-alverata text-sm font-semibold text-uach-purple-900">
            Nombre de la materia
          </label>
          <input
            id="tutoring-subject-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={`${inputClass} mt-1.5`}
            placeholder="Ej. Cálculo diferencial"
            disabled={isSubmitting}
          />
        </div>

        <div className="min-w-0 lg:col-span-2">
          <label
            htmlFor="tutoring-subject-description"
            className="font-alverata text-sm font-semibold text-uach-purple-900"
          >
            Descripción
          </label>
          <textarea
            id="tutoring-subject-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={`${textareaClass} mt-1.5`}
            placeholder="Breve descripción para los estudiantes…"
            disabled={isSubmitting}
            rows={3}
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
          {isSubmitting ? 'Guardando…' : mode === 'create' ? 'Agregar materia' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
