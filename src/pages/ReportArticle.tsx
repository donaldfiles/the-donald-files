import { Link, useParams } from 'react-router-dom'
import { DossierCover } from '../components/DossierCover'
import { ReadProgress } from '../components/ReadProgress'
import { SourceFiles } from '../components/SourceFiles'
import { VideoEmbed } from '../components/VideoEmbed'
import {
  getArticleBySlug,
  getPublishedArticles,
  type ArticleEmbed,
} from '../content/articles'
import { fileIdFromArticle } from '../lib/dossier'

function embedsAfter(
  embeds: ArticleEmbed[] | undefined,
  bodyLen: number,
): Map<number, ArticleEmbed[]> {
  const map = new Map<number, ArticleEmbed[]>()
  if (!embeds?.length) return map
  for (const e of embeds) {
    const raw = e.afterBodyIndex
    const idx =
      raw === undefined || raw === null
        ? bodyLen - 1
        : Math.max(0, Math.min(bodyLen - 1, raw))
    const list = map.get(idx) ?? []
    list.push(e)
    map.set(idx, list)
  }
  return map
}

export function ReportArticle() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticleBySlug(slug) : undefined
  const all = getPublishedArticles()
  const idx = article ? all.findIndex((a) => a.slug === article.slug) : -1
  const next = idx >= 0 ? all[idx + 1] ?? all[0] : undefined

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

  const fileId = fileIdFromArticle(article, Math.max(0, idx))
  const byAfter = embedsAfter(article.embeds, article.body.length)

  return (
    <article className="page article-page">
      <div className="article-topbar">
        <div className="article-topbar-inner">
          <Link className="back-link" to="/reports">
            ← Reports
          </Link>
          <div className="topbar-file">
            FILE // <span>{fileId}</span>
          </div>
        </div>
        <ReadProgress />
      </div>

      <DossierCover article={article} />

      <aside className="evidence-strip" aria-label="Evidence strip">
        <div className="evidence-label">Evidence</div>
        <ul className="evidence-items">
          <li>
            <strong>{article.sources.length}</strong> source file
            {article.sources.length === 1 ? '' : 's'}
          </li>
          <li>
            <strong>{article.body.length}</strong> body grafs
          </li>
          {article.embeds && article.embeds.length > 0 ? (
            <li>
              <strong>{article.embeds.length}</strong> video exhibit
              {article.embeds.length === 1 ? '' : 's'}
            </li>
          ) : null}
          <li>
            <strong>Date</strong> {article.date}
          </li>
        </ul>
      </aside>

      <div className="body-chrome">FILE // BODY · READ IN ORDER</div>
      <div className="prose article-body">
        {article.body.map((paragraph, i) => (
          <div key={i} className="body-block">
            <p>{paragraph}</p>
            {(byAfter.get(i) ?? []).map((embed, ei) => (
              <VideoEmbed
                key={`${i}-${ei}-${embed.id ?? embed.youtubeUrl ?? embed.embedUrl}`}
                {...embed}
                variant="dossier"
              />
            ))}
          </div>
        ))}
      </div>

      <SourceFiles sources={article.sources} />

      {next && next.slug !== article.slug ? (
        <aside className="next-cta" aria-label="Next file">
          <div>
            <div className="next-label">Next file</div>
            <div className="next-hed">{next.title}</div>
          </div>
          <Link className="btn btn-ghost" to={`/reports/${next.slug}`}>
            OPEN →
          </Link>
        </aside>
      ) : null}
    </article>
  )
}
