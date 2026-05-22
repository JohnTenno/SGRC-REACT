/**
 * @param {object} props
 * @param {string} props.name
 * @param {string} props.description
 */
export function TutoringSubjectCard({ name, description }) {
  return (
    <article className="rounded-lg border border-uach-purple-900/15 bg-white p-5 shadow-sm transition hover:border-uach-purple-700/30 hover:shadow-md">
      <h3 className="font-alverata text-lg font-semibold text-uach-purple-900">{name}</h3>
      <p className="font-praxis mt-2 text-sm leading-relaxed text-uach-purple-900/75">
        {description}
      </p>
    </article>
  )
}
