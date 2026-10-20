/**
 * Post-build (after generate-static): per-article 1200x630 og:image PNGs,
 * home-page share tags, sitemap.xml, robots.txt, rss.xml, feed.json.
 * Any per-article image failure falls back to /og/default.png.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { extractArticles } from './lib/articles.mjs'
import {
  SITE, SITE_NAME, SITE_DESC, DEFAULT_OG, esc, clip, isoDate, articleUrl, articleOg,
  headTags, websiteLd,
} from './lib/seo.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const all = extractArticles(readFileSync(join(root, 'src/content/articles.ts'), 'utf8'))
const articles = all.filter((a) => !a.fixture)

// ---------- og images ----------
const fonts = [
  { name: 'Anton', data: readFileSync(join(root, 'scripts/fonts/Anton-Regular.ttf')), weight: 400, style: 'normal' },
  { name: 'Plex Mono', data: readFileSync(join(root, 'scripts/fonts/IBMPlexMono-Bold.ttf')), weight: 700, style: 'normal' },
]
const h = (type, style, ...children) => ({
  type,
  props: { style: { display: 'flex', boxSizing: 'border-box', ...style }, children: children.length <= 1 ? children[0] : children },
})

function headlineSize(t) {
  const n = t.length
  if (n <= 40) return 96
  if (n <= 60) return 82
  if (n <= 85) return 70
  if (n <= 110) return 60
  return 52
}

function card({ title, kicker, fileId, date }) {
  const head = clip(title, 140).toUpperCase()
  return h(
    'div',
    { width: 1200, height: 630, background: '#0A0A0A', padding: '34px 40px', flexDirection: 'column', fontFamily: 'Plex Mono' },
    // folder tab
    h('div', { width: 340, height: 44, background: '#D9CBB0', borderRadius: '10px 10px 0 0', marginLeft: 24, alignItems: 'center', paddingLeft: 22, fontSize: 18, color: '#5a5348', letterSpacing: 3 }, fileId),
    h(
      'div',
      { width: 1100, height: 510, background: '#E8DCC8', border: '2px solid #c9bba3', flexDirection: 'column', padding: '30px 44px 26px', position: 'relative', boxShadow: '10px 10px 0 #D1001F' },
      h('div', { justifyContent: 'space-between', alignItems: 'center', width: '100%' },
        h('div', { border: '4px solid #D1001F', color: '#D1001F', fontSize: 24, padding: '6px 16px', letterSpacing: 4, transform: 'rotate(-3deg)' }, kicker),
        h('div', { fontSize: 20, color: '#5a5348', letterSpacing: 3 }, date)),
      h('div', { flex: 1, width: 1000, alignItems: 'center', fontFamily: 'Anton', fontSize: headlineSize(head), lineHeight: 1.04, color: '#1A1510', paddingTop: 10 }, head),
      h('div', { justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '3px dashed #b9a988', paddingTop: 14, width: '100%' },
        h('div', { fontFamily: 'Anton', fontSize: 40, color: '#1A1510', letterSpacing: 1 },
          h('span', {}, 'THE\u00a0'), h('span', { color: '#D1001F' }, 'DONALD'), h('span', {}, '\u00a0FILES')),
        h('div', { fontSize: 22, color: '#5a5348', letterSpacing: 2 }, 'THEDONALDFILES.COM')),
    ),
  )
}

async function png(node) {
  const svg = await satori(node, { width: 1200, height: 630, fonts })
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
}

mkdirSync(join(dist, 'og'), { recursive: true })
writeFileSync(
  join(dist, 'og', 'default.png'),
  await png(card({ title: 'Brutal. Factual. Documented. Every receipt in the file.', kicker: 'OPEN FILES', fileId: 'FILE // INDEX', date: 'HOSTILE ARCHIVE' })),
)
const ogFailed = []
for (const [i, a] of all.entries()) {
  const out = join(dist, 'og', `${a.slug}.png`)
  try {
    writeFileSync(out, await png(card({ title: a.title, kicker: a.proseArticle ? 'FILED' : 'FACT · REPORT', fileId: `FILE // ${String(i + 1).padStart(3, '0')}`, date: a.date })))
  } catch (e) {
    ogFailed.push(a.slug)
    console.warn(`og image failed for ${a.slug}: ${e.message} — using default`)
    writeFileSync(out, readFileSync(join(dist, 'og', 'default.png')))
  }
}

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

console.log(`SEO: ${all.length} og images (${ogFailed.length} fell back), sitemap ${urls.length} urls, feed/rss ${items.length} items`)
