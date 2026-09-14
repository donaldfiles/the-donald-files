import { NavLink } from 'react-router-dom'

const links = [
  { to: '/reports', label: 'Reports' },
  { to: '/the-record', label: 'The Record' },
  { to: '/about', label: 'About' },
  { to: '/subscribe', label: 'Subscribe' },
]

export function LoudMasthead() {
  return (
    <header className="loud-masthead">
      <div className="loud-masthead-inner">
        <div className="brand-block">
          <div className="brand-kicker">HOSTILE ARCHIVE · NOT A NEWSROOM</div>
          <div className="brand">
            THE <em>DONALD</em> FILES
          </div>
          <p className="loud-tagline">
            <strong>Anti-prestige.</strong> Documented heat. No soft focus.
          </p>
        </div>
        <nav className="mast-nav" aria-label="Primary">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
