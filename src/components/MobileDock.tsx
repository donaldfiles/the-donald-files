import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Home', end: true },
  { to: '/reports', label: 'Reports', end: false },
  { to: '/the-record', label: 'Record', end: false },
  { to: '/subscribe', label: 'Subscribe', end: false },
]

export function MobileDock() {
  return (
    <nav className="mobile-dock" aria-label="Mobile navigation">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            isActive ? 'dock-link active' : 'dock-link'
          }
        >
          <span className="dock-dot" aria-hidden="true" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
