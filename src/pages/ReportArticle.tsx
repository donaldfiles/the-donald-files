import { Link, useParams } from 'react-router-dom'
import { CategoryLabel } from '../components/CategoryLabel'
import { getArticleBySlug } from '../content/articles'

export function ReportArticle() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticleBySlug(slug) : undefined

  if (!article) {
    return (
      <div className="page">
        <header className="page-header">
          <h1>Article not found</h1>
          <p className="dek">
            No published report matches this URL.{' '}
            <Link to="/reports">Back to Reports</Link>
          </p>
        </header>
      </div>
    )
  }

  return (
    <article className="page article-page">
      <header className="page-header">
        <CategoryLabel category={article.category} />
        <h1>{article.title}</h1>
        <p className="meta">{article.date}</p>
      </header>

      <div className="prose article-body">
        {article.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <section className="source-files" aria-labelledby="sources-title">
        <h2 id="sources-title" className="section-title">
          SOURCE FILES
        </h2>
        <ol className="source-list">
          {article.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.label}
              </a>
            </li>
          ))}
        </ol>
      </section>

      <p className="article-back">
        <Link to="/reports">← All Reports</Link>
      </p>
    </article>
  )
}
