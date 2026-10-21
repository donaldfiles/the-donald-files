/** SEO / share-card helpers. Absolute domain everywhere. */
export const SITE = 'https://thedonaldfiles.com'
export const SITE_NAME = 'The Donald Files'
export const SITE_DESC =
  'The Donald Files — Brutal. Factual. Documented. Sourced reporting and snark on Trump, with every receipt in the file.'
/** Bump when the card design changes so X/Facebook re-fetch instead of using cached cards. */
export const OG_VERSION = 'v3'
export const DEFAULT_OG = `${SITE}/og/default.png?${OG_VERSION}`

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function clip(s, n = 200) {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim()
  if (t.length <= n) return t
  const cut = t.slice(0, n - 1)
  const sp = cut.lastIndexOf(' ')
  return (sp > n * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:.–—-]+$/, '') + '…'
}

/** YYYY-MM-DD → ISO 8601 (noon New York ≈ 16:00Z; dates carry no time). */
import { readFileSync as _rf, existsSync as _ex } from 'node:fs'
const _datesPath = new URL('../../src/content/content-dates.json', import.meta.url)
const DATES = _ex(_datesPath) ? JSON.parse(_rf(_datesPath, 'utf8')) : {}

/** { published, modified } ISO strings for a post. published falls back to its calendar date. */
export function datesFor(a) {
  const d = DATES[a.slug] || {}
  const published = d.published || (a.publishedAt ? new Date(a.publishedAt).toISOString() : isoDate(a.date))
  const modified = d.modified && d.modified > published ? d.modified : published
  return { published, modified, hasTime: Boolean(d.published || a.publishedAt) }
}

export function isoDate(d) {
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T16:00:00Z` : new Date().toISOString()
}

export const articleUrl = (slug) => `${SITE}/reports/${slug}/`
export const urlFor = (a) => (a.kind === 'clip' ? `${SITE}/trump-videos/${a.slug}/` : articleUrl(a.slug))
export const articleOg = (slug) => `${SITE}/og/${slug}.png?${OG_VERSION}`

/**
 * Build head tags. opts: { title, description, url, image, type, published,
 * section, noindex, jsonLd }
 */
export function headTags(o) {
  const t = []
  const desc = clip(o.description, 200)
  t.push(`<meta name="description" content="${esc(desc)}"/>`)
  t.push(`<link rel="canonical" href="${esc(o.url)}"/>`)
  if (o.noindex) t.push(`<meta name="robots" content="noindex,follow"/>`)
  t.push(`<meta property="og:site_name" content="${esc(SITE_NAME)}"/>`)
  t.push(`<meta property="og:type" content="${esc(o.type || 'website')}"/>`)
  t.push(`<meta property="og:title" content="${esc(o.title)}"/>`)
  t.push(`<meta property="og:description" content="${esc(desc)}"/>`)
  t.push(`<meta property="og:url" content="${esc(o.url)}"/>`)
  t.push(`<meta property="og:image" content="${esc(o.image)}"/>`)
  t.push(`<meta property="og:image:width" content="1200"/>`)
  t.push(`<meta property="og:image:height" content="630"/>`)
  t.push(`<meta property="og:image:type" content="image/png"/>`)
  t.push(`<meta property="og:image:alt" content="${esc(o.title)}"/>`)
  t.push(`<meta property="og:locale" content="en_US"/>`)
  if (o.published) {
    t.push(`<meta property="article:published_time" content="${esc(o.published)}"/>`)
    t.push(`<meta property="article:modified_time" content="${esc(o.modified || o.published)}"/>`)
    if (o.section) t.push(`<meta property="article:section" content="${esc(o.section)}"/>`)
  }
  t.push(`<meta name="twitter:card" content="summary_large_image"/>`)
  t.push(`<meta name="twitter:title" content="${esc(o.title)}"/>`)
  t.push(`<meta name="twitter:description" content="${esc(desc)}"/>`)
  t.push(`<meta name="twitter:image" content="${esc(o.image)}"/>`)
  t.push(`<meta name="twitter:image:alt" content="${esc(o.title)}"/>`)
  t.push(`<link rel="alternate" type="application/rss+xml" title="${esc(SITE_NAME)}" href="${SITE}/rss.xml"/>`)
  t.push(`<link rel="alternate" type="application/feed+json" title="${esc(SITE_NAME)}" href="${SITE}/feed.json"/>`)
  for (const j of [].concat(o.jsonLd || [])) {
    t.push(`<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`)
  }
  return t.join('')
}

const publisher = {
  '@type': 'NewsMediaOrganization',
  name: SITE_NAME,
  url: `${SITE}/`,
  logo: { '@type': 'ImageObject', url: DEFAULT_OG, width: 1200, height: 630 },
}

export function newsArticleLd(a) {
  const { published: pub, modified } = datesFor(a)
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: clip(a.title, 110),
    description: clip(a.dek, 300),
    image: [articleOg(a.slug)],
    datePublished: pub,
    dateModified: modified,
    articleSection: a.category,
    mainEntityOfPage: { '@type': 'WebPage', '@id': urlFor(a) },
    url: urlFor(a),
    author: { '@type': 'Organization', name: 'The Donald Files desk', url: `${SITE}/` },
    publisher,
    isAccessibleForFree: true,
    citation: (a.sources || []).map((s) => s.url),
  }
}

export function websiteLd() {
  return [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: `${SITE}/` },
    { '@context': 'https://schema.org', ...publisher },
  ]
}

/** ET calendar date → ISO with offset (noon ET; EDT until 1 Nov 2026). */
export function etNoon(d) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return isoDate(d)
  return `${d}T12:00:00${d >= '2026-11-01' ? '-05:00' : '-04:00'}`
}

export function embedUrlFor(e) {
  if (!e) return undefined
  if (e.type === 'youtube') return `https://www.youtube-nocookie.com/embed/${e.id}`
  if (e.type === 'x') return `https://platform.twitter.com/embed/Tweet.html?id=${e.id}`
  return e.url
}

