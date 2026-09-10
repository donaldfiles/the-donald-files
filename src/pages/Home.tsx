import { Link } from 'react-router-dom'
import { CategoryLabel } from '../components/CategoryLabel'
import { getPublishedArticles } from '../content/articles'

export function Home() {
  const published = getPublishedArticles()
  const featured = published[0]
  const rest = published.slice(1)

  return (
    <div className="page home">
      {featured ? (
        <section className="hero" aria-labelledby="hero-title">
          <CategoryLabel category={featured.category} />
          <h1 id="hero-title">
            <Link to={`/reports/${featured.slug}`}>{featured.title}</Link>
          </h1>
          <p className="dek">{featured.dek}</p>
          <p className="meta">{featured.date}</p>
          <Link className="btn btn-accent" to={`/reports/${featured.slug}`}>
            Read Report
          </Link>
        </section>
      ) : null}

      <section className="feed" aria-labelledby="feed-title">
        <h2 id="feed-title" className="section-title">
          Latest
        </h2>
        {rest.length === 0 && featured ? (
          <p className="dek">More reports will appear here as they publish.</p>
        ) : null}
        <ul className="article-list">
          {rest.map((item) => (
            <li key={item.slug} className="article-card">
              <CategoryLabel category={item.category} />
              <h3>
                <Link to={`/reports/${item.slug}`}>{item.title}</Link>
              </h3>
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
