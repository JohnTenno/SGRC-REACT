import { Link } from 'react-router-dom'

export function TutoringSubjectCard({ name, description, to }) {
  const className =
    'block rounded-lg border border-uach-purple-900/15 bg-white p-5 shadow-sm transition hover:border-uach-purple-700/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uach-gold-400/40'

  const content = (
    <>
      <h3 className="font-alverata text-lg font-semibold text-uach-purple-900">{name}</h3>
      <p className="font-praxis mt-2 text-sm leading-relaxed text-uach-purple-900/75">
        {description}
      </p>
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
