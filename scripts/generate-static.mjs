/** Post-build: /reports index = hybrid ugly; /reports/:slug = Open Dossier. */
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { extractArticles, hrefFor } from './lib/articles.mjs'
import { headTags, newsArticleLd, clipLd, isoDate, etNoon, urlFor, articleOg, embedUrlFor, SITE, DEFAULT_OG } from './lib/seo.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const articlesPath = join(root, 'src/content/articles.ts')
const dist = join(root, 'dist')
const src = readFileSync(articlesPath, 'utf8')


function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const INDEX_CSS = `:root{--bg:#0A0A0A;--panel:#141414;--stamp-red:#FF1A1A;--stamp-yellow:#FFE600;--stamp-ink:#0A0A0A;--cream:#F3EDE3;--manila:#E8DCC8;--muted:#A8A29A;--rule:#2A2A2A;--display:"Anton",Impact,"Arial Narrow",sans-serif;--mono:"IBM Plex Mono",ui-monospace,monospace;--sans:"Inter",system-ui,sans-serif}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--cream);font-family:var(--sans);line-height:1.45;-webkit-font-smoothing:antialiased;min-height:100vh}a{color:inherit;text-decoration:none}.ticker{background:var(--stamp-red);color:#fff;border-bottom:3px solid var(--stamp-yellow);font-family:var(--mono);font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:14px 18px;line-height:1.45}.mast{border-bottom:4px solid var(--stamp-red);padding:16px 20px;max-width:1200px;margin:0 auto}.brand{font-family:var(--display);font-size:clamp(2rem,5vw,3.4rem);line-height:.9;text-transform:uppercase;color:#fff;text-shadow:3px 3px 0 var(--stamp-red)}.brand em{font-style:normal;color:var(--stamp-red);text-shadow:2px 2px 0 var(--stamp-yellow)}.kicker{font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--stamp-yellow);margin-bottom:4px}.shell{max-width:1200px;margin:0 auto;padding:24px 20px 80px}.sec{font-family:var(--display);font-size:clamp(1.6rem,4vw,2.4rem);text-transform:uppercase;margin:28px 0 14px;display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}.sec .note{font-family:var(--mono);font-size:11px;letter-spacing:.12em;color:var(--muted);font-weight:600}.lead{background:var(--panel);border:3px solid var(--stamp-red);padding:22px 24px;margin-bottom:24px;position:relative}.lead .stamps{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}.stamp{display:inline-block;font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;border:2px solid var(--stamp-red);color:var(--stamp-red);padding:4px 9px;transform:rotate(-3deg)}.stamp.filled{background:var(--stamp-red);color:#fff}.stamp.yellow{background:var(--stamp-yellow);color:var(--stamp-ink);border-color:var(--stamp-yellow);transform:rotate(2deg)}.lead h1{font-family:var(--display);font-size:clamp(1.8rem,5vw,3.2rem);line-height:.95;text-transform:uppercase;margin:8px 0 12px}.lead h1 .hot{color:var(--stamp-red)}.lead .dek{color:var(--muted);max-width:62ch;font-size:15px}.lead a.open{display:inline-block;margin-top:16px;font-family:var(--mono);font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:var(--stamp-yellow);color:var(--stamp-ink);padding:10px 16px;border:2px solid var(--stamp-ink)}.stack{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;margin-bottom:28px}.card{display:block;background:var(--manila);color:#1A1510;padding:24px 24px 20px;border:2px solid #c9bba3;transform:rotate(-1deg);box-shadow:6px 6px 0 #000}.card:nth-child(even){background:#F3EDE3;transform:rotate(1.2deg)}.card .fid{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#5a5348;margin-bottom:8px}.card h3{font-family:var(--display);font-size:1.35rem;line-height:1.05;text-transform:uppercase;margin:0 0 8px;color:#1A1510}.card .d{font-size:14px;color:#3d3830;margin:0}.hostile{border-top:3px solid var(--rule)}.hostile a{display:grid;grid-template-columns:48px 1fr auto;gap:14px;align-items:center;padding:18px 8px;border-bottom:1px solid var(--rule);min-height:72px}.hostile .rank{font-family:var(--display);font-size:1.6rem;color:var(--stamp-red)}.hostile h3{font-size:1.05rem;margin:0 0 4px;line-height:1.2}.hostile p{margin:0;font-family:var(--mono);font-size:13px;line-height:1.4;color:var(--muted);letter-spacing:.04em}.hostile .go{font-family:var(--mono);font-size:13px;font-weight:700;letter-spacing:.1em;color:var(--stamp-yellow);border:2px solid var(--stamp-yellow);padding:10px 14px;align-self:center}.foot{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);padding:24px 20px;border-top:1px solid var(--rule);max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.foot strong{color:var(--cream)}@media(max-width:720px){.hostile a{grid-template-columns:40px 1fr}.hostile .go{display:none}}`

