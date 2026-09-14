import { FightTicker } from '../components/home/FightTicker'
import { LoudMasthead } from '../components/home/LoudMasthead'
import { LeadBlast } from '../components/home/LeadBlast'
import { PastedCard } from '../components/home/PastedCard'
import { HostileList } from '../components/home/HostileList'
import { getPublishedReports } from '../content/articles'

/** Rage hierarchy (heat first) — existing reports only; no invented files. */
const RAGE_ORDER = [
  'truth-social-trump-dividend-5000-double-down',
  'iran-war-midterms-pickaxe-mountain',
  'doj-scotus-save-voter-verification',
  'trump-dividend-5000-gop-congress',
  'trump-west-wing-holiday-cash-gifts',
  'doj-scotus-nevada-us-attorney-chattah',
]

export function Reports() {
  const published = getPublishedReports()
  const bySlug = new Map(published.map((a) => [a.slug, a]))
  const ranked = RAGE_ORDER.map((s) => bySlug.get(s)).filter(
    (a): a is NonNullable<typeof a> => Boolean(a),
  )
  for (const a of published) {
    if (!ranked.find((r) => r.slug === a.slug)) ranked.push(a)
  }

  const lead = ranked[0]
  const pasted = ranked.slice(1)

  return (
    <div className="home-ugly">
      <FightTicker />
      <LoudMasthead />

      <div className="home-ugly-content">
        <div className="ugly-section-head reports-index-head">
          <h2>
            Open <span className="slash">/</span> Reports
          </h2>
          <span className="section-note">
            {String(ranked.length).padStart(2, '0')} FILES · heat over calendar
          </span>
        </div>

        {lead ? <LeadBlast article={lead} index={0} /> : null}

        {pasted.length > 0 ? (
          <>
            <div className="ugly-section-head">
              <h2>
                More <span className="slash">/</span> Stacked
              </h2>
              <span className="section-note">Pasted · crooked · manila scraps</span>
            </div>
            <div className="pasted-stack">
              {pasted.map((article, i) => (
                <PastedCard
                  key={article.slug}
                  article={article}
                  index={i + 1}
                  cream={i % 2 === 1}
                />
              ))}
            </div>
          </>
        ) : null}

        <HostileList articles={ranked} />
      </div>

      <footer className="site-foot">
        <div>
          <strong>THE DONALD FILES</strong> · reports index · hybrid ugly
        </div>
        <div>Article pages stay Open Dossier · manila / charcoal / #D1001F</div>
      </footer>
    </div>
  )
}
