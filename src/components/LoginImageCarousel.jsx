import { useEffect, useMemo, useState } from 'react'

const imageModules = import.meta.glob('@/assets/images/*.{webp,jpg,jpeg,png,gif}', {
  eager: true,
  import: 'default',
})

const carouselImages = Object.keys(imageModules)
  .sort()
  .map((path) => imageModules[path])

export function LoginImageCarousel({ className = '' }) {
  const images = useMemo(() => carouselImages, [])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return undefined

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  if (images.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-uach-purple-900 ${className}`}
      >
        <p className="text-sm text-white/50">Sin imágenes en assets/images</p>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Campus UACH ${index + 1}`}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ease-in-out ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-linear-to-t from-uach-purple-950/70 via-uach-purple-900/20 to-uach-purple-950/40" />

      {images.length > 1 ? (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
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
  )
}
