import { Link } from 'react-router-dom'
import { FightTicker } from '../components/home/FightTicker'
import { LoudMasthead } from '../components/home/LoudMasthead'
import { LeadBlast } from '../components/home/LeadBlast'
import { PastedCard } from '../components/home/PastedCard'
import { TruthStrip } from '../components/home/TruthStrip'
import { MemeRail } from '../components/home/MemeRail'
import { HostileList } from '../components/home/HostileList'
import { getPublishedArticles } from '../content/articles'

/** Rage hierarchy (heat first) — uses existing articles only. */
const RAGE_ORDER = [
  'truth-social-dallas-beat-nfl',
  'truth-social-reflecting-pool-vandalism-primer',
  'truth-social-colossus-smithsonian-washington',
  'truth-social-trump-dividend-5000-double-down',
  'iran-war-midterms-pickaxe-mountain',
  'doj-scotus-save-voter-verification',
  'trump-dividend-5000-gop-congress',
  'trump-west-wing-holiday-cash-gifts',
  'doj-scotus-nevada-us-attorney-chattah',
]

export function Home() {
  const published = getPublishedArticles()
  const bySlug = new Map(published.map((a) => [a.slug, a]))
  const ranked = RAGE_ORDER.map((s) => bySlug.get(s)).filter(
    (a): a is NonNullable<typeof a> => Boolean(a),
  )
  // Any published article not in the rage list still appears (preserve all)
  for (const a of published) {
    if (!ranked.find((r) => r.slug === a.slug)) ranked.push(a)
  }

  const lead = ranked[0]
  const pasted = ranked.slice(1)
  const next = ranked[1] ?? lead

  return (
    <div className="home-ugly">
      <FightTicker />
      <LoudMasthead />

      <div className="home-ugly-content">
        {lead ? <LeadBlast article={lead} index={0} /> : null}

        {pasted.length > 0 ? (
          <>
            <div className="ugly-section-head">
              <h2>
                More <span className="slash">/</span> Reports
              </h2>
              <span className="section-note">Pasted · crooked · stacked</span>
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

        <TruthStrip />
        <MemeRail />
        <HostileList articles={ranked} />

        {next ? (
          <aside className="rage-dock" aria-label="Continue reading">
            <div>
              <div className="rage-dock-label">Next file · don’t scroll past</div>
              <div className="rage-dock-hed">{next.title}</div>
            </div>
            <Link className="rage-dock-btn" to={`/reports/${next.slug}`}>
              OPEN FILE
            </Link>
          </aside>
        ) : null}

        <section className="ugly-cta-block" aria-labelledby="tg-title">
          <h2 id="tg-title">Join on Telegram</h2>
          <p>Get alerts and document drops directly — no fluff, just the files.</p>
          <a
            className="btn btn-manila"
            href="https://t.me/thedonaldfiles"
            target="_blank"
            rel="noreferrer"
          >
            Join @thedonaldfiles
          </a>
        </section>

        <section className="ugly-cta-block" aria-labelledby="support-title">
          <h2 id="support-title">Subscribe / Support the Research</h2>
          <p>
            Keep independent documentation online. Buy the Report when it drops —
            never tip-jar theatre.
          </p>
          <div className="btn-row">
            <Link className="btn btn-stamp" to="/subscribe">
              Subscribe
            </Link>
            <Link className="btn btn-ghost" to="/subscribe">
              Support the Research
            </Link>
            <Link className="btn btn-ghost" to="/subscribe">
              Buy the Report
            </Link>
          </div>
        </section>
      </div>

      <footer className="site-foot">
        <div>
          <strong>THE DONALD FILES</strong> · hybrid home · articles stay Open
          Dossier
        </div>
        <div>Satire labeled · Exhibits A–C LIVE · homepage only</div>
      </footer>
    </div>
  )
}
