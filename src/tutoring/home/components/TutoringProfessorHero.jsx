import heroBackground from '@/assets/images/img-5.webp'
import { TutoringProfessorAvatar } from '@/tutoring/home/components/TutoringProfessorAvatar'

export function TutoringProfessorHero({
  fullName,
  subjectName,
  bio,
  tutoringLocation,
}) {
  return (
    <header className="relative w-full overflow-hidden">
      <div className="relative min-h-[300px] sm:min-h-[400px] lg:min-h-[480px]">
        <img
          src={heroBackground}
          alt=""
          className="absolute inset-0 size-full object-cover"
          decoding="async"
          fetchPriority="high"
        />

        <div
          className="absolute inset-0 bg-linear-to-t from-uach-purple-950/95 via-uach-purple-900/70 to-uach-purple-950/75"
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-[300px] items-center px-6 py-10 sm:min-h-[400px] sm:px-10 lg:min-h-[480px]">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex items-center gap-4 sm:shrink-0">
              <TutoringProfessorAvatar
                fullName={fullName}
                size="lg"
                ringClassName="ring-4 ring-white/35"
                className="sm:size-28 sm:text-2xl lg:size-32 lg:text-3xl"
              />

              <div className="min-w-0 flex-1 sm:hidden">
                <h1 className="font-alverata text-xl font-semibold leading-tight text-white">
                  {fullName}
                </h1>
                <p className="font-praxis mt-2 inline-flex max-w-full rounded-full border border-uach-gold-400/40 bg-uach-gold-400/20 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {subjectName}
                </p>
              </div>
            </div>

            <div className="min-w-0 flex-1 text-left">
              <p className="font-praxis hidden text-xs font-semibold uppercase tracking-[0.14em] text-white/65 sm:block">
                Solicitar asesoría
              </p>
              <h1 className="font-alverata mt-1 hidden text-2xl font-semibold leading-tight text-white sm:block sm:text-3xl lg:text-4xl">
                {fullName}
              </h1>

              <p className="font-praxis mt-3 hidden rounded-full border border-uach-gold-400/40 bg-uach-gold-400/20 px-3 py-1 text-sm font-semibold text-white sm:inline-flex">
                Materia: {subjectName}
              </p>

              <p className="font-praxis mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:mt-4 sm:text-base">
                {bio}
              </p>

              <dl className="font-praxis mt-4 text-sm sm:mt-5">
                <div>
                  <dt className="text-white/60">Lugar de la asesoría</dt>
                  <dd className="mt-0.5 font-semibold text-white">{tutoringLocation}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
