import { IconPencil, IconTrash } from '@/components/icons'

const actionButtonClass =
  'font-praxis inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60'

export function TutoringSubjectAdminCard({
  subject,
  isEditing = false,
  isDeleting = false,
  onEdit,
  onDelete,
}) {
  return (
    <article
      className={`flex h-full w-full flex-col rounded-lg border-2 bg-white p-5 shadow-sm transition ${
        isEditing
          ? 'border-uach-gold-500 ring-4 ring-uach-gold-400/35'
          : 'border-uach-purple-900/15'
      }`}
    >
      <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">{subject.name}</h2>
      <p className="font-praxis mt-2 flex-1 text-sm leading-relaxed text-uach-purple-900/75 line-clamp-4">
        {subject.description || 'Sin descripción.'}
      </p>
      <p className="font-praxis mt-3 text-xs text-uach-purple-900/50">ID {subject.id}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          className={`${actionButtonClass} border-uach-purple-900/20 bg-white text-uach-purple-900 shadow-sm hover:bg-uach-purple-50`}
          onClick={onEdit}
        >
          <IconPencil className="size-4 shrink-0" aria-hidden />
          Editar
        </button>
        <button
          type="button"
          className={`${actionButtonClass} border-red-200 bg-white text-red-700 hover:bg-red-50`}
          disabled={isDeleting}
          onClick={onDelete}
        >
          <IconTrash className="size-4 shrink-0" aria-hidden />
          {isDeleting ? 'Eliminando…' : 'Eliminar'}
        </button>
      </div>
    </article>
  )
}
