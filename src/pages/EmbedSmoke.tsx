import { Link } from 'react-router-dom'
import { VideoEmbed } from '../components/VideoEmbed'
import { SMOKE_YT_ID } from '../content/homeVideoExhibits'
import { toNocookieEmbedUrl } from '../lib/youtube'

/**
 * Temporary fixture page — proves youtube-nocookie iframe + CSP on pages.dev.
 * Ink: replace home/article URLs; this route can be removed later.
 */
export function EmbedSmoke() {
  const src = toNocookieEmbedUrl({ id: SMOKE_YT_ID })

  return (
    <div className="page embed-smoke-page">
      <header className="page-header">
        <p className="kicker-mono">ENGINEERING FIXTURE · NOT A DOSSIER</p>
        <h1>Embed path smoke test</h1>
        <p className="dek">
          Confirms responsive iframe →{' '}
          <code>youtube-nocookie.com/embed/{SMOKE_YT_ID}</code>. Official White
          House YouTube channel ID used as a public placeholder only — Ink
          replaces real WH/UN URLs in articles + home rail.
        </p>
      </header>

      <VideoEmbed
        type="youtube"
        id={SMOKE_YT_ID}
        title="White House channel (smoke-test placeholder)"
        caption="MOCK EXHIBIT · path proof · not desk evidence"
        exhibitLabel="SMOKE · MOCK EXHIBIT"
        variant="dossier"
      />

      <p className="embed-smoke-meta">
        Resolved src: <code>{src}</code>
      </p>
      <p>
        <Link to="/">← Home</Link>
        {' · '}
        <Link to={`/reports/embed-path-smoke-test`}>Open Dossier fixture →</Link>
      </p>
    </div>
  )
}