const CSS = `:root{--bg:#121212;--panel:#1C1C1C;--manila:#E8DCC8;--manila-ink:#1A1510;--cream:#F3EDE3;--muted:#9A948A;--rule:#2A2A2A;--stamp:#D1001F;--mono:"IBM Plex Mono",ui-monospace,monospace;--sans:"IBM Plex Sans",system-ui,sans-serif}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--cream);font-family:var(--sans);line-height:1.55;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}a:hover{color:var(--manila)}.shell{max-width:1100px;margin:0 auto;padding:28px 40px 80px}.chrome{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:18px}.chrome a{color:var(--cream)}.chrome span{color:var(--stamp)}.cover{background:var(--manila);color:var(--manila-ink);padding:28px 32px;border:1px solid #c9bba3;box-shadow:0 12px 36px rgba(0,0,0,.4);margin-bottom:28px}.stamp{display:inline-block;font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.14em;border:2px solid var(--stamp);color:var(--stamp);padding:4px 9px;transform:rotate(-4deg);margin-right:6px}.cover h1{font-size:clamp(1.5rem,3.5vw,2.4rem);line-height:1.15;margin:14px 0;color:var(--manila-ink)}.dek{color:#3d3830;max-width:58ch}.meta{font-family:var(--mono);font-size:11px;color:#5a5348;text-transform:uppercase;margin-top:16px;padding-top:14px;border-top:1px dashed #c4b59a}.body p{font-size:18px;line-height:1.6;max-width:42rem;color:var(--cream)}.video-embed{margin:1.25rem 0 1.5rem;max-width:42rem}.video-embed-frame{position:relative;width:100%;aspect-ratio:16/9;background:#0a0a0a;border:1px solid var(--rule);overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.35)}.video-embed-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}.video-embed-cap{margin-top:8px;font-family:var(--mono);font-size:11px;letter-spacing:.04em;color:var(--muted);line-height:1.4}.video-embed-title{color:var(--cream);font-weight:600}.exhibits{margin-top:36px}.exhibits h2{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}.exhibit-list{background:var(--manila);color:var(--manila-ink);border:1px solid #c9bba3}.exhibit-item{display:block;padding:14px 18px;border-bottom:1px dashed #c4b59a;border-left:3px solid var(--stamp);color:var(--manila-ink)}.exhibit-item:last-child{border-bottom:none}.exhibit-id{font-family:var(--mono);font-size:10px;font-weight:700;color:var(--stamp);letter-spacing:.1em}.list a{display:block;background:var(--manila);color:var(--manila-ink);padding:18px 20px;margin-bottom:14px;border:1px solid #c9bba3}.list a h3{margin:8px 0;color:var(--manila-ink)}.list .d{color:#3d3830;font-size:14px}.related{margin-top:30px}.related h2{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--muted)}.related-item{display:block;padding:12px 16px;border:1px solid var(--rule);border-left:3px solid #FFD400;margin-bottom:8px;max-width:42rem}.related-k{font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.08em;color:#FFD400;text-transform:uppercase;margin-right:6px}@media(max-width:720px){.shell{padding:20px 18px 64px}}`


