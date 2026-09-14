import { Link } from 'react-router-dom'
import type { Article } from '../../content/articles'
import {
  fileIdFromArticle,
  formatDisplayDate,
  sourceChips,
} from '../../lib/dossier'

type Props = {
  article: Article
  index?: number
}

function megaHed(title: string) {
  const upper = title.toUpperCase()
  // Highlight a hostile punch phrase when present
  const hotPhrases = [
    'PICKAXE MOUNTAIN',
    '$5,000',
    'HOLIDAY',
    'VOTER-PURGE',
    'U.S. ATTORNEY',
  ]
  for (const phrase of hotPhrases) {
    const idx = upper.indexOf(phrase)
    if (idx >= 0) {
      return {
        before: upper.slice(0, idx),
        hot: upper.slice(idx, idx + phrase.length),
        after: upper.slice(idx + phrase.length),
      }
    }
  }
  // Fallback: last third hot
  const cut = Math.max(12, Math.floor(upper.length * 0.55))
  return {
    before: upper.slice(0, cut),
    hot: upper.slice(cut),
    after: '',
  }
}

export function LeadBlast({ article, index = 0 }: Props) {
  const chips = sourceChips(article)
  const hed = megaHed(article.title)

  return (
    <article className="lead-blast">
      <div className="lead-top">
        <div className="lead-meta">
          <span className="live">LIVE FILE</span>
          {fileIdFromArticle(article, index)} · {formatDisplayDate(article.date)}
        </div>
        <div className="stamp-pile">
          <span className="ugly-stamp filled">FACT</span>
          <span className="ugly-stamp yellow">OPEN</span>
          <span className="ugly-stamp">READ IT</span>
        </div>
      </div>
      <h1 className="lead-hed">
        {hed.before}
        {hed.hot ? <span className="hot">{hed.hot}</span> : null}
        {hed.after}
      </h1>
      <p className="lead-dek">{article.dek}</p>
      <div className="lead-foot">
        <div className="ugly-chips">
          {chips.map((c) => (
            <span key={c} className="ugly-chip">
              {c}
            </span>
          ))}
          <span className="ugly-chip">Source files</span>
        </div>
        <Link className="rage-btn" to={`/reports/${article.slug}`}>
          OPEN THE FILE →
        </Link>
      </div>
    </article>
  )
}
