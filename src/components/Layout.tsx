import { Outlet, useLocation } from 'react-router-dom'
import { FileRail } from './FileRail'
import { MobileDock } from './MobileDock'

export function Layout() {
  const { pathname } = useLocation()
  const isArticle = /^\/reports\/[^/]+/.test(pathname)

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
