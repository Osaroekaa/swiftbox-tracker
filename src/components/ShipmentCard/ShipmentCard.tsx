import type { Shipment, ShipmentStatus } from '../../services/shipmentTypes'
import styles from './ShipmentCard.module.css'

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  processing: 'Processing',
  picked_up: 'Picked up',
  in_transit: 'In transit',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
}

const formatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
const formatDate = (iso: string) => formatter.format(new Date(iso))

export default function ShipmentCard({ shipment }: { shipment: Shipment }) {
  const { id, status, currentLocation, origin, destination, estimatedDelivery, lastUpdated, history } =
    shipment

  return (
    <article className={styles.card} aria-labelledby="shipment-title">
      <header className={styles.header}>
        <div>
          <p className={styles.label}>Tracking number</p>
          <h2 id="shipment-title" className={styles.id}>
            {id}
          </h2>
        </div>
        <span className={styles.badge} data-status={status}>
          {STATUS_LABELS[status]}
        </span>
      </header>

      <dl className={styles.details}>
        <div>
          <dt>Current location</dt>
          <dd>{currentLocation}</dd>
        </div>
        <div>
          <dt>Route</dt>
          <dd>
            {origin} to {destination}
          </dd>
        </div>
        <div>
          <dt>Estimated delivery</dt>
          <dd>{formatDate(estimatedDelivery)}</dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>{formatDate(lastUpdated)}</dd>
        </div>
      </dl>

      <h3 className={styles.historyTitle}>History</h3>
      <ol className={styles.history}>
        {[...history].reverse().map((event) => (
          <li key={event.timestamp}>
            <strong>{STATUS_LABELS[event.status]}</strong>, {event.location}
            <span className={styles.time}>{formatDate(event.timestamp)}</span>
          </li>
        ))}
      </ol>
    </article>
  )
}