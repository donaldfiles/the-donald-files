import { Outlet, useLocation } from 'react-router-dom'
import { FileRail } from './FileRail'
import { MobileDock } from './MobileDock'

export function Layout() {
  const { pathname } = useLocation()
  // Loud hybrid feed: home + /reports index (not article slugs)
  const isLoudFeed =
    pathname === '/' || pathname === '/reports' || pathname === '/reports/'
  const isArticle = /^\/reports\/[^/]+/.test(pathname)

  if (isLoudFeed) {
    return (
      <div className="app-shell app-shell-home">
        <Outlet />
        <MobileDock />
      </div>
    )
  }

  return (
    <div className={`app-shell${isArticle ? ' app-shell-article' : ''}`}>
      <div className="shell-grid">
        <FileRail />
        <main className="main-col">
          <Outlet />
        </main>
      </div>
      <MobileDock />
    </div>
  )
}
