import escudoUach from '@/assets/escudo-color.png'
import {
  EQUIPMENT_PICKUP_LOCATION,
  EQUIPMENT_REQUEST_STATUS,
  getEquipmentRequestStatusLabel,
} from '@/equipment/home/equipmentRentalApi'
import './equipmentOrderExport.css'

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

/** @param {{ order: import('@/equipment/home/equipmentRentalApi').EquipmentRentalRequest }} props */
export function EquipmentOrderExportTemplate({ order }) {
  const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const statusLabel = getEquipmentRequestStatusLabel(order.status)
  const isPendingPickup = order.status === EQUIPMENT_REQUEST_STATUS.PENDING_PICKUP
  const pickupLocation = order.pickupLocation ?? EQUIPMENT_PICKUP_LOCATION

  return (
    <article className="eq-export" data-equipment-order-export="">
      <header className="eq-export__brand">
        <img
          src={escudoUach}
          alt="Escudo Universidad Autónoma de Chihuahua"
          className="eq-export__logo"
          crossOrigin="anonymous"
        />
        <div className="eq-export__brand-text">
          <p className="eq-export__institution">Universidad Autónoma de Chihuahua</p>
          <p className="eq-export__system">Sistema de gestión de recursos — SGRC</p>
        </div>
      </header>

      <p className="eq-export__label">Solicitud registrada</p>
      <h1 className="eq-export__title">Tu orden de equipo</h1>

      <p className="eq-export__meta">
        Folio de solicitud: <span className="eq-export__folio">{order.id}</span>
        {isPendingPickup ? (
          <span className="eq-export__badge">{statusLabel}</span>
        ) : (
          <span className="eq-export__badge" style={{ background: '#f4f0fa', color: '#2d1654' }}>
            {statusLabel}
          </span>
        )}
      </p>

      {order.createdAt ? (
        <p className="eq-export__date">{formatOrderDate(order.createdAt)}</p>
      ) : null}

      <section className="eq-export__card">
        <h2 className="eq-export__card-head">Material solicitado</h2>
        <table className="eq-export__table">
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="eq-export__item-thumb">
                  <div className="eq-export__item-image-wrap">
                    <img
                      src={item.image}
                      alt={item.imageAlt ?? item.type}
                      className="eq-export__item-image"
                      width={64}
                      height={64}
                      crossOrigin="anonymous"
                    />
                  </div>
                </td>
                <td className="eq-export__item-name">{item.type}</td>
                <td className="eq-export__item-qty">
                  {item.quantity} {item.quantity === 1 ? 'unidad' : 'unidades'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="eq-export__card-foot">
          Total: {totalUnits} {totalUnits === 1 ? 'unidad' : 'unidades'}
        </p>
      </section>

      <section className="eq-export__pickup">
        <h2 className="eq-export__pickup-title">¿Dónde recoger tu equipo?</h2>
        <p className="eq-export__pickup-place">{pickupLocation}</p>
        <p className="eq-export__pickup-note">
          Presenta esta orden en el mostrador. El personal validará tu solicitud y te
          entregará el material.
        </p>
      </section>
    </article>
  )
}
