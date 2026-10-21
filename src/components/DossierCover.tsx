import type { Article } from '../content/articles'
import { Stamp } from './Stamp'
import contentDates from '../content/content-dates.json'

const formatET = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }) + ' ET'
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
  const dates = (contentDates as Record<string, { published: string | null; modified: string | null }>)[article.slug]
  const updated = dates?.modified && (!dates.published || dates.modified > dates.published) ? dates.modified : null

  return (
    <section className="dossier-cover" aria-label="Dossier cover">
      <div className="cover-top">
        {article.proseArticle ? null : (
          <div className="cover-cat">
            Category · <em>{article.category === 'REPORTS' ? 'REPORT' : article.category}</em>
          </div>
        )}
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
        <span>
          Published <time dateTime={dates?.published ?? article.date}>{formatDisplayDate(article.date)}</time>
          {updated ? (
            <>
              {' · Updated '}
              <time dateTime={updated}>{formatET(updated)}</time>
            </>
          ) : null}
        </span>
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
