import type { Article } from '../content/articles'
import { Stamp } from './Stamp'
import {
  formatDisplayDate,
  sourceChips,
  stampForCategory,
} from '../lib/dossier'

type Props = {
  article: Article
}

export function DossierCover({ article }: Props) {
  const chips = sourceChips(article)
  const stamp = stampForCategory(article.category)

  return (
    <section className="dossier-cover" aria-label="Dossier cover">
      <div className="cover-top">
        <div className="cover-cat">
          Category · <em>{article.category === 'REPORTS' ? 'REPORT' : article.category}</em>
        </div>
        {!article.proseArticle ? (
          <div className="stamps">
            <Stamp variant={stamp} />
          </div>
        ) : null}
      </div>
      <h1>{article.title}</h1>
      <p className="cover-dek">{article.dek}</p>
      <div className="cover-meta">
        <span>By The Donald Files desk</span>
        <span>{formatDisplayDate(article.date)}</span>
        <div className="source-chips">
          {chips.map((c) => (
            <span key={c} className="chip">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
