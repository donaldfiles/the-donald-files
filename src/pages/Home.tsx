import { Link } from 'react-router-dom'
import { CaseCard } from '../components/CaseCard'
import { DossierMasthead } from '../components/DossierMasthead'
import { getPublishedArticles } from '../content/articles'

export function Home() {
  const published = getPublishedArticles()

  return (
    <div className="page home">
      <DossierMasthead fileLabel="HOME" />

      <div className="section-head">
        <h2>OPEN CASES //</h2>
        <span className="count">
          {String(published.length).padStart(2, '0')} FILES · STACKED
        </span>
      </div>

      <div className="dossier-stack">
        {published.map((item, i) => (
          <CaseCard
            key={item.slug}
            article={item}
            index={i}
            lead={i === 0}
          />
        ))}
      </div>

      <section className="telegram-block" aria-labelledby="tg-title">
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

      <section className="support-block" aria-labelledby="support-title">
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

      <p className="footer-note">
        The Donald Files — Brutal. Factual. Documented.
      </p>
    </div>
  )
}
