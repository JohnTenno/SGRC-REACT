import { useRef, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { EquipmentOrderExportTemplate } from '@/components/equipment/EquipmentOrderExportTemplate'
import { Navbar } from '@/components/layout/Navbar'
import {
  EQUIPMENT_PICKUP_LOCATION,
  EQUIPMENT_REQUEST_STATUS,
  getEquipmentRequestStatusLabel,
} from '@/lib/equipmentRentalApi'
import {
  downloadElementAsPdf,
  downloadElementAsPng,
} from '@/lib/exportOrderDocument'

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

function DownloadIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 3v12m0 0l4-4m-4 4L8 11" />
      <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
    </svg>
  )
}

export function RentaEquipoOrdenPage() {
  const location = useLocation()
  const order = location.state?.order
  const exportTemplateRef = useRef(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  if (!order?.id || !order?.items?.length) {
    return <Navigate to="/renta-de-equipo" replace />
  }

  const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const statusLabel = getEquipmentRequestStatusLabel(order.status)
  const isPendingPickup = order.status === EQUIPMENT_REQUEST_STATUS.PENDING_PICKUP
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
          <Link to="/renta-de-equipo" className="transition hover:text-uach-purple-900">
            Renta de equipo
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-uach-purple-900">Orden de solicitud</span>
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
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isPendingPickup
                    ? 'bg-amber-50 text-amber-800'
                    : 'bg-uach-purple-900/8 text-uach-purple-900/70'
                }`}
              >
                {statusLabel}
              </span>
            </div>
            {order.createdAt ? (
              <p className="font-praxis mt-2 text-sm capitalize text-uach-purple-900/60">
                {formatOrderDate(order.createdAt)}
              </p>
            ) : null}
          </header>

          <section className="mt-8 overflow-hidden rounded-xl border border-uach-purple-900/15 bg-white shadow-md">
            <div className="border-b border-uach-purple-900/10 bg-uach-purple-50/50 px-6 py-4">
              <h2 className="font-alverata text-lg font-semibold text-uach-purple-900">
                Material solicitado
              </h2>
            </div>

            <ul className="divide-y divide-uach-purple-900/10">
              {order.items.map((item) => (
                <li
                  key={item.id}
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
              <DownloadIcon />
              {isExporting ? 'Generando…' : 'Descargar imagen (PNG)'}
            </button>
            <button
              type="button"
              className="button-secondary gap-2"
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
            >
              <DownloadIcon />
              {isExporting ? 'Generando…' : 'Descargar PDF'}
            </button>
          </div>
          {exportError ? (
            <p className="font-praxis text-sm text-red-600" role="alert">
              {exportError}
            </p>
          ) : null}
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/renta-de-equipo"
            className="button-primary w-full text-center sm:w-auto sm:min-w-[14rem]"
          >
            Nueva solicitud
          </Link>
          <Link
            to="/home"
            className="button-secondary w-full text-center sm:w-auto sm:min-w-[14rem]"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  )
}
