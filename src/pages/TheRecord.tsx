import { PostLink } from '../components/PostLink'
import { getPublishedArticles } from '../content/articles'

function fmt(d: string) {
  const [y, m, day] = d.split('-').map(Number)
  if (!y || !m || !day) return d
  return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** The Record: every published file in date order, newest first. Real data only. */
export function TheRecord() {
  const files = getPublishedArticles()

  return (
    <div className="page">
      <header className="page-header">
        <div className="file-label">
          FILE // <span>THE RECORD</span>
        </div>
        <h1>The Record</h1>
        <p className="dek">
          Every file we’ve opened, in date order. Each entry links to the full
          report and its sources.
        </p>
      </header>
      <ol className="timeline">
        {files.map((a) => (
          <li key={a.slug} className="timeline-item">
            <time className="meta" dateTime={a.date}>
              {fmt(a.date)}
            </time>
            <h3>
              <PostLink post={a}>{a.title}</PostLink>
            </h3>
          </li>
        ))}
      </ol>
    </div>
  )
}
