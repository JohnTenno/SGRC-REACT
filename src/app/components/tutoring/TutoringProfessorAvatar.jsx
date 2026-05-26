import { getProfessorInitials } from '@/app/components/tutoring/tutoringProfessorUtils'

export function TutoringProfessorAvatar({
  fullName,
  size = 'lg',
  ringClassName = 'ring-4 ring-white',
  className = '',
}) {
  const initials = getProfessorInitials(fullName)

  const sizeClass =
    size === 'xl'
      ? 'size-28 text-2xl sm:size-32 sm:text-3xl'
      : size === 'md'
        ? 'size-16 text-lg'
        : 'size-24 text-xl'

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-uach-purple-800 to-uach-purple-950 font-alverata font-bold tracking-wide text-white shadow-md ${ringClassName} ${sizeClass} ${className}`}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}
