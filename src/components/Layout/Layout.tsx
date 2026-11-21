import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'

export default function Layout() {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main">
        Skip to main content
      </a>
      <Header />
      <main id="main" className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}