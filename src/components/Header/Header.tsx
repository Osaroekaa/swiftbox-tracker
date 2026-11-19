import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/tracking', label: 'Track a shipment', end: false },
]

export default function Header() {
  const { pathname } = useLocation()
  // The menu only counts as open on the page it was opened on, so any
  // navigation (links or the back button) closes it. No effect needed.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null)

  return (
    <header>
      <Link to="/" onClick={() => setOpen(false)}>
        SwiftBox
      </Link>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? 'Close menu' : 'Menu'}
      </button>

      <nav id="primary-nav" aria-label="Primary">
        <ul>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.end} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}