export function clipLd(a) {
  const url = urlFor(a)
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Trump Videos', item: `${SITE}/trump-videos/` },
      { '@type': 'ListItem', position: 3, name: a.title, item: url },
    ],
  }
  const out = [crumbs]
  const e = a.embed
  if (e && (e.type === 'x' || e.type === 'youtube')) {
    const thumbs = [articleOg(a.slug)]
    if (e.type === 'youtube') thumbs.unshift(`https://i.ytimg.com/vi/${e.id}/hqdefault.jpg`)
    const v = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: a.title,
      description: clip(a.dek, 300),
      thumbnailUrl: thumbs,
      uploadDate: etNoon(a.date),
      datePublished: datesFor(a).published,
      dateModified: datesFor(a).modified,
      embedUrl: embedUrlFor(e),
      contentUrl: e.url,
      url,
      publisher,
    }
    if (a.durationSeconds) v.duration = `PT${a.durationSeconds}S`
    out.push(v)
  }
  const words = (a.body || []).join(' ').split(/\s+/).length
  if (words > 150 || !e || e.type === 'truthsocial') out.push(newsArticleLd(a))
  return out
}

const fmtET = (iso, withTime) =>
  new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/New_York', month: 'short', day: 'numeric', year: 'numeric',
    ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {}),
  }) + (withTime ? ' ET' : '')

/** Visible "Published … · Updated …" line (HTML). */
export function timeLineHtml(a) {
  const { published, modified, hasTime } = datesFor(a)
  const pubTxt = hasTime ? fmtET(published, true) : fmtET(etNoon(a.date), false)
  let h = `<span class="t-pub">Published <time datetime="${esc(published)}">${esc(pubTxt)}</time></span>`
  if (modified > published) h += ` · <span class="t-upd">Updated <time datetime="${esc(modified)}">${esc(fmtET(modified, true))}</time></span>`
  return h
}
