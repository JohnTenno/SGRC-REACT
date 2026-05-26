import { useEffect, useMemo, useState } from 'react'
import { QuickMenu } from '@/app/components/layout/QuickMenu'

const imageModules = import.meta.glob('@/assets/images/*.{webp,jpg,jpeg,png,gif}', {
  eager: true,
  import: 'default',
})

const heroImages = Object.keys(imageModules)
  .sort()
  .map((path) => imageModules[path])

const quickMenuHeightClass = 'min-h-[220px] sm:min-h-[280px]'
const heroHeightClass = 'min-h-[300px] sm:min-h-[400px] lg:min-h-[480px]'

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
  const showIndicators = !showQuickMenu && !image && images.length > 1

  useEffect(() => {
    if (showQuickMenu || images.length <= 1) return undefined

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [showQuickMenu, images.length])

  if (showQuickMenu) {
    return (
      <header className="relative w-full overflow-hidden bg-uach-purple-950">
        <div
          className={`relative ${quickMenuHeightClass} bg-linear-to-b from-uach-purple-900 via-uach-purple-950 to-uach-purple-950`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 right-0 size-72 rounded-full bg-uach-purple-600/35 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 left-0 size-56 rounded-full bg-uach-gold-400/10 blur-3xl"
          />
          <div
            className={`relative z-10 flex flex-col items-center justify-center px-6 py-10 sm:px-10 ${quickMenuHeightClass}`}
          >
            <QuickMenu />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="relative w-full overflow-hidden">
      <div className={`relative ${heroHeightClass}`}>
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
          className={`relative z-10 flex flex-col items-center justify-center px-6 py-10 text-center sm:px-10 ${heroHeightClass}`}
        >
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
