/**
 * Post-build (after generate-static): per-article 1200x630 og:image PNGs (Vex share card v1 via headless Chrome),
 * home-page share tags, sitemap.xml, robots.txt, rss.xml, feed.json.
 * Any per-article image failure falls back to /og/default.png.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { openRenderer, cardParams } from './lib/share-card.mjs'
import { extractArticles } from './lib/articles.mjs'
import {
  SITE, SITE_NAME, SITE_DESC, DEFAULT_OG, esc, clip, isoDate, articleUrl, articleOg,
  headTags, websiteLd,
} from './lib/seo.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const all = extractArticles(readFileSync(join(root, 'src/content/articles.ts'), 'utf8'))
const articles = all.filter((a) => !a.fixture)

// ---------- og images (share card v1, headless Chrome) ----------
// Dossier numbers: chronological among feed articles (oldest = 001), stable as new pieces are prepended.
const fileNo = new Map()
const chrono = all.filter((a) => !a.fixture).slice().reverse()
chrono.forEach((a, i) => fileNo.set(a.slug, i + 1))
mkdirSync(join(dist, 'og'), { recursive: true })
const renderer = await openRenderer(root)
const ogFailed = []
const defaultPath = join(dist, 'og', 'default.png')
try {
  const { png } = await renderer.render({
    kicker: 'Hostile archive', file: 'FILE // INDEX', stamp: 'RECEIPTS',
    hed: 'Brutal. Factual. *Documented.*', dek: 'Every receipt in the file.',
  })
  writeFileSync(defaultPath, png)
} catch (e) {
  await renderer.close()
  throw new Error(`default share card failed: ${e.message}`)
}
let withDek = 0
for (const a of all) {
  const out = join(dist, 'og', `${a.slug}.png`)
  const params = cardParams(a, fileNo.get(a.slug) ?? 0)
  if (a.fixture) params.file = 'FILE // TEST'
  try {
    const r = await renderer.render(params)
    if (r.usedDek) withDek++
    writeFileSync(out, r.png)
  } catch (e) {
    ogFailed.push(a.slug)
    console.warn(`og image failed for ${a.slug}: ${e.message} — using default`)
    writeFileSync(out, readFileSync(defaultPath))
  }
}
await renderer.close()

// ---------- home (SPA shell) share tags ----------
const homePath = join(dist, 'index.html')
if (existsSync(homePath) && !readFileSync(homePath, 'utf8').includes('og:site_name')) {
  let html = readFileSync(homePath, 'utf8')
  html = html.replace(/<meta name="description"[^>]*>\s*/i, '')
  const tags = headTags({ title: `${SITE_NAME} — Brutal. Factual. Documented.`, description: SITE_DESC, url: `${SITE}/`, image: DEFAULT_OG, type: 'website', jsonLd: websiteLd() })
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(SITE_NAME)} — Brutal. Factual. Documented.</title>${tags}`)
  writeFileSync(homePath, html)
}

// ---------- sitemap + robots ----------
const latest = articles[0]?.date
const urls = [
  { loc: `${SITE}/`, lastmod: latest, freq: 'hourly', pri: '1.0' },
  { loc: `${SITE}/reports/`, lastmod: latest, freq: 'hourly', pri: '0.9' },
  { loc: `${SITE}/the-record`, freq: 'daily', pri: '0.6' },
  { loc: `${SITE}/about`, freq: 'monthly', pri: '0.3' },
  { loc: `${SITE}/subscribe`, freq: 'monthly', pri: '0.4' },
  ...articles.map((a) => ({ loc: articleUrl(a.slug), lastmod: a.date, freq: 'weekly', pri: '0.8', img: articleOg(a.slug), title: a.title })),
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<changefreq>${u.freq}</changefreq><priority>${u.pri}</priority>${u.img ? `<image:image><image:loc>${esc(u.img)}</image:loc><image:title>${esc(u.title)}</image:title></image:image>` : ''}</url>`)
  .join('\n')}
</urlset>
`
writeFileSync(join(dist, 'sitemap.xml'), sitemap)
writeFileSync(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /embed-smoke\nDisallow: /reports/embed-smoke-fixture/\n\nSitemap: ${SITE}/sitemap.xml\n`,
)

// ---------- feed.json (JSON Feed 1.1) + rss.xml ----------
const items = articles.map((a) => ({
  id: articleUrl(a.slug),
  slug: a.slug,
  url: articleUrl(a.slug),
  title: a.title,
  summary: a.dek,
  image: articleOg(a.slug),
  date_published: isoDate(a.date),
  tags: [a.category],
}))
writeFileSync(
  join(dist, 'feed.json'),
  JSON.stringify(
    { version: 'https://jsonfeed.org/version/1.1', title: SITE_NAME, home_page_url: `${SITE}/`, feed_url: `${SITE}/feed.json`, description: SITE_DESC, icon: DEFAULT_OG, language: 'en-US', items },
    null,
    2,
  ) + '\n',
)
const cdata = (s) => `<![CDATA[${String(s).replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
<title>${esc(SITE_NAME)}</title>
<link>${SITE}/</link>
<description>${esc(SITE_DESC)}</description>
<language>en-us</language>
<atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items
  .map((it) => `<item><title>${cdata(it.title)}</title><link>${it.url}</link><guid isPermaLink="true">${it.url}</guid><pubDate>${new Date(it.date_published).toUTCString()}</pubDate><category>${esc(it.tags[0])}</category><description>${cdata(it.summary)}</description><enclosure url="${it.image}" type="image/png" length="0"/><media:content url="${it.image}" medium="image" type="image/png" width="1200" height="630"/></item>`)
  .join('\n')}
</channel>
</rss>
`
writeFileSync(join(dist, 'rss.xml'), rss)

console.log(`SEO: ${all.length} share cards (${ogFailed.length} fell back${ogFailed.length ? ': ' + ogFailed.join(', ') : ''}; ${withDek} with dek), sitemap ${urls.length} urls, feed/rss ${items.length} items`)
