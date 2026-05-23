import { Link } from 'react-router-dom'
import { TutoringProfessorAvatar } from '@/components/tutoring/TutoringProfessorAvatar'

export function TutoringProfessorCard({
  fullName,
  bio,
  scheduleSummary,
  tutoringLocation,
  to,
}) {
  const className =
    'block rounded-lg border border-uach-purple-900/15 bg-white p-5 shadow-sm transition hover:border-uach-purple-700/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uach-gold-400/40'

  const content = (
    <>
      <div className="flex items-start gap-4">
        <TutoringProfessorAvatar fullName={fullName} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="font-alverata text-lg font-semibold text-uach-purple-900">{fullName}</h3>
          <p className="font-praxis mt-2 text-sm leading-relaxed text-uach-purple-900/75">{bio}</p>
        </div>
      </div>
      <dl className="font-praxis mt-4 space-y-2 text-sm text-uach-purple-900">
        <div>
          <dt className="font-medium">Lugar de la asesoría</dt>
          <dd className="mt-0.5 font-semibold text-uach-purple-900/90">{tutoringLocation}</dd>
        </div>
        <div>
          <dt className="font-medium">Horario de tutoría</dt>
          <dd className="mt-0.5 font-semibold text-uach-gold-600">{scheduleSummary}</dd>
        </div>
      </dl>
      {to ? (
        <p className="font-praxis mt-4 text-sm font-semibold text-uach-purple-900/70">
          Ver perfil y agendar →
        </p>
      ) : null}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }

  return <article className={className}>{content}</article>
}
