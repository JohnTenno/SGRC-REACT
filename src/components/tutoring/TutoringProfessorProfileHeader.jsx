import { TutoringProfessorAvatar } from '@/components/tutoring/TutoringProfessorAvatar'

export function TutoringProfessorProfileHeader({
  fullName,
  subjectName,
  bio,
  tutoringLocation,
  scheduleSummary,
}) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <TutoringProfessorAvatar fullName={fullName} size="xl" />

        <div className="min-w-0 flex-1">
          <p className="font-praxis text-xs font-semibold uppercase tracking-[0.12em] text-uach-purple-900/55">
            Perfil del docente
          </p>
          <h1 className="font-alverata mt-1 text-2xl font-semibold text-uach-purple-900 sm:text-3xl">
            {fullName}
          </h1>

          <p className="font-praxis mt-3 inline-flex rounded-full border border-uach-gold-400/50 bg-uach-gold-400/15 px-3 py-1 text-sm font-semibold text-uach-purple-900">
            Materia: {subjectName}
          </p>

          <p className="font-praxis mt-4 text-sm leading-relaxed text-uach-purple-900/80">{bio}</p>

          <dl className="font-praxis mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-uach-purple-900/70">Lugar de la asesoría</dt>
              <dd className="mt-0.5 font-semibold text-uach-purple-900">{tutoringLocation}</dd>
            </div>
            <div>
              <dt className="font-medium text-uach-purple-900/70">Días de tutoría</dt>
              <dd className="mt-0.5 font-semibold text-uach-gold-600">{scheduleSummary}</dd>
            </div>
          </dl>
        </div>
    </div>
  )
}
