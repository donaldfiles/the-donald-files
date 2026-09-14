import { Link } from 'react-router-dom'
import type { Article } from '../../content/articles'
import {
  fileIdFromArticle,
  formatDisplayDate,
  sourceChips,
  stampForCategory,
} from '../../lib/dossier'

type Props = {
  article: Article
  index: number
  cream?: boolean
}

const stampLabel: Record<string, string> = {
  fact: 'FACT',
  analysis: 'ANALYSIS',
  opinion: 'OPINION',
  source: 'SOURCE',
  report: 'REPORT',
}

export function PastedCard({ article, index, cream = false }: Props) {
  const chips = sourceChips(article, 2)
  const stamp = stampForCategory(article.category)
  const tapeRight = index % 2 === 1

  return (
    <Link
      to={`/reports/${article.slug}`}
      className={`pasted-card${cream ? ' cream-scrap' : ''}`}
    >
      <div className={`tape${tapeRight ? ' right' : ''}`} aria-hidden="true" />
      <div className="card-file">
        <span>FILE // {fileIdFromArticle(article, index)}</span>
        <div className="card-stamps">
          <span className="mini">{stampLabel[stamp]}</span>
          {article.category === 'REPORTS' ? (
            <span className="mini analysis">REPORT</span>
          ) : null}
        </div>
      </div>
      <h3>{article.title}</h3>
      <p className="pasted-dek">{article.dek}</p>
      <div className="card-foot">
        <span>
          {formatDisplayDate(article.date)}
          {chips.length ? ` · ${chips.join(' · ')}` : ''}
        </span>
        <span className="open">Open →</span>
      </div>
    </Link>
  )
}
