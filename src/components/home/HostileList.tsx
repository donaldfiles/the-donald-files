import { Link } from 'react-router-dom'
import type { Article } from '../../content/articles'

type Props = {
  articles: Article[]
}

/** Rage rank blurbs — attitude only, no new facts. */
function rageBlurb(slug: string, fallbackIndex: number): string {
  const map: Record<string, string> = {
    'iran-war-midterms-pickaxe-mountain':
      'Lead blast · biggest heat on the stack',
    'doj-scotus-save-voter-verification': 'Filings first · spin optional',
    'trump-dividend-5000-gop-congress':
      'Promise trail vs. scored reality',
    'trump-west-wing-holiday-cash-gifts':
      'Seasonal rhetoric · disclosure paper',
    'doj-scotus-nevada-us-attorney-chattah':
      'Vacancies workaround · 9th Circuit paper',
  }
  return map[slug] ?? `Heat rank ${String(fallbackIndex + 1).padStart(2, '0')}`
}

export function HostileList({ articles }: Props) {
  return (
    <>
      <div className="ugly-section-head">
        <h2>
          Rage <span className="slash">/</span> Rank
        </h2>
        <span className="section-note">Hierarchy by heat · not calendar alone</span>
      </div>
      <div className="hostile-list">
        {articles.map((a, i) => (
          <Link
            key={a.slug}
            className="hostile-row"
            to={`/reports/${a.slug}`}
          >
            <div className="hostile-rank">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div>
              <h3>{a.title}</h3>
              <p>{rageBlurb(a.slug, i)}</p>
            </div>
            <span className="hostile-go">OPEN →</span>
          </Link>
        ))}
      </div>
    </>
  )
}
