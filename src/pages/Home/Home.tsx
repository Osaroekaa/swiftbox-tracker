import { Link } from 'react-router-dom'
import styles from './Home.module.css'

export default function Home() {
  return (
    <section className={styles.hero}>
      <h1>Know where your parcel is, right now.</h1>
      <p>Enter your tracking number to see the latest status of your SwiftBox delivery.</p>
      <Link to="/tracking" className={styles.cta}>
        Track a shipment
      </Link>
    </section>
  )
}