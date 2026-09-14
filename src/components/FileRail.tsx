import { NavLink } from 'react-router-dom'

const links = [
  { to: '/reports', label: 'Reports' },
  { to: '/the-record', label: 'The Record' },
  { to: '/about', label: 'About' },
  { to: '/subscribe', label: 'Subscribe' },
]

export function FileRail() {
  return (
    <aside className="file-rail" aria-label="Primary navigation">
      <div className="rail-brand">
        <span className="rail-brand-chrome">FILE //</span>
        <strong>THE DONALD FILES</strong>
      </div>
      <nav className="rail-nav">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? 'rail-link active' : 'rail-link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="rail-foot">
        CASE FILE OPEN
        <br />
        CLASSIFICATION: PUBLIC
        <br />
        <span className="stamp-mini">ACTIVE</span>
      </div>
    </aside>
  )
}
