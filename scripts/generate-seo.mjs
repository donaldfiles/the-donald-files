/**
 * Post-build (after generate-static): per-article 1200x630 og:image PNGs (Vex share card v1 via headless Chrome),
 * home-page share tags, sitemap.xml, robots.txt, rss.xml, feed.json.
 * Any per-article image failure falls back to /og/default.png.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { openRenderer, cardParams } from './lib/share-card.mjs'
import { extractArticles, fileNumbers, liveTopics } from './lib/articles.mjs'
import {
  SITE, SITE_NAME, SITE_DESC, DEFAULT_OG, esc, urlFor, articleOg, datesFor, embedUrlFor,

} from './lib/seo.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const all = extractArticles(readFileSync(join(root, 'src/content/articles.ts'), 'utf8'))
const articles = all.filter((a) => !a.fixture)

// ---------- og images (share card v1, headless Chrome) ----------
// Dossier numbers: chronological among feed articles (oldest = 001), stable as new pieces are prepended.
const fileNo = fileNumbers(all)
mkdirSync(join(dist, 'og'), { recursive: true })
const renderer = await openRenderer(root)
const ogFailed = []
const defaultPath = join(dist, 'og', 'default.png')
try {
  const { png } = await renderer.render({
    kicker: 'The administration, annotated.', file: 'thedonaldfiles.com', stamp: 'RECEIPTS',
    hed: 'Sourced. Snarky. *Receipts* attached.',
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
  if (a.fixture) params.file = 'File TEST'
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

// ---------- sitemap + robots ----------
const latest = articles[0]?.date
const urls = [
  { loc: `${SITE}/`, lastmod: latest, freq: 'hourly', pri: '1.0' },
  { loc: `${SITE}/reports/`, lastmod: latest, freq: 'hourly', pri: '0.9' },
  { loc: `${SITE}/trump-videos/`, lastmod: latest, freq: 'hourly', pri: '0.9' },
  ...liveTopics(all).map((t) => ({ loc: `${SITE}/trump-videos/${t}/`, lastmod: latest, freq: 'daily', pri: '0.7' })),
  { loc: `${SITE}/the-record`, freq: 'daily', pri: '0.6' },
  { loc: `${SITE}/about`, freq: 'monthly', pri: '0.3' },
  { loc: `${SITE}/subscribe`, freq: 'monthly', pri: '0.4' },
  ...articles.map((a) => ({ loc: urlFor(a), lastmod: datesFor(a).modified, freq: 'weekly', pri: '0.8', img: articleOg(a.slug), title: a.title })),
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<changefreq>${u.freq}</changefreq><priority>${u.pri}</priority>${u.img ? `<image:image><image:loc>${esc(u.img)}</image:loc><image:title>${esc(u.title)}</image:title></image:image>` : ''}</url>`)
  .join('\n')}
</urlset>
`
writeFileSync(join(dist, 'sitemap.xml'), sitemap)

// ---------- video sitemap (every clip's video, incl. "before" clips) ----------
const vids = []
for (const a of articles.filter((x) => x.kind === 'clip')) {
  const d = datesFor(a)
  for (const [e, isBefore] of [[a.embed, false], [a.beforeEmbed, true]]) {
    if (!e || (e.type !== 'x' && e.type !== 'youtube')) continue
    vids.push({
      loc: urlFor(a),
      thumb: e.type === 'youtube' ? `https://i.ytimg.com/vi/${e.id}/hqdefault.jpg` : articleOg(a.slug),
      title: isBefore ? `${e.label || 'Earlier clip'} (before)` : a.title,
      desc: isBefore ? `The earlier clip referenced in: ${a.title}` : a.dek || a.title,
      player: embedUrlFor(e),
      date: d.published,
      dur: !isBefore && a.durationSeconds ? a.durationSeconds : undefined,
    })
  }
}
const byLoc = new Map()
for (const v of vids) byLoc.set(v.loc, [...(byLoc.get(v.loc) || []), v])
const videoSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${[...byLoc]
  .map(
    ([loc, vs]) =>
      `  <url><loc>${esc(loc)}</loc>${vs
        .map(
          (v) =>
            `<video:video><video:thumbnail_loc>${esc(v.thumb)}</video:thumbnail_loc><video:title>${esc(v.title.slice(0, 100))}</video:title><video:description>${esc(v.desc.slice(0, 2048))}</video:description><video:player_loc>${esc(v.player)}</video:player_loc>${v.dur ? `<video:duration>${v.dur}</video:duration>` : ''}<video:publication_date>${esc(v.date)}</video:publication_date><video:family_friendly>yes</video:family_friendly></video:video>`,
        )
        .join('')}</url>`,
  )
  .join('\n')}
</urlset>
`
writeFileSync(join(dist, 'sitemap-video.xml'), videoSitemap)
const newest = articles.map((a) => datesFor(a).modified).sort().pop()
writeFileSync(
  join(dist, 'sitemap-index.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE}/sitemap.xml</loc><lastmod>${newest}</lastmod></sitemap>
  <sitemap><loc>${SITE}/sitemap-video.xml</loc><lastmod>${newest}</lastmod></sitemap>
</sitemapindex>
`,
)
writeFileSync(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap-index.xml\nSitemap: ${SITE}/sitemap.xml\nSitemap: ${SITE}/sitemap-video.xml\n`,
)

// ---------- feed.json (JSON Feed 1.1) + rss.xml ----------
const items = articles.map((a) => ({
  id: urlFor(a),
  slug: a.slug,
  url: urlFor(a),
  title: a.title,
  summary: a.dek,
  image: articleOg(a.slug),
  date_published: datesFor(a).published,
  date_modified: datesFor(a).modified,
  tags: a.kind === 'clip' ? ['clip', ...(a.topics || [])] : [a.category],
  ...(a.kind === 'clip' && a.embed ? { external_url: a.embed.url } : {}),
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

console.log(`video sitemap: ${vids.length} videos on ${byLoc.size} pages`)
console.log(`SEO: ${all.length} share cards (${ogFailed.length} fell back${ogFailed.length ? ': ' + ogFailed.join(', ') : ''}; ${withDek} with dek), sitemap ${urls.length} urls, feed/rss ${items.length} items`)
