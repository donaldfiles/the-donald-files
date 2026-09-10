import { Link } from 'react-router-dom'
import { CategoryLabel } from '../components/CategoryLabel'

const stubs = [
  {
    id: 1,
    category: 'REPORTS' as const,
    title: 'Featured investigation — placeholder',
    dek: 'A long-form report stub. Replace with live Supabase content.',
    date: '2026-09-01',
  },
  {
    id: 2,
    category: 'ANALYSIS' as const,
    title: 'What the numbers actually show',
    dek: 'Analysis stub for the home feed.',
    date: '2026-08-28',
  },
  {
    id: 3,
    category: 'TIMELINE' as const,
    title: 'Key dates on The Record',
    dek: 'Timeline excerpt stub.',
    date: '2026-08-20',
  },
  {
    id: 4,
    category: 'OPINION' as const,
    title: 'Why documentation matters',
    dek: 'Opinion stub — clearly labelled.',
    date: '2026-08-15',
  },
]

export function Home() {
  const [featured, ...rest] = stubs

  return (
    <div className="page home">
      <section className="hero" aria-labelledby="hero-title">
        <CategoryLabel category={featured.category} />
        <h1 id="hero-title">{featured.title}</h1>
        <p className="dek">{featured.dek}</p>
        <p className="meta">{featured.date}</p>
        <Link className="btn btn-accent" to="/reports">
          Read Reports
        </Link>
      </section>

      <section className="feed" aria-labelledby="feed-title">
        <h2 id="feed-title" className="section-title">
          Latest
        </h2>
        <ul className="article-list">
          {rest.map((item) => (
            <li key={item.id} className="article-card">
              <CategoryLabel category={item.category} />
              <h3>{item.title}</h3>
              <p className="dek">{item.dek}</p>
              <p className="meta">{item.date}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="telegram-block" aria-labelledby="tg-title">
        <h2 id="tg-title">Join on Telegram</h2>
        <p>
          Get alerts and document drops directly — no fluff, just the files.
        </p>
        <a
          className="btn btn-secondary"
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
          never a tip jar theatre.
        </p>
        <div className="btn-row">
          <Link className="btn btn-accent" to="/subscribe">
            Subscribe
          </Link>
          <Link className="btn btn-outline" to="/subscribe">
            Support the Research
          </Link>
          <Link className="btn btn-outline" to="/subscribe">
            Buy the Report
          </Link>
        </div>
      </section>
    </div>
  )
}
