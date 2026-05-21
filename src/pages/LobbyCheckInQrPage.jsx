import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { QRCode } from 'react-qr-code'
import { getActiveLobbyReservation } from '@/lib/reservationTimeline'

const LOBBY_QR_REFRESH_MS = 1000

function useQrDisplaySize() {
  const [size, setSize] = useState(280)

  useEffect(() => {
    function update() {
      const side = Math.min(window.innerWidth, window.innerHeight)
      setSize(Math.max(200, Math.floor(side * 0.86)))
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return size
}

/** Valor provisional del QR en tablet (sin tokens; solo UI). */
function buildLobbyQrValue(reservation) {
  return `SGRC-LOBBY:${reservation.cubicleId}:${reservation.id}`
}

/**
 * Tablet en la puerta del cubículo: solo el QR de la reserva activa en este momento.
 * URL: /entrada/1 · /entrada/2 · /entrada/3
 */
export function LobbyCheckInQrPage() {
  const { cubicleId } = useParams()
  const numericId = Number(cubicleId)
  const [payload, setPayload] = useState(null)
  const qrSize = useQrDisplaySize()

  useEffect(() => {
    document.title = 'Check-in'
    const html = document.documentElement
    const { body } = document

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.margin = '0'

    return () => {
      html.style.overflow = ''
      body.style.overflow = ''
      body.style.margin = ''
    }
  }, [])

  useEffect(() => {
    if (!Number.isInteger(numericId) || numericId < 1) {
      setPayload(null)
      return undefined
    }

    function refresh() {
      const active = getActiveLobbyReservation(numericId)
      setPayload(active ? buildLobbyQrValue(active) : null)
    }

    refresh()
    const timer = window.setInterval(refresh, LOBBY_QR_REFRESH_MS)
    return () => window.clearInterval(timer)
  }, [numericId])

  if (!payload) {
    return <div className="lobby-qr-screen fixed inset-0 bg-white" aria-hidden="true" />
  }

  return (
    <main
      className="lobby-qr-screen fixed inset-0 flex items-center justify-center bg-white"
      aria-label="Código QR de check-in"
    >
      <QRCode
        key={payload}
        value={payload}
        size={qrSize}
        level="M"
        bgColor="#FFFFFF"
        fgColor="#000000"
      />
    </main>
  )
}
