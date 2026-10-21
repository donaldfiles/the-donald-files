import { Link } from 'react-router-dom'
import { VideoEmbed } from '../VideoEmbed'
import { homeVideoExhibits } from '../../content/homeVideoExhibits'

/** Home video rail: official clips tied to shipped reports. Renders nothing when empty. */
export function VideoExhibitRail() {
  const items = homeVideoExhibits
  if (items.length === 0) return null

  return (
    <section className="video-exhibit-rail" aria-label="Video exhibits">
      <div className="ugly-section-head">
        <h2>
          Video <span className="slash">/</span> Exhibit
        </h2>
        <span className="section-note">
          {items.length} {items.length === 1 ? 'clip' : 'clips'} · on the record
        </span>
      </div>

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
    </section>
  )
}
