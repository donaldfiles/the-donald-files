/** Post-build: regenerate dist/reports static HTML (Open Dossier styling). */
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const articlesPath = join(root, 'src/content/articles.ts')
const dist = join(root, 'dist')
const src = readFileSync(articlesPath, 'utf8')

function parseStringExpr(expr) {
  return expr
    .split(/\s*\+\s*/)
    .map((p) => p.trim().replace(/^'|'$/g, '').replace(/\\'/g, "'"))
    .join('')
}

function extractArticles(text) {
  const articles = []
  const blockRe =
    /\{\s*slug:\s*'([^']+)'[\s\S]*?published:\s*(true|false)\s*,?\s*\}/g
  let m
  while ((m = blockRe.exec(text))) {
    const block = m[0]
    const slug = m[1]
    if (m[2] !== 'true') continue

    const titleMatch = block.match(
      /title:\s*((?:'(?:\\'|[^'])*'\s*\+\s*)*'(?:\\'|[^'])*')/,
    )
    const titleStr = titleMatch ? parseStringExpr(titleMatch[1]) : slug
    const dek = /dek:\s*'((?:\\'|[^'])*)'/.exec(block)
    const date = /date:\s*'([^']+)'/.exec(block)
    const category = /category:\s*'([^']+)'/.exec(block)
    const bodyBlock = /body:\s*\[([\s\S]*?)\],\s*sources:/.exec(block)
    const bodies = []
    if (bodyBlock) {
      const pr = /'((?:\\'|[^'])*)'/g
      let pm
      while ((pm = pr.exec(bodyBlock[1]))) {
        bodies.push(pm[1].replace(/\\'/g, "'"))
      }
    }
    const sourcesBlock = /sources:\s*\[([\s\S]*?)\],\s*published:/.exec(block)
    const sources = []
    if (sourcesBlock) {
      const sr =
        /\{\s*label:\s*((?:'(?:\\'|[^'])*'\s*\+\s*)*'(?:\\'|[^'])*')\s*,\s*url:\s*'([^']+)'\s*,?\s*\}/g
      let sm
      while ((sm = sr.exec(sourcesBlock[1]))) {
        sources.push({ label: parseStringExpr(sm[1]), url: sm[2] })
      }
    }
    articles.push({
      slug,
      title: titleStr,
      dek: dek ? dek[1].replace(/\\'/g, "'") : '',
      date: date?.[1] ?? '',
      category: category?.[1] ?? 'REPORTS',
      body: bodies,
      sources,
    })
  }
  return articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const CSS = `:root{--bg:#121212;--panel:#1C1C1C;--manila:#E8DCC8;--manila-ink:#1A1510;--cream:#F3EDE3;--muted:#9A948A;--rule:#2A2A2A;--stamp:#D1001F;--mono:"IBM Plex Mono",ui-monospace,monospace;--sans:"IBM Plex Sans",system-ui,sans-serif}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--cream);font-family:var(--sans);line-height:1.55;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}a:hover{color:var(--manila)}.shell{max-width:1100px;margin:0 auto;padding:28px 40px 80px}.chrome{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:18px}.chrome a{color:var(--cream)}.chrome span{color:var(--stamp)}.cover{background:var(--manila);color:var(--manila-ink);padding:28px 32px;border:1px solid #c9bba3;box-shadow:0 12px 36px rgba(0,0,0,.4);margin-bottom:28px}.stamp{display:inline-block;font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.14em;border:2px solid var(--stamp);color:var(--stamp);padding:4px 9px;transform:rotate(-4deg);margin-right:6px}.cover h1{font-size:clamp(1.5rem,3.5vw,2.4rem);line-height:1.15;margin:14px 0;color:var(--manila-ink)}.dek{color:#3d3830;max-width:58ch}.meta{font-family:var(--mono);font-size:11px;color:#5a5348;text-transform:uppercase;margin-top:16px;padding-top:14px;border-top:1px dashed #c4b59a}.body p{font-size:18px;line-height:1.6;max-width:42rem;color:var(--cream)}.exhibits{margin-top:36px}.exhibits h2{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}.exhibit-list{background:var(--manila);color:var(--manila-ink);border:1px solid #c9bba3}.exhibit-item{display:block;padding:14px 18px;border-bottom:1px dashed #c4b59a;border-left:3px solid var(--stamp);color:var(--manila-ink)}.exhibit-item:last-child{border-bottom:none}.exhibit-id{font-family:var(--mono);font-size:10px;font-weight:700;color:var(--stamp);letter-spacing:.1em}.list a{display:block;background:var(--manila);color:var(--manila-ink);padding:18px 20px;margin-bottom:14px;border:1px solid #c9bba3}.list a h3{margin:8px 0;color:var(--manila-ink)}.list .d{color:#3d3830;font-size:14px}@media(max-width:720px){.shell{padding:20px 18px 64px}}`

function articleHtml(a) {
  const paras = a.body.map((p) => `<p>${esc(p)}</p>`).join('')
  const sources = a.sources
    .map(
      (s, i) =>
        `<a class="exhibit-item" href="${esc(s.url)}" rel="noreferrer noopener" target="_blank"><span class="exhibit-id">EX-${String(i + 1).padStart(2, '0')}</span> ${esc(s.label)}</a>`,
    )
    .join('')
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${esc(a.title)} — The Donald Files</title><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;600;700&display=swap" rel="stylesheet"/><style>${CSS}</style></head><body>
<div class="shell">
<div class="chrome"><a href="/">← THE DONALD FILES</a> · <a href="/reports/">Reports</a> · FILE // <span>${esc(a.slug)}</span></div>
<section class="cover"><span class="stamp">FACT</span> <span class="stamp">REPORT</span>
<h1>${esc(a.title)}</h1>
<p class="dek">${esc(a.dek)}</p>
<div class="meta">${esc(a.date)} · By The Donald Files desk</div>
</section>
<article class="body">${paras}</article>
<section class="exhibits"><h2>SOURCE FILES //</h2><div class="exhibit-list">${sources}</div></section>
</div>
</body></html>`
}

function indexHtml(articles) {
  const items = articles
    .map(
      (a) =>
        `<a href="/reports/${esc(a.slug)}/"><span class="stamp">FACT</span><h3>${esc(a.title)}</h3><p class="d">${esc(a.dek)}</p></a>`,
    )
    .join('')
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Reports — The Donald Files</title><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=IBM+Plex+Sans:wght@400;700&display=swap" rel="stylesheet"/><style>${CSS}</style></head><body>
<div class="shell">
<div class="chrome"><a href="/">THE DONALD FILES</a> · FILE // <span>REPORTS</span></div>
<h1 style="color:var(--cream)">Reports</h1>
<div class="list">${items}</div>
</div>
</body></html>`
}

const articles = extractArticles(src)
if (!articles.length) {
  console.error('No published articles parsed')
  process.exit(1)
}

mkdirSync(join(dist, 'reports'), { recursive: true })
writeFileSync(join(dist, 'reports', 'index.html'), indexHtml(articles))
for (const a of articles) {
  const dir = join(dist, 'reports', a.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), articleHtml(a))
}
console.log(`Generated ${articles.length} Open Dossier static report pages`)
