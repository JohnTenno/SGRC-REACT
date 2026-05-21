import { Html5Qrcode } from 'html5-qrcode'
import { useEffect, useId, useRef, useState } from 'react'

/** Alinea vídeo/canvas dentro del marco cuadrado (html5-qrcode inyecta nodos en flujo normal). */
function applyScannerViewportLayout(hostId) {
  const root = document.getElementById(hostId)
  if (!root) return

  root.style.position = 'absolute'
  root.style.inset = '0'
  root.style.width = '100%'
  root.style.height = '100%'
  root.style.overflow = 'hidden'

  root.querySelectorAll(':scope > div').forEach((node) => {
    if (!(node instanceof HTMLElement)) return
    node.style.position = 'absolute'
    node.style.inset = '0'
    node.style.width = '100%'
    node.style.height = '100%'
    node.style.margin = '0'
    node.style.pointerEvents = 'none'
  })

  const video = root.querySelector('video')
  if (video instanceof HTMLVideoElement) {
    video.style.position = 'absolute'
    video.style.inset = '0'
    video.style.width = '100%'
    video.style.height = '100%'
    video.style.maxWidth = 'none'
    video.style.maxHeight = 'none'
    video.style.margin = '0'
    video.style.objectFit = 'cover'
    video.style.display = 'block'
  }

  root.querySelectorAll('canvas').forEach((canvas) => {
    canvas.style.position = 'absolute'
    canvas.style.left = '0'
    canvas.style.top = '0'
    canvas.style.width = '1px'
    canvas.style.height = '1px'
    canvas.style.margin = '0'
    canvas.style.opacity = '0'
    canvas.style.pointerEvents = 'none'
    canvas.style.overflow = 'hidden'
  })
}

/**
 * @param {object} props
 * @param {import('@/data/mockUserReservations').CubicleReservation} [props.reservation]
 * @param {(scannedPayload: string) => void | Promise<void>} props.onScanSuccess
 * @param {boolean} [props.isSubmitting]
 * @param {string} [props.regionIdPrefix]
 * @param {'light' | 'dark'} [props.variant]
 */
export function CheckInQrReader({
  reservation,
  onScanSuccess,
  isSubmitting = false,
  regionIdPrefix = 'check-in-qr-reader',
  variant = 'light',
}) {
  const reactId = useId()
  const regionId = `${regionIdPrefix}-${reactId.replace(/:/g, '')}`
  const scannerRef = useRef(null)
  const handledRef = useRef(false)
  const onScanSuccessRef = useRef(onScanSuccess)
  const isSubmittingRef = useRef(isSubmitting)
  const [cameraError, setCameraError] = useState(null)

  const isDark = variant === 'dark'

  onScanSuccessRef.current = onScanSuccess
  isSubmittingRef.current = isSubmitting

  useEffect(() => {
    handledRef.current = false
    setCameraError(null)
    let cancelled = false
    let scanner

    async function startScanner() {
      try {
        scanner = new Html5Qrcode(regionId)
        if (cancelled) return
        scannerRef.current = scanner

        // Sin qrbox: evita el overlay blanco (#ffffff) que dibuja html5-qrcode.
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, aspectRatio: 1 },
          async (decodedText) => {
            if (handledRef.current || isSubmittingRef.current) return
            handledRef.current = true
            await scanner.stop().catch(() => {})
            scanner.clear().catch(() => {})
            await onScanSuccessRef.current(decodedText)
          },
          () => {},
        )

        applyScannerViewportLayout(regionId)
      } catch (error) {
        if (cancelled) return
        setCameraError(
          error instanceof Error
            ? error.message
            : 'No se pudo acceder a la cámara.',
        )
      }
    }

    const mountTimer = window.setTimeout(() => {
      startScanner()
    }, 80)

    const root = document.getElementById(regionId)
    const layoutObserver =
      root &&
      new MutationObserver(() => {
        applyScannerViewportLayout(regionId)
      })
    layoutObserver?.observe(root, { childList: true, subtree: true })

    return () => {
      cancelled = true
      window.clearTimeout(mountTimer)
      layoutObserver?.disconnect()
      handledRef.current = true
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
        scannerRef.current.clear().catch(() => {})
        scannerRef.current = null
      }
    }
  }, [regionId])

  return (
    <div className="flex w-full flex-col gap-4">
      {cameraError ? (
        <p
          className={`font-praxis rounded-lg border px-4 py-3 text-sm ${
            isDark
              ? 'border-red-400/40 bg-red-950/50 text-red-100'
              : 'border-amber-200 bg-amber-50 text-amber-950'
          }`}
        >
          {cameraError}
        </p>
      ) : null}

      <div className="check-in-qr-reader relative mx-auto flex justify-center">
        <div className="check-in-qr-scanner-shell relative size-[min(72vw,280px)] shrink-0 overflow-hidden rounded-2xl bg-uach-purple-950">
          <div id={regionId} className="check-in-qr-reader__viewport" />

          <div
            className="pointer-events-none absolute inset-0 z-10 rounded-2xl border-2 border-uach-gold-400/90"
            aria-hidden="true"
          >
            <span className="absolute -top-1 -left-1 size-8 rounded-tl-xl border-t-4 border-l-4 border-uach-gold-400" />
            <span className="absolute -top-1 -right-1 size-8 rounded-tr-xl border-t-4 border-r-4 border-uach-gold-400" />
            <span className="absolute -bottom-1 -left-1 size-8 rounded-bl-xl border-b-4 border-l-4 border-uach-gold-400" />
            <span className="absolute -right-1 -bottom-1 size-8 rounded-br-xl border-r-4 border-b-4 border-uach-gold-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
