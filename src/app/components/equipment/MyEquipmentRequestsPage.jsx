import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/app/components/layout/Navbar'
import { MyEquipmentRequestCard } from '@/app/components/equipment/MyEquipmentRequestCard'
import { splitEquipmentRequests } from '@/app/components/equipment/equipmentRequestTimeline'
import { useRefetchOnWindowFocus } from '@/app/hooks/useRefetchOnWindowFocus'
import { fetchMyEquipmentRentalRequests } from '@/app/services/equipment/requests.service'

function EquipmentRequestsSection({ title, description, requests, emptyMessage }) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-alverata text-xl font-semibold text-uach-purple-900">{title}</h2>
        <p className="font-praxis mt-1 text-sm text-uach-purple-900/65">{description}</p>
      </div>

      {requests.length === 0 ? (
        <p className="font-praxis rounded-xl border border-dashed border-uach-purple-900/20 bg-uach-purple-50/40 px-5 py-8 text-center text-sm text-uach-purple-900/60">
          {emptyMessage}
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {requests.map((request) => (
            <li key={request.id}>
              <MyEquipmentRequestCard request={request} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function MyEquipmentRequestsPage() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const loadRequests = useCallback(async () => {
    setErrorMessage(null)
    try {
      const data = await fetchMyEquipmentRentalRequests()
      setRequests(data)
    } catch (error) {
      setErrorMessage(
        error?.message ?? 'No se pudieron cargar tus solicitudes de equipo. Intenta de nuevo.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    setIsLoading(true)
    loadRequests()
  }, [loadRequests])

  useRefetchOnWindowFocus(loadRequests)

  const { active, past } = useMemo(() => splitEquipmentRequests(requests), [requests])

  const hasNoRequests =
    !isLoading && !errorMessage && active.length === 0 && past.length === 0

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="page-shell flex flex-1 flex-col gap-8 py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-alverata text-2xl font-semibold text-uach-purple-900 sm:text-3xl">
              Mi equipo
            </h1>
            <p className="font-praxis mt-2 max-w-2xl text-uach-purple-900/70">
              El estatus lo actualiza el personal de biblioteca cuando recoges o devuelves el
              material. Si acabas de devolver equipo, vuelve a abrir esta página para ver el cambio.
            </p>
          </div>
          <Link
            to="/equipment-rental"
            className="button-primary w-full shrink-0 sm:w-auto sm:min-w-[12rem]"
          >
            Nueva solicitud
          </Link>
        </header>

        {isLoading ? (
          <div className="flex flex-col gap-4" aria-busy="true" aria-label="Cargando solicitudes">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-xl bg-uach-purple-900/8"
              />
            ))}
          </div>
        ) : null}

        {errorMessage ? (
          <p className="font-praxis rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}

        {hasNoRequests ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-uach-purple-900/20 bg-uach-purple-50/30 px-6 py-16 text-center">
            <p className="font-alverata text-lg font-semibold text-uach-purple-900">
              Aún no tienes solicitudes de equipo
            </p>
            <p className="font-praxis max-w-md text-sm text-uach-purple-900/65">
              Cuando solicites material en renta de equipo, aparecerá aquí con su folio y estatus.
            </p>
            <Link to="/equipment-rental" className="button-primary mt-2">
              Solicitar equipo
            </Link>
          </div>
        ) : null}

        {!isLoading && !errorMessage && !hasNoRequests ? (
          <div className="flex flex-col gap-10">
            <EquipmentRequestsSection
              title="Solicitudes activas"
              description="Pendientes de recoger o con equipo en tu posesión (aún no devuelto)."
              requests={active}
              emptyMessage="No tienes solicitudes activas."
            />

            <EquipmentRequestsSection
              title="Historial"
              description="Solicitudes cerradas tras la devolución confirmada por biblioteca."
              requests={past}
              emptyMessage="Tu historial aparecerá aquí."
            />
          </div>
        ) : null}
      </main>
    </div>
  )
}
