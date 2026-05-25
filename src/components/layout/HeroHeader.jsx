import { useEffect, useMemo, useState } from 'react'
import { QuickMenu } from '@/components/layout/QuickMenu'

const imageModules = import.meta.glob('@/assets/images/*.{webp,jpg,jpeg,png,gif}', {
  eager: true,
  import: 'default',
})

const heroImages = Object.keys(imageModules)
  .sort()
  .map((path) => imageModules[path])

/**
 * @param {object} [props]
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {string} [props.image] imagen fija de fondo (ej. cubículo seleccionado)
 * @param {string} [props.imageAlt]
 * @param {number} [props.capacity] capacidad máxima del espacio
 * @param {boolean} [props.showQuickMenu] solo menú rápido (sin título ni descripción)
 */
export function HeroHeader({
  title = 'Bienvenido al sistema de reservas de la UACH',
  description = 'Consulta la disponibilidad en tiempo real, reserva tu cubículo y solicita equipo de apoyo sin conflictos de horario.',
  image,
  imageAlt = '',
  capacity,
  showQuickMenu = false,
}) {
  const images = useMemo(() => (image ? [image] : heroImages), [image])
  const [activeIndex, setActiveIndex] = useState(0)
  const showIndicators = !image && images.length > 1
  const heightClass = showQuickMenu
    ? 'min-h-[220px] sm:min-h-[280px]'
    : 'min-h-[300px] sm:min-h-[400px] lg:min-h-[480px]'

  useEffect(() => {
    if (images.length <= 1) return undefined

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <header className="relative w-full overflow-hidden">
      <div className={`relative ${heightClass}`}>
        {images.length > 0 ? (
          <img
            key={images[activeIndex]}
            src={images[activeIndex]}
            alt={imageAlt || `Campus UACH ${activeIndex + 1}`}
            className="absolute inset-0 size-full object-cover transition-opacity duration-700 ease-in-out"
            decoding="async"
            fetchPriority="high"
          />
        ) : (
          <div className="absolute inset-0 bg-uach-purple-900" />
        )}

        <div
          className="absolute inset-0 bg-linear-to-t from-uach-purple-950/90 via-uach-purple-900/50 to-uach-purple-950/60"
          aria-hidden="true"
        />

        <div
          className={`relative z-10 flex flex-col items-center justify-center px-6 py-10 text-center sm:px-10 ${heightClass}`}
        >
          {showQuickMenu ? (
            <QuickMenu />
          ) : (
            <>
              <h1 className="font-alverata max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {title}
              </h1>
              <p className="font-praxis mt-4 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
                {description}
              </p>
              {capacity != null ? (
                <p className="font-praxis mt-3 text-sm font-medium text-uach-gold-400 sm:text-base">
                  Capacidad máxima:{' '}
                  <span className="font-semibold text-white">
                    {capacity} {capacity === 1 ? 'persona' : 'personas'}
                  </span>
                </p>
              ) : null}
            </>
          )}
        </div>

        {showIndicators ? (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`Ir a imagen ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`size-2.5 rounded-full transition ${
                  index === activeIndex
                    ? 'scale-110 bg-uach-gold-400'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </header>
  )
}