function extractYoutubeId(raw) {
  if (!raw) return null
  const s = String(raw).trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s
  try {
    const u = new URL(s)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const v = u.searchParams.get('v')
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v
      const parts = u.pathname.split('/').filter(Boolean)
      if (parts.length >= 2 && ['embed', 'shorts', 'live', 'v'].includes(parts[0])) {
        const id = parts[1]
        return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
      }
    }
  } catch {}
  const m = s.match(/(?:^|[/?=])([a-zA-Z0-9_-]{11})(?:$|[?&#])/)
  return m ? m[1] : null
}

function nocookieEmbed(e) {
  const id =
    extractYoutubeId(e?.id) ||
    extractYoutubeId(e?.youtubeUrl) ||
    extractYoutubeId(e?.embedUrl)
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}

function videoFigureHtml(e) {
  const src = nocookieEmbed(e)
  if (!src) return ''
  const title = esc(e.title || 'YouTube video exhibit')
  const capBits = []
  if (e.title) capBits.push(`<span class="video-embed-title">${esc(e.title)}</span>`)
  if (e.title && e.caption) capBits.push('<span> · </span>')
  if (e.caption) capBits.push(`<span>${esc(e.caption)}</span>`)
  const cap = capBits.length
    ? `<figcaption class="video-embed-cap">${capBits.join('')}</figcaption>`
    : ''
  return `<figure class="video-embed video-embed--dossier"><div class="video-embed-frame"><iframe src="${esc(src)}" title="${title}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>${cap}</figure>`
}

const BY_SLUG = new Map()

function relatedHtml(a) {
  const items = []
  if (a.relatedArticle && BY_SLUG.get(a.relatedArticle)) items.push(['Read the full file', BY_SLUG.get(a.relatedArticle)])
  for (const s of a.relatedClips || []) if (BY_SLUG.get(s)) items.push([a.kind === 'clip' ? 'Related clip' : 'Watch the clip', BY_SLUG.get(s)])
  if (!items.length) return ''
  return `<section class="related"><h2>RELATED //</h2>${items
    .map(([k, r]) => `<a class="related-item" href="${esc(hrefFor(r))}"><span class="related-k">${esc(k)}</span> ${esc(r.title)}</a>`)
    .join('')}</section>`
}

function punchHed(title, punch) {
  const t = esc(title)
  if (!punch) return t
  const p = esc(punch)
  return t.includes(p) ? t.replace(p, `<em>${p}</em>`) : t
}

const PLAY = '<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>'

function embedHtml(e, { before = false } = {}) {
  if (!e) return ''
  const who = e.accountName ? `${esc(e.accountName)}${e.account ? ` (${esc(e.account)})` : ''}` : esc(e.account || '')
  if (e.type === 'truthsocial') {
    return `<figure class="clip-embed clip-quote"><div class="quote-card"><div class="quote-src">TRUTH SOCIAL · ${who}</div><p class="quote-note">A text post, not a video. Read it in full on the Trump’s Truth archive, which keeps a copy if the original disappears.</p><div class="quote-links"><a href="${esc(e.archiveUrl || e.url)}" target="_blank" rel="noopener noreferrer">Read the post (archive) ↗</a><a href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">Original on Truth Social ↗</a></div></div></figure>`
  }
  const platform = e.type === 'x' ? 'X' : 'YOUTUBE'
  const poster = e.type === 'youtube' ? `<img class="poster" src="https://i.ytimg.com/vi/${esc(e.id)}/hqdefault.jpg" alt="" width="480" height="360" loading="${before ? 'lazy' : 'eager'}" decoding="async"/>` : ''
  const label = before && e.label ? `<div class="before-label">BEFORE · ${esc(e.label)}</div>` : ''
  return `<figure class="clip-embed${before ? ' clip-before' : ''}">${label}<a class="facade" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer" data-type="${e.type}" data-id="${esc(e.id)}" data-url="${esc(e.url)}" aria-label="Play the clip from ${who} on ${platform === 'X' ? 'X' : 'YouTube'}">${poster}<span class="badge">${platform}</span>${PLAY}${e.type === 'x' ? `<span class="facade-who">${who}</span>` : ''}</a><figcaption class="credit">Original upload: ${who} on ${platform === 'X' ? 'X' : 'YouTube'} <a href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">↗</a></figcaption></figure>`
}

const FACADE_JS = `document.addEventListener('click',function(ev){var a=ev.target.closest&&ev.target.closest('a.facade');if(!a)return;ev.preventDefault();var t=a.dataset.type,id=a.dataset.id,u=a.dataset.url,box=a.parentNode;if(t==='youtube'){var f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1';f.title='Video';f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';f.allowFullscreen=true;f.referrerPolicy='strict-origin-when-cross-origin';f.className='yt';a.replaceWith(f);return}if(t==='x'){var q=document.createElement('blockquote');q.className='twitter-tweet';q.setAttribute('data-theme','dark');q.setAttribute('data-dnt','true');q.setAttribute('data-align','center');var l=document.createElement('a');l.href=u.replace('https://x.com/','https://twitter.com/');l.textContent='View the post on X';q.appendChild(l);var w=document.createElement('div');w.className='x-wrap';w.appendChild(q);a.replaceWith(w);if(window.twttr&&window.twttr.widgets){window.twttr.widgets.load(w)}else if(!document.getElementById('twjs')){var s=document.createElement('script');s.id='twjs';s.async=true;s.src='https://platform.twitter.com/widgets.js';document.body.appendChild(s)}}});`

const CLIP_CSS = `.clip-hero{margin:6px 0 22px}.kicker{display:inline-block;background:#FFD400;color:#000;font-family:"Antonio","Anton",Impact,sans-serif;font-weight:700;font-size:15px;letter-spacing:.06em;text-transform:uppercase;padding:6px 10px 5px;transform:rotate(-1.5deg)}.clip-hero h1{font-family:"Antonio","Anton",Impact,sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(2rem,5.4vw,4rem);line-height:1.04;margin:14px 0 10px;color:#F4EFE6;text-wrap:balance;max-width:22ch}.clip-hero h1 em{font-style:normal;color:#fff;background:linear-gradient(transparent 12%,#D1001F 12%,#D1001F 94%,transparent 94%);padding:0 .08em;box-decoration-break:clone;-webkit-box-decoration-break:clone}.clip-meta{font-family:var(--mono);font-size:12px;color:var(--muted);letter-spacing:.06em}.clip-embed{margin:0 0 26px;max-width:960px}.facade{position:relative;display:flex;align-items:center;justify-content:center;aspect-ratio:16/9;width:100%;background:radial-gradient(800px 400px at 80% 0%,#2a0006 0%,transparent 60%),#0E0E0E;border:1px solid var(--rule);overflow:hidden;color:#FFD400}.facade::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 3px);pointer-events:none}.facade .poster{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.75}.facade .play{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;width:96px;height:96px;border-radius:50%;background:rgba(0,0,0,.72);border:3px solid #FFD400;transition:transform .15s}.facade:hover .play{transform:scale(1.08)}.facade .badge{position:absolute;top:12px;left:12px;z-index:1;font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.12em;background:#000;color:#F4EFE6;padding:4px 8px}.facade-who{position:absolute;bottom:14px;left:14px;z-index:1;font-family:var(--mono);font-size:13px;color:#cfc6b8}.credit{margin-top:8px;font-family:var(--mono);font-size:12px;color:var(--muted)}.credit a{color:#FFD400}.x-wrap{display:flex;justify-content:center;min-height:200px}.clip-embed iframe.yt{width:100%;aspect-ratio:16/9;border:0;display:block}.clip-before{max-width:640px}.before-label{font-family:var(--mono);font-size:12px;letter-spacing:.06em;color:#FFD400;margin-bottom:8px}.quote-card{background:#E8DCC8;color:#1A1510;border-top:6px solid #D1001F;padding:22px 26px}.quote-src{font-family:var(--mono);font-size:12px;font-weight:700;letter-spacing:.1em;color:#5a5348}.quote-note{font-family:"IBM Plex Serif",Georgia,serif;font-size:17px;margin:10px 0 14px}.quote-links{display:flex;gap:18px;flex-wrap:wrap;font-family:var(--mono);font-size:13px;font-weight:700}.quote-links a{color:#D1001F}.body p{font-family:"IBM Plex Serif",Georgia,serif;font-size:19px;line-height:1.6;max-width:680px}.related{margin-top:30px}.related h2{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--muted)}.related-item{display:block;padding:12px 16px;border:1px solid var(--rule);border-left:3px solid #FFD400;margin-bottom:8px;max-width:760px}.related-k{font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.08em;color:#FFD400;text-transform:uppercase;margin-right:6px}`

function clipHtml(a) {
  const paras = a.body.map((p) => `<p>${esc(p)}</p>`).join('')
  const sources = a.sources
    .map((s, i) => `<a class="exhibit-item" href="${esc(s.url)}" rel="noreferrer noopener" target="_blank"><span class="exhibit-id">EX-${String(i + 1).padStart(2, '0')}</span> ${esc(s.label)}</a>`)
    .join('')
  const isVideo = a.embed && a.embed.type !== 'truthsocial'
  const pageTitle = `${a.title} | ${isVideo ? 'Trump Video' : 'Trump Watch'} | The Donald Files`
  const head = headTags({
    title: a.title,
    description: a.dek || a.title,
    url: urlFor(a),
    image: articleOg(a.slug),
    type: isVideo ? 'video.other' : 'article',
    published: a.publishedAt || isoDate(a.date),
    section: 'Trump Videos',
    jsonLd: clipLd(a),
  })
  const dateLabel = new Date(etNoon(a.date)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' })
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${esc(pageTitle)}</title>${head}<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link href="https://fonts.googleapis.com/css2?family=Antonio:wght@700&family=IBM+Plex+Mono:wght@400;600;700&family=IBM+Plex+Sans:wght@400;600;700&family=IBM+Plex+Serif:ital,wght@0,400;1,400&display=swap" rel="stylesheet"/><style>${CSS}${CLIP_CSS}</style></head><body>
<div class="shell">
<nav class="chrome" aria-label="Breadcrumb"><a href="/">← THE DONALD FILES</a> · <a href="/reports/">Latest</a> · TRUMP VIDEOS // <span>${esc((a.topics && a.topics[0]) || 'clip')}</span></nav>
<header class="clip-hero">${a.ogKicker ? `<span class="kicker">${esc(a.ogKicker)}</span>` : ''}
<h1>${punchHed(a.title, a.ogPunch)}</h1>
<div class="clip-meta"><time datetime="${esc(etNoon(a.date))}">${esc(dateLabel)}</time>${a.duration ? ` · ${esc(a.duration)}` : ''}</div>
</header>
${embedHtml(a.embed)}
<article class="body">${paras}</article>
${a.beforeEmbed ? embedHtml(a.beforeEmbed, { before: true }) : ''}
${relatedHtml(a)}<section class="exhibits"><h2>SOURCE FILES //</h2><div class="exhibit-list">${sources}</div></section>
</div>
<script>${FACADE_JS}</script>
</body></html>`
}

function hubHtml(clips) {
  const items = clips
    .map((a) => `<a class="related-item" href="${esc(hrefFor(a))}">${a.ogKicker ? `<span class="related-k">${esc(a.ogKicker)}</span> ` : ''}${esc(a.title)}<br><span class="clip-meta">${esc(a.date)}</span></a>`)
    .join('')
  const head = headTags({
    title: 'Trump Videos — The Donald Files',
    description: 'Trump on tape: the clips, the receipts and the sources, newest first.',
    url: `${SITE}/trump-videos/`,
    image: DEFAULT_OG,
    type: 'website',
  })
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Trump Videos — The Donald Files</title>${head}<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link href="https://fonts.googleapis.com/css2?family=Antonio:wght@700&family=IBM+Plex+Mono:wght@400;600;700&family=IBM+Plex+Sans:wght@400;600;700&family=IBM+Plex+Serif&display=swap" rel="stylesheet"/><style>${CSS}${CLIP_CSS}</style></head><body>
<div class="shell">
<nav class="chrome"><a href="/">← THE DONALD FILES</a> · <a href="/reports/">Latest</a> · <span>TRUMP VIDEOS</span></nav>
<header class="clip-hero"><span class="kicker">ON TAPE</span><h1>Trump <em>Videos</em></h1><div class="clip-meta">${clips.length} clips · newest first · every one sourced</div></header>
<section class="related">${items}</section>
</div></body></html>`
}

function articleHtml(a) {
  const embeds = a.embeds || []
  const byAfter = new Map()
  for (const e of embeds) {
    const raw = e.afterBodyIndex
    const idx =
      raw === undefined || raw === null
        ? a.body.length - 1
        : Math.max(0, Math.min(a.body.length - 1, raw))
    const list = byAfter.get(idx) || []
    list.push(e)
    byAfter.set(idx, list)
  }
  const paras = a.body
    .map((p, i) => {
      const figs = (byAfter.get(i) || []).map(videoFigureHtml).join('')
      return `<div class="body-block"><p>${esc(p)}</p>${figs}</div>`
    })
    .join('')
  const sources = a.sources
    .map(
      (s, i) =>
        `<a class="exhibit-item" href="${esc(s.url)}" rel="noreferrer noopener" target="_blank"><span class="exhibit-id">EX-${String(i + 1).padStart(2, '0')}</span> ${esc(s.label)}</a>`,
    )
    .join('')
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${esc(a.title)} — The Donald Files</title>${headTags({ title: a.title, description: a.dek || a.title, url: urlFor(a), image: articleOg(a.slug), type: 'article', published: isoDate(a.date), section: a.category, noindex: a.fixture, jsonLd: newsArticleLd(a) })}<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;600;700&display=swap" rel="stylesheet"/><style>${CSS}</style></head><body>
<div class="shell">
<div class="chrome"><a href="/">← THE DONALD FILES</a> · <a href="/reports/">Reports</a> · FILE // <span>${esc(a.slug)}</span></div>
<section class="cover">${a.proseArticle ? '' : '<span class="stamp">FACT</span> <span class="stamp">REPORT</span>'}
<h1>${esc(a.title)}</h1>
<p class="dek">${esc(a.dek)}</p>
<div class="meta">${esc(a.date)} · By The Donald Files desk</div>
</section>
<article class="body">${paras}</article>
${relatedHtml(a)}<section class="exhibits"><h2>SOURCE FILES //</h2><div class="exhibit-list">${sources}</div></section>
</div>
</body></html>`
}

function indexHtml(articles) {
  const lead = articles[0]
  const rest = articles.slice(1)
  const cards = rest
    .map(
      (a, i) =>
        `<a class="card" href="${esc(hrefFor(a))}"><div class="fid">FILE // ${String(i + 2).padStart(2, '0')}${a.proseArticle ? '' : ' · REPORT'}</div><h3>${esc(a.title)}</h3><p class="d">${esc(a.dek)}</p></a>`,
    )
    .join('')
  const rows = articles
    .map(
      (a, i) =>
        `<a href="${esc(hrefFor(a))}"><div class="rank">${String(i + 1).padStart(2, '0')}</div><div><h3>${esc(a.title)}</h3><p>Heat rank · open the file</p></div><span class="go">OPEN →</span></a>`,
    )
    .join('')
  const leadBlock = lead
    ? `<article class="lead">${lead.proseArticle ? '' : '<div class="stamps"><span class="stamp filled">FACT</span><span class="stamp">REPORT</span></div>'}<h1>${esc(lead.title)}</h1><p class="dek">${esc(lead.dek)}</p><a class="open" href="${esc(hrefFor(lead))}">OPEN THE FILE →</a></article>`
    : ''
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Reports — The Donald Files</title>${headTags({ title: 'Reports — The Donald Files', description: 'Every open file: sourced Trump reporting, snark and receipts from The Donald Files, newest first.', url: `${SITE}/reports/`, image: DEFAULT_OG, type: 'website' })}<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link href="https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;600;700&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet"/><style>${INDEX_CSS}</style></head><body>
<div class="ticker">FIGHT ▸ · EVERY FILE · SOURCED · NEWEST FIRST</div>
<header class="mast"><div class="kicker">HOSTILE ARCHIVE · NOT A NEWSROOM</div><div class="brand">THE <em>DONALD</em> FILES</div></header>
<div class="shell">
<div class="sec">Open / Reports <span class="note">${String(articles.length).padStart(2, '0')} FILES</span></div>
${leadBlock}
<div class="sec">More / Stacked <span class="note">Pasted · crooked · manila</span></div>
<div class="stack">${cards}</div>
<div class="sec">Rage / Rank <span class="note">Hierarchy by heat</span></div>
<div class="hostile">${rows}</div>
</div>
<footer class="foot"><div><strong>THE DONALD FILES</strong> · every report, newest first</div><div>Sources linked on every file</div></footer>
</body></html>`
}

const articles = extractArticles(src)
if (!articles.length) {
  console.error('No published articles parsed')
  process.exit(1)
}

const feedArticles = articles.filter((a) => !a.fixture)

mkdirSync(join(dist, 'reports'), { recursive: true })
writeFileSync(join(dist, 'reports', 'index.html'), indexHtml(feedArticles))
for (const a of articles) BY_SLUG.set(a.slug, a)
let nClips = 0
for (const a of articles) {
  const isClip = a.kind === 'clip'
  const dir = join(dist, isClip ? 'trump-videos' : 'reports', a.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), isClip ? clipHtml(a) : articleHtml(a))
  if (isClip) nClips++
}
mkdirSync(join(dist, 'trump-videos'), { recursive: true })
writeFileSync(join(dist, 'trump-videos', 'index.html'), hubHtml(feedArticles.filter((a) => a.kind === 'clip')))
console.log(
  `Generated hybrid /reports index (${feedArticles.length} feed) + ${articles.length - nClips} article pages + ${nClips} clip pages`,
)
