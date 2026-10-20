/** SEO / share-card helpers. Absolute domain everywhere. */
export const SITE = 'https://thedonaldfiles.com'
export const SITE_NAME = 'The Donald Files'
export const SITE_DESC =
  'The Donald Files — Brutal. Factual. Documented. Sourced reporting and snark on Trump, with every receipt in the file.'
export const DEFAULT_OG = `${SITE}/og/default.png`

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
export function isoDate(d) {
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T16:00:00Z` : new Date().toISOString()
}

export const articleUrl = (slug) => `${SITE}/reports/${slug}/`
export const articleOg = (slug) => `${SITE}/og/${slug}.png`

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
  const pub = isoDate(a.date)
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: clip(a.title, 110),
    description: clip(a.dek, 300),
    image: [articleOg(a.slug)],
    datePublished: pub,
    dateModified: pub,
    articleSection: a.category,
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl(a.slug) },
    url: articleUrl(a.slug),
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
