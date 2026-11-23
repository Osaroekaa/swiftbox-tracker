import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'

export default function Layout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const lastPath = useRef(pathname)

  // After navigating to another page, move keyboard focus to the new content,
  // so keyboard and screen reader users do not stay stuck on the nav link.
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname
      mainRef.current?.focus()
    }
  }, [pathname])

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main">
        Skip to main content
      </a>
      <Header />
      <main id="main" ref={mainRef} className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}