import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { QRCode } from 'react-qr-code'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

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

function parseEndTimeMs(endTimeStr) {
  const parts = endTimeStr.split(':').map(Number)
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), parts[0], parts[1], parts[2] ?? 0).getTime()
}

function formatRemaining(secs) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function LobbyCheckInQrPage() {
  const { cubicleId } = useParams()
  const numericId = Number(cubicleId)
  const qrSize = useQrDisplaySize()

  const [qrToken, setQrToken] = useState(null)
  const [loadError, setLoadError] = useState(null)

  // { studentName: string, endTimeMs: number, endTimeLabel: string }
  const [activeSession, setActiveSession] = useState(null)
  const [remaining, setRemaining] = useState(0)

  const intervalRef = useRef(null)

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
    if (!Number.isInteger(numericId) || numericId < 1) return

    fetch(`/api/cubicles/${numericId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Cubículo no encontrado')
        return res.json()
      })
      .then(async (data) => {
        setQrToken(data.qrToken)
        if (data.status === 'OCCUPIED') {
          const sessionRes = await fetch(`/api/cubicles/${numericId}/active-session`)
          if (sessionRes.ok) {
            const session = await sessionRes.json()
            setActiveSession({
              studentName: session.studentName ?? '',
              endTimeMs: parseEndTimeMs(session.endTime),
              endTimeLabel: String(session.endTime).slice(0, 5),
            })
          }
        }
      })
      .catch((err) => setLoadError(err.message ?? 'Error al cargar el cubículo'))
  }, [numericId])

  useEffect(() => {
    if (!Number.isInteger(numericId) || numericId < 1) return

    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/cubicle/${numericId}`, (message) => {
          try {
            const payload = JSON.parse(message.body)
            if (payload.event === 'CHECKED_IN' && payload.endTime) {
              const endTimeMs = parseEndTimeMs(payload.endTime)
              setActiveSession({
                studentName: payload.studentName ?? '',
                endTimeMs,
                endTimeLabel: String(payload.endTime).slice(0, 5),
              })
            } else if (payload.event === 'CHECKED_OUT' || payload.event === 'NO_SHOW') {
              setActiveSession(null)
            }
          } catch {
            // ignore malformed frames
          }
        })
      },
    })

    client.activate()

    return () => { client.deactivate() }
  }, [numericId])

  useEffect(() => {
    clearInterval(intervalRef.current)

    if (!activeSession) {
      return
    }

    function tick() {
      const secs = Math.max(0, Math.floor((activeSession.endTimeMs - Date.now()) / 1000))
      setRemaining(secs)
    }

    tick()
    intervalRef.current = setInterval(tick, 1000)
    return () => clearInterval(intervalRef.current)
  }, [activeSession])

  if (!Number.isInteger(numericId) || numericId < 1 || loadError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <p className="font-praxis text-sm text-gray-400">
          {loadError ?? 'ID de cubículo inválido'}
        </p>
      </div>
    )
  }

  if (!qrToken) {
    return <div className="fixed inset-0 bg-white" aria-hidden="true" />
  }

  if (activeSession) {
    return (
      <main className="fixed inset-0 flex flex-col items-center justify-center gap-8 bg-uach-purple-950 px-6">
        <p className="font-praxis text-xs uppercase tracking-[0.25em] text-uach-gold-400/70">
          Sesión activa
        </p>

        {activeSession.studentName ? (
          <p className="font-alverata text-center text-2xl font-semibold text-white sm:text-3xl">
            {activeSession.studentName}
          </p>
        ) : null}

        {remaining > 0 ? (
          <>
            <div
              className="font-alverata tabular-nums text-[clamp(4rem,20vw,9rem)] font-bold leading-none text-uach-gold-400"
              aria-label={`Tiempo restante: ${formatRemaining(remaining)}`}
            >
              {formatRemaining(remaining)}
            </div>
            <p className="font-praxis text-sm text-white/40">
              Finaliza a las {activeSession.endTimeLabel}
            </p>
          </>
        ) : (
          <p className="font-alverata text-2xl font-semibold text-white/50">
            Sesión finalizada
          </p>
        )}
      </main>
    )
  }

  return (
    <main
      className="fixed inset-0 flex items-center justify-center bg-white"
      aria-label="Código QR de check-in"
    >
      <QRCode
        value={qrToken}
        size={qrSize}
        level="M"
        bgColor="#FFFFFF"
        fgColor="#000000"
      />
    </main>
  )
}
