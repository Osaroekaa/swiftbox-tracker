import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>SwiftBox Couriers. Shipment tracking portal.</p>
      <p>&copy; {new Date().getFullYear()} SwiftBox Couriers</p>
    </footer>
  )
}