/** Post-build: /reports index = hybrid ugly; /reports/:slug = Open Dossier. */
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

const INDEX_CSS = `:root{--bg:#0A0A0A;--panel:#141414;--stamp-red:#FF1A1A;--stamp-yellow:#FFE600;--stamp-ink:#0A0A0A;--cream:#F3EDE3;--manila:#E8DCC8;--muted:#A8A29A;--rule:#2A2A2A;--display:"Anton",Impact,"Arial Narrow",sans-serif;--mono:"IBM Plex Mono",ui-monospace,monospace;--sans:"Inter",system-ui,sans-serif}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--cream);font-family:var(--sans);line-height:1.45;-webkit-font-smoothing:antialiased;min-height:100vh}a{color:inherit;text-decoration:none}.ticker{background:var(--stamp-red);color:#fff;border-bottom:3px solid var(--stamp-yellow);font-family:var(--mono);font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:14px 18px;line-height:1.45}.mast{border-bottom:4px solid var(--stamp-red);padding:16px 20px;max-width:1200px;margin:0 auto}.brand{font-family:var(--display);font-size:clamp(2rem,5vw,3.4rem);line-height:.9;text-transform:uppercase;color:#fff;text-shadow:3px 3px 0 var(--stamp-red)}.brand em{font-style:normal;color:var(--stamp-red);text-shadow:2px 2px 0 var(--stamp-yellow)}.kicker{font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--stamp-yellow);margin-bottom:4px}.shell{max-width:1200px;margin:0 auto;padding:24px 20px 80px}.sec{font-family:var(--display);font-size:clamp(1.6rem,4vw,2.4rem);text-transform:uppercase;margin:28px 0 14px;display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}.sec .note{font-family:var(--mono);font-size:11px;letter-spacing:.12em;color:var(--muted);font-weight:600}.lead{background:var(--panel);border:3px solid var(--stamp-red);padding:22px 24px;margin-bottom:24px;position:relative}.lead .stamps{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}.stamp{display:inline-block;font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;border:2px solid var(--stamp-red);color:var(--stamp-red);padding:4px 9px;transform:rotate(-3deg)}.stamp.filled{background:var(--stamp-red);color:#fff}.stamp.yellow{background:var(--stamp-yellow);color:var(--stamp-ink);border-color:var(--stamp-yellow);transform:rotate(2deg)}.lead h1{font-family:var(--display);font-size:clamp(1.8rem,5vw,3.2rem);line-height:.95;text-transform:uppercase;margin:8px 0 12px}.lead h1 .hot{color:var(--stamp-red)}.lead .dek{color:var(--muted);max-width:62ch;font-size:15px}.lead a.open{display:inline-block;margin-top:16px;font-family:var(--mono);font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:var(--stamp-yellow);color:var(--stamp-ink);padding:10px 16px;border:2px solid var(--stamp-ink)}.stack{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;margin-bottom:28px}.card{display:block;background:var(--manila);color:#1A1510;padding:24px 24px 20px;border:2px solid #c9bba3;transform:rotate(-1deg);box-shadow:6px 6px 0 #000}.card:nth-child(even){background:#F3EDE3;transform:rotate(1.2deg)}.card .fid{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#5a5348;margin-bottom:8px}.card h3{font-family:var(--display);font-size:1.35rem;line-height:1.05;text-transform:uppercase;margin:0 0 8px;color:#1A1510}.card .d{font-size:14px;color:#3d3830;margin:0}.hostile{border-top:3px solid var(--rule)}.hostile a{display:grid;grid-template-columns:48px 1fr auto;gap:14px;align-items:center;padding:18px 8px;border-bottom:1px solid var(--rule);min-height:72px}.hostile .rank{font-family:var(--display);font-size:1.6rem;color:var(--stamp-red)}.hostile h3{font-size:1.05rem;margin:0 0 4px;line-height:1.2}.hostile p{margin:0;font-family:var(--mono);font-size:13px;line-height:1.4;color:var(--muted);letter-spacing:.04em}.hostile .go{font-family:var(--mono);font-size:13px;font-weight:700;letter-spacing:.1em;color:var(--stamp-yellow);border:2px solid var(--stamp-yellow);padding:10px 14px;align-self:center}.foot{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);padding:24px 20px;border-top:1px solid var(--rule);max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.foot strong{color:var(--cream)}@media(max-width:720px){.hostile a{grid-template-columns:40px 1fr}.hostile .go{display:none}}`

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
  const lead = articles[0]
  const rest = articles.slice(1)
  const cards = rest
    .map(
      (a, i) =>
        `<a class="card" href="/reports/${esc(a.slug)}/"><div class="fid">FILE // ${String(i + 2).padStart(2, '0')} · REPORT</div><h3>${esc(a.title)}</h3><p class="d">${esc(a.dek)}</p></a>`,
    )
    .join('')
  const rows = articles
    .map(
      (a, i) =>
        `<a href="/reports/${esc(a.slug)}/"><div class="rank">${String(i + 1).padStart(2, '0')}</div><div><h3>${esc(a.title)}</h3><p>Heat rank · open the file</p></div><span class="go">OPEN →</span></a>`,
    )
    .join('')
  const leadBlock = lead
    ? `<article class="lead"><div class="stamps"><span class="stamp filled">FACT</span><span class="stamp">REPORT</span></div><h1>${esc(lead.title)}</h1><p class="dek">${esc(lead.dek)}</p><a class="open" href="/reports/${esc(lead.slug)}/">OPEN THE FILE →</a></article>`
    : ''
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Reports — The Donald Files</title><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link href="https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;600;700&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet"/><style>${INDEX_CSS}</style></head><body>
<div class="ticker">FIGHT ▸ · REPORTS INDEX · HYBRID UGLY · ARTICLES STAY OPEN DOSSIER</div>
<header class="mast"><div class="kicker">HOSTILE ARCHIVE · NOT A NEWSROOM</div><div class="brand">THE <em>DONALD</em> FILES</div></header>
<div class="shell">
<div class="sec">Open / Reports <span class="note">${String(articles.length).padStart(2, '0')} FILES</span></div>
${leadBlock}
<div class="sec">More / Stacked <span class="note">Pasted · crooked · manila</span></div>
<div class="stack">${cards}</div>
<div class="sec">Rage / Rank <span class="note">Hierarchy by heat</span></div>
<div class="hostile">${rows}</div>
</div>
<footer class="foot"><div><strong>THE DONALD FILES</strong> · reports index · hybrid ugly</div><div>Article pages stay Open Dossier</div></footer>
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
console.log(`Generated hybrid /reports index + ${articles.length} Open Dossier article pages`)
