import { NavLink, Outlet } from 'react-router-dom'

const nav = [
  { to: '/', label: 'Home', end: true },
  { to: '/reports', label: 'Reports' },
  { to: '/the-record', label: 'The Record' },
  { to: '/about', label: 'About' },
  { to: '/subscribe', label: 'Subscribe' },
]

export function Layout() {
  return (
    <div className="site">
      <header className="masthead">
        <div className="masthead-inner">
          <div className="brand">
            <NavLink to="/" className="brand-title">
              The Donald Files
            </NavLink>
            <p className="tagline">Brutal. Factual. Documented.</p>
          </div>
          <nav className="nav" aria-label="Primary">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <p>The Donald Files — Brutal. Factual. Documented.</p>
          <p className="footer-links">
            <a href="https://t.me/thedonaldfiles" target="_blank" rel="noreferrer">
              Telegram
            </a>
            {' · '}
            <NavLink to="/subscribe">Subscribe</NavLink>
            {' · '}
            <NavLink to="/subscribe">Support the Research</NavLink>
          </p>
        </div>
      </footer>
    </div>
  )
}
