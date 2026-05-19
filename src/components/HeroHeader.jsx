import { useEffect, useMemo, useState } from 'react'

const imageModules = import.meta.glob('@/assets/images/*.{webp,jpg,jpeg,png,gif}', {
  eager: true,
  import: 'default',
})

const heroImages = Object.keys(imageModules)
  .sort()
  .map((path) => imageModules[path])

export function HeroHeader() {
  const images = useMemo(() => heroImages, [])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return undefined

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <header className="relative w-full overflow-hidden">
      <div className="relative min-h-[300px] sm:min-h-[400px] lg:min-h-[480px]">
        {images.length > 0 ? (
          images.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Campus UACH ${index + 1}`}
              className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ease-in-out ${
                index === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))
        ) : (
          <div className="absolute inset-0 bg-uach-purple-900" />
        )}

        <div
          className="absolute inset-0 bg-linear-to-t from-uach-purple-950/90 via-uach-purple-900/50 to-uach-purple-950/60"
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-[300px] flex-col items-center justify-center px-6 py-12 text-center sm:min-h-[400px] sm:px-10 lg:min-h-[480px]">
          <h1 className="font-alverata max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Bienvenido al sistema de reservas de la UACH
          </h1>
          <p className="font-praxis mt-4 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
            Consulta la disponibilidad en tiempo real, reserva tu cubículo y solicita
            equipo de apoyo sin conflictos de horario.
          </p>
        </div>

        {images.length > 1 ? (
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
