import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import styles from './Header.module.css'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/tracking', label: 'Track a shipment', end: false },
]

export default function Header() {
  const { pathname } = useLocation()
  // Remember the page the menu was opened on. The menu counts as open only
  // while we are still on that page, so navigating (links or back button)
  // closes it with no effect needed.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null)

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.mark} aria-hidden="true" />
          SwiftBox
        </Link>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close menu' : 'Menu'}
        </button>

        <nav
          id="primary-nav"
          aria-label="Primary"
          className={`${styles.nav} ${open ? styles.navOpen : ''}`}
        >
          <ul className={styles.list}>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ''}`
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}