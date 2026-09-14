import { Link } from 'react-router-dom'
import type { Article } from '../content/articles'
import { Stamp } from './Stamp'
import {
  fileIdFromArticle,
  formatDisplayDate,
  sourceChips,
  stampForCategory,
} from '../lib/dossier'

type Props = {
  article: Article
  index?: number
  lead?: boolean
}

export function CaseCard({ article, index = 0, lead = false }: Props) {
  const chips = sourceChips(article)
  const stamp = stampForCategory(article.category)

  return (
    <Link
      to={`/reports/${article.slug}`}
      className={`case-card${lead ? ' case-card-lead' : ''}`}
    >
      <div className="case-top">
        <span className="case-file-id">
          FILE // {fileIdFromArticle(article, index)}
        </span>
        <div className="stamps">
          <Stamp variant={stamp} />
          {article.category === 'REPORTS' ? (
            <Stamp variant="report" />
          ) : null}
        </div>
      </div>
      <div className="case-date">{formatDisplayDate(article.date)}</div>
      <h3>{article.title}</h3>
      <p className="case-dek">{article.dek}</p>
      <div className="case-foot">
        <div className="sources">
          {chips.map((c) => (
            <span key={c} className="chip">
              {c}
            </span>
          ))}
        </div>
        <span className="open-link">Open file →</span>
      </div>
    </Link>
  )
}
