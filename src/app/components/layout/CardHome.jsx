import { Link } from 'react-router-dom'
import { DASHBOARD_SECTIONS } from '@/app/components/dashboard/sections'

const homeServices = DASHBOARD_SECTIONS.map((section) => ({
  ...section,
  title:
    section.id === 'cubiculos'
      ? 'Reserva de cubículos'
      : section.id === 'equipo'
        ? 'Renta de equipo universitario'
        : 'Tutorías con profesores',
  description:
    section.id === 'cubiculos'
      ? 'Consulta disponibilidad en la biblioteca y aparta un espacio de estudio por horario sin traslapes.'
      : section.id === 'equipo'
        ? 'Solicita laptops, proyectores y material de apoyo con seguimiento de entrega y devolución.'
        : 'Agenda sesiones de tutoría impartidas por docentes y confirma tu asistencia desde el mismo sistema.',
}))

export function CardHome({
  title,
  description,
  image,
  imageAlt,
  href = '#',
  buttonLabel = 'Ir ahora',
  imagePosition = 'right',
}) {
  const isExternal = href.startsWith('http')
  const isImageLeft = imagePosition === 'left'

  const button = (
    <span className="button-primary mt-5 w-full sm:w-auto">
      {buttonLabel}
    </span>
  )

  const imageOrderClass = isImageLeft ? 'md:order-1' : 'md:order-2'
  const contentOrderClass = isImageLeft ? 'md:order-2' : 'md:order-1'

  const content = (
    <div
      className={`order-2 flex flex-1 flex-col justify-center p-6 text-left sm:p-8 ${contentOrderClass}`}
    >
      <h2 className="font-alverata text-lg font-semibold text-uach-purple-900 sm:text-2xl">
        {title}
      </h2>
      <p className="font-praxis mt-2 flex-1 text-sm leading-relaxed text-uach-purple-900/75 sm:mt-3 sm:text-base">
        {description}
      </p>

      {isExternal ? (
        <a href={href} className="inline-flex">
          {button}
        </a>
      ) : (
        <Link to={href} className="inline-flex">
          {button}
        </Link>
      )}
    </div>
  )

  const imageBlock = (
    <div
      className={`order-1 w-full shrink-0 bg-uach-purple-950 aspect-[5/3] md:aspect-auto ${imageOrderClass} md:w-[42%] md:min-w-[9.5rem] md:max-w-[24rem]`}
    >
      <img
        src={image}
        alt={imageAlt}
        className="h-full min-h-[12rem] w-full object-cover md:min-h-[15rem]"
      />
    </div>
  )

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-lg border border-uach-purple-900/15 bg-white shadow-md transition hover:shadow-lg md:min-h-[15rem] md:flex-row">
      {imageBlock}
      {content}
    </article>
  )
}

export function CardHomeGrid() {
  return (
    <section
      className="grid w-full grid-cols-1 gap-8 text-left"
      aria-label="Servicios disponibles"
    >
      {homeServices.map((service, index) => (
        <CardHome
          key={service.id}
          {...service}
          imagePosition={index % 2 === 0 ? 'right' : 'left'}
        />
      ))}
    </section>
  )
}
