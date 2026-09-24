import { Link } from 'react-router-dom'
import { VideoEmbed } from '../VideoEmbed'
import { homeVideoExhibits } from '../../content/homeVideoExhibits'

/**
 * Hybrid-ugly home video slot for WH propaganda + UN blunder exhibits.
 * Wired even when empty: shows awaiting shell so Reed/Ink know where URLs land.
 */
export function VideoExhibitRail() {
  const items = homeVideoExhibits

  return (
    <section className="video-exhibit-rail" aria-label="Video exhibits">
      <div className="ugly-section-head">
        <h2>
          Video <span className="slash">/</span> Exhibit
        </h2>
        <span className="section-note">
          {items.length > 0
            ? `${String(items.length).padStart(2, '0')} SLOT · youtube-nocookie`
            : 'WIRED · awaiting Reed/Ink URLs'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="video-exhibit-empty">
          <div className="video-exhibit-empty-stamp">EXHIBIT SLOT</div>
          <p>
            Home video rail is wired. Drop{' '}
            <code>{'{ type: \'youtube\', id | youtubeUrl | embedUrl }'}</code> into{' '}
            <code>homeVideoExhibits</code> when WH / UN clip URLs arrive.
          </p>
        </div>
      ) : (
        <div className="video-exhibit-grid">
          {items.map((item) => (
            <div className="video-exhibit-card" key={item.tag + item.hed}>
              <VideoEmbed
                {...item.video}
                exhibitLabel={item.tag}
                variant="home"
              />
              <div className="video-exhibit-meta">
                <h3>{item.hed}</h3>
                <p>{item.note}</p>
                {item.reportSlug ? (
                  <div className="video-exhibit-links">
                    <Link to={`/reports/${item.reportSlug}`}>
                      Open dossier →
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
