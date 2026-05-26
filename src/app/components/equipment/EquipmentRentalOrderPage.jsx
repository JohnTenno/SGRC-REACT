import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { IconChevron, IconDownload } from '@/app/components/common/icons'
import { EquipmentOrderExportTemplate } from '@/app/components/equipment/EquipmentOrderExportTemplate'
import {
  getEquipmentRequestStatusBannerClass,
  getEquipmentRequestStatusMessage,
} from '@/app/components/equipment/equipmentRequestTimeline'
import { Navbar } from '@/app/components/layout/Navbar'
import { useRefetchOnWindowFocus } from '@/app/hooks/useRefetchOnWindowFocus'
import {
  EQUIPMENT_REQUEST_STATUS_BADGE_CLASS,
  EQUIPMENT_REQUEST_STATUS,
  getEquipmentRequestStatusLabel,
} from '@/app/components/equipment/equipmentRequestStatus'
import {
  fetchEquipmentRentalRequestById,
  formatEquipmentRequestDate,
} from '@/app/services/equipment/requests.service'
import { EQUIPMENT_PICKUP_LOCATION } from '@/app/services/equipment/rental.service'
import {
  downloadElementAsPdf,
  downloadElementAsPng,
} from '@/app/utilities/exportDocument'

function formatOrderDate(isoDate) {
  return new Date(isoDate).toLocaleString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function EquipmentRentalOrderPage() {
  const { requestId } = useParams()
  const location = useLocation()
  const stateOrder = location.state?.order
  const parsedId = Number(requestId)
  const exportTemplateRef = useRef(null)
  const [order, setOrder] = useState(() =>
    stateOrder?.id === parsedId && stateOrder?.items?.length ? stateOrder : null,
  )
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  const loadOrder = useCallback(async () => {
    if (!Number.isInteger(parsedId) || parsedId < 1) {
      setLoadError('Folio de solicitud no válido.')
      setIsLoading(false)
      return
    }

    setLoadError(null)
    try {
      const data = await fetchEquipmentRentalRequestById(parsedId)
      setOrder(data)
    } catch (error) {
      setLoadError(error?.message ?? 'No se pudo cargar la solicitud.')
      setOrder(null)
    } finally {
      setIsLoading(false)
    }
  }, [parsedId])

  useEffect(() => {
    setIsLoading(true)
    loadOrder()
  }, [loadOrder])

  useRefetchOnWindowFocus(loadOrder)

  if (!requestId) {
    return <Navigate to="/my-equipment-requests" replace />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="page-shell flex flex-1 flex-col justify-center py-16">
          <p className="font-praxis text-center text-sm text-uach-purple-900/65" aria-busy="true">
            Cargando tu orden…
          </p>
        </main>
      </div>
    )
  }

  if (loadError || !order?.id || !order?.items?.length) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="page-shell flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="font-praxis text-sm text-red-600" role="alert">
            {loadError ?? 'No se encontró la solicitud.'}
          </p>
          <Link to="/my-equipment-requests" className="button-primary">
            Ir a mi equipo
          </Link>
        </main>
      </div>
    )
  }

  const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const statusLabel = getEquipmentRequestStatusLabel(order.status)
  const statusMessage = getEquipmentRequestStatusMessage(order.status)
  const statusBannerClass = getEquipmentRequestStatusBannerClass(order.status)
  const statusBadgeClass =
    EQUIPMENT_REQUEST_STATUS_BADGE_CLASS[order.status] ??
    'bg-uach-purple-900/8 text-uach-purple-900/70'
  const isPendingPickup = order.status === EQUIPMENT_REQUEST_STATUS.PENDING_PICKUP
  const isAwaitingReturn = order.status === EQUIPMENT_REQUEST_STATUS.AWAITING_RETURN
  const isCompleted = order.status === EQUIPMENT_REQUEST_STATUS.COMPLETED
  const exportBaseName = `solicitud-equipo-folio-${order.id}`

  async function handleExport(type) {
    const element = exportTemplateRef.current?.querySelector('[data-equipment-order-export]')
    if (!element || isExporting) return

    setExportError(null)
    setIsExporting(true)

    try {
      if (type === 'png') {
        await downloadElementAsPng(element, exportBaseName)
      } else {
        await downloadElementAsPdf(element, exportBaseName)
      }
    } catch (error) {
      console.error('Error al exportar comprobante:', error)
      setExportError('No se pudo generar el archivo. Intenta de nuevo.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div
        ref={exportTemplateRef}
        className="equipment-order-export-host"
        aria-hidden="true"
      >
        <EquipmentOrderExportTemplate order={order} />
      </div>

      <main className="page-shell flex flex-1 flex-col gap-8 py-8">
        <nav className="font-praxis text-sm text-uach-purple-900/60" aria-label="Ruta">
          <Link to="/home" className="transition hover:text-uach-purple-900">
            Inicio
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <Link
            to="/my-equipment-requests"
            className="transition hover:text-uach-purple-900"
          >
            Mi equipo
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-uach-purple-900">Orden #{order.id}</span>
        </nav>

        <div aria-label="Comprobante de solicitud de equipo">
          <header>
            <p className="font-praxis text-sm font-medium uppercase tracking-wide text-uach-gold-600">
              Solicitud registrada
            </p>
            <h1 className="font-alverata mt-2 text-2xl font-semibold text-uach-purple-900 sm:text-3xl">
              Tu orden de equipo
            </h1>
            <div className="font-praxis mt-3 flex flex-wrap items-center gap-3 text-uach-purple-900/70">
              <p>
                Folio de solicitud:{' '}
                <span className="font-alverata text-lg font-semibold text-uach-purple-900">
                  {order.id}
                </span>
              </p>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeClass}`}
              >
                {statusLabel}
              </span>
            </div>
            {order.createdAt ? (
              <p className="font-praxis mt-2 text-sm capitalize text-uach-purple-900/60">
                {formatOrderDate(order.createdAt)}
              </p>
            ) : null}
            {order.statusUpdatedAt ? (
              <p className="font-praxis mt-1 text-xs text-uach-purple-900/55">
                Estatus actualizado: {formatEquipmentRequestDate(order.statusUpdatedAt)}
              </p>
            ) : null}
          </header>

          {statusMessage ? (
            <section
              className={`mt-6 rounded-xl border p-5 font-praxis text-sm leading-relaxed ${statusBannerClass}`}
              role="status"
            >
              <p className="font-alverata font-semibold">{statusLabel}</p>
              <p className="mt-2">{statusMessage}</p>
            </section>
          ) : null}

          <section className="mt-8 overflow-hidden rounded-xl border border-uach-purple-900/15 bg-white shadow-md">
            <div className="border-b border-uach-purple-900/10 bg-uach-purple-50/50 px-6 py-4">
              <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">
                Material solicitado
              </h2>
            </div>

            <ul className="divide-y divide-uach-purple-900/10">
              {order.items.map((item) => (
                <li
                  key={item.id ?? item.type}
                  className="font-praxis flex items-center justify-between gap-4 px-6 py-4 text-sm"
                >
                  <span className="font-medium text-uach-purple-900">{item.type}</span>
                  <span className="shrink-0 tabular-nums text-uach-purple-900/80">
                    {item.quantity} {item.quantity === 1 ? 'unidad' : 'unidades'}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-uach-purple-900/10 bg-uach-purple-50/30 px-6 py-4">
              <p className="font-praxis text-sm font-semibold text-uach-purple-900">
                Total: {totalUnits} {totalUnits === 1 ? 'unidad' : 'unidades'}
              </p>
            </div>
          </section>

          {isPendingPickup ? (
            <section className="mt-8 rounded-xl border-2 border-uach-gold-500/40 bg-uach-gold-400/10 p-6">
              <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">
                ¿Dónde recoger tu equipo?
              </h2>
              <p className="font-praxis mt-3 text-base leading-relaxed text-uach-purple-900">
                {order.pickupLocation ?? EQUIPMENT_PICKUP_LOCATION}
              </p>
              <p className="font-praxis mt-3 text-sm text-uach-purple-900/65">
                Presenta esta orden en el mostrador. El personal validará tu solicitud y te
                entregará el material.
              </p>
            </section>
          ) : null}

          {isAwaitingReturn ? (
            <section className="mt-8 rounded-xl border-2 border-sky-300/50 bg-sky-50 p-6">
              <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">
                Devolución pendiente
              </h2>
              <p className="font-praxis mt-3 text-base leading-relaxed text-uach-purple-900">
                Entrega el equipo en {order.pickupLocation ?? EQUIPMENT_PICKUP_LOCATION}. Cuando el
                administrador confirme la devolución, el estatus pasará a completada.
              </p>
            </section>
          ) : null}

          {isCompleted ? (
            <section className="mt-8 rounded-xl border-2 border-emerald-300/50 bg-emerald-50 p-6">
              <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">
                Solicitud completada
              </h2>
              <p className="font-praxis mt-3 text-base leading-relaxed text-uach-purple-900">
                La biblioteca registró la devolución de tu equipo. Esta orden quedó cerrada.
              </p>
            </section>
          ) : null}
        </div>

        <section className="flex flex-col gap-3" aria-label="Descargar comprobante">
          <p className="font-praxis text-sm font-medium text-uach-purple-900">
            Descargar comprobante
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              className="button-secondary gap-2"
              onClick={() => handleExport('png')}
              disabled={isExporting}
            >
              <IconDownload className="size-4 shrink-0" aria-hidden />
              {isExporting ? 'Generando…' : 'Descargar imagen (PNG)'}
            </button>
            <button
              type="button"
              className="button-secondary gap-2"
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
            >
              <IconDownload className="size-4 shrink-0" aria-hidden />
              {isExporting ? 'Generando…' : 'Descargar PDF'}
            </button>
          </div>
          {exportError ? (
            <p className="font-praxis text-sm text-red-600" role="alert">
              {exportError}
            </p>
          ) : null}
        </section>

        <Link
          to="/my-equipment-requests"
          className="button-primary inline-flex w-full items-center justify-center gap-2 sm:w-auto sm:min-w-[10rem]"
        >
          <IconChevron direction="left" className="size-5 shrink-0" aria-hidden />
          Volver
        </Link>
      </main>
    </div>
  )
}
