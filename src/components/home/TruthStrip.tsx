import { Link } from 'react-router-dom'

type Exhibit = {
  tag: string
  handle: string
  handleNote: string
  body: string
  foot: string
  live?: boolean
  permalink?: string
  reportSlug?: string
}

const EXHIBITS: Exhibit[] = [
  {
    tag: 'EXHIBIT A · LIVE',
    handle: '@realDonaldTrump',
    handleNote: '11 Sep 2026 · 3:08 PM ET',
    body: '“The $5,000 Trump Dividend… is being criticized by “Dumocrats” who are hoping that it never happens — But it will! … The $5,000 Dividend will happen… VOTE REPUBLICAN — MAKE AMERICA GREAT AGAIN!”',
    foot: 'EXHIBIT · sourced pull · UCSB archive cited',
    live: true,
    permalink: 'https://truthsocial.com/@realDonaldTrump/117253978301857789',
    reportSlug: 'truth-social-trump-dividend-5000-double-down',
  },
  {
    tag: 'EXHIBIT B · LIVE',
    handle: '@realDonaldTrump',
    handleNote: '11 Sep 2026 · 10:31 PM ET',
    body: '“[Smithsonian] Mount a five-year George Washington exhibition… Erect a 30-foot Colossus statue… Center for American Heroes… Thank you for your attention to this matter! President DONALD J. TRUMP”',
    foot: 'EXHIBIT · sourced pull · UCSB archive cited',
    live: true,
    permalink: 'https://truthsocial.com/@realDonaldTrump/117255718355537976',
    reportSlug: 'truth-social-colossus-smithsonian-washington',
  },
  {
    tag: 'EXHIBIT C · LIVE',
    handle: '@realDonaldTrump',
    handleNote: '13 Sep 2026 · 5:06 AM EDT',
    body: '“[RT @interiorpress47] …avoid doing any real reporting on all the vandalism… 342 feet of razor blade slashes… “8647” spray-painted in massive lettering…”',
    foot: 'EXHIBIT · sourced pull · contractor primer docs cited',
    live: true,
    permalink: 'https://truthsocial.com/@realDonaldTrump/117262936693023151',
    reportSlug: 'truth-social-reflecting-pool-vandalism-primer',
  },
]

export function TruthStrip() {
  return (
    <section className="truth-strip" aria-label="Truth Social exhibits">
      <div className="truth-head">
        <h2>Truth Social — In The Face</h2>
        <span className="truth-badge">EXHIBIT RAIL · 3 LIVE</span>
      </div>
      <div className="truth-rail">
        {EXHIBITS.map((ex) => (
          <div
            className={`truth-post${ex.live ? ' is-live' : ''}`}
            key={ex.tag}
          >
            <span className="exhibit-tag">{ex.tag}</span>
            <div className="truth-handle">
              <strong>{ex.handle}</strong> · {ex.handleNote}
            </div>
            <p className="truth-body">{ex.body}</p>
            {ex.live && ex.permalink && ex.reportSlug ? (
              <div className="truth-links">
                <a
                  href={ex.permalink}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Permalink →
                </a>
                <Link to={`/reports/${ex.reportSlug}`}>Open dossier →</Link>
              </div>
            ) : null}
            <div className="truth-foot">{ex.foot}</div>
          </div>
        ))}
      </div>
      <div className="mock-note">
        Exhibits A–C are LIVE sourced Truth Social pulls (permalink + cited
        archives/reporting). Not a live feed scrape, not an endorsement.
      </div>
    </section>
  )
}
