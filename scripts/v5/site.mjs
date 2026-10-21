/**
 * The Donald Files — v5 light static site generator (Vex V5-SPEC on top of the V4 IA).
 * Renders every public page as static HTML into dist/: home, /reports/ (Latest), /reports/<slug>/,
 * /trump-videos/ (+ ?page=N via Pages Function), /trump-videos/<topic>/, /trump-videos/<slug>/,
 * /the-record, /about, /subscribe, 404. No client JS is needed to read anything; the small inline
 * script only adds relative times, click-to-load players, copy-link, subscribe and infinite scroll.
 */
import { mkdirSync, writeFileSync, readFileSync, rmSync, cpSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { extractArticles, hrefFor, fileNumbers, liveTopics, attachMedia, TOPIC_LABEL } from '../lib/articles.mjs'
import {
  SITE, SITE_NAME, DEFAULT_OG, esc, headTags, newsArticleLd, clipLd, datesFor, urlFor, articleOg, etNoon,
} from '../lib/seo.mjs'

// ---- switches ----
/** Double opt-in verified end to end (subscribe → email → confirm → unsubscribe). Flip to false to hide every signup surface. */
const SUBSCRIBE_LIVE = true
/** Hidden until Robert says the X account is live. */
const X_ACCOUNT_LIVE = false
const PER_PAGE = Number(process.env.DF_PER_PAGE || 24)

const root = new URL('../..', import.meta.url).pathname
const dist = join(root, 'dist')
const read = (p) => readFileSync(join(root, p), 'utf8')
const all = attachMedia(extractArticles(read('src/content/articles.ts')).filter((a) => !a.fixture), join(root, 'data/clip-media.json'))
const pub = (a) => datesFor(a).published
const byNewest = (x, y) => (pub(y) > pub(x) ? 1 : pub(y) < pub(x) ? -1 : 0)
const posts = all.slice().sort(byNewest)
const clips = posts.filter((a) => a.kind === 'clip')
const files = posts.filter((a) => a.kind !== 'clip')
const fileNo = fileNumbers(all)
const TOPICS = liveTopics(all) // topics that have at least one clip → get a hub
const BY = new Map(all.map((a) => [a.slug, a]))

const CSS = (read('src/styles/tokens.css') + read('src/styles/v5-base.css') + read('src/styles/v5-site.css'))
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s*\n\s*/g, '')
  .replace(/\s{2,}/g, ' ')

// ---------- small helpers ----------
const fmt = (iso, o) => new Date(iso).toLocaleString('en-US', { timeZone: 'America/New_York', ...o })
const shortDate = (a) => fmt(datesFor(a).hasTime ? pub(a) : etNoon(a.date), { month: 'short', day: 'numeric' })
const clockET = (iso) => fmt(iso, { hour: 'numeric', minute: '2-digit' }) + ' ET'
const timeEl = (a, cls = 'ago') => {
  const d = datesFor(a)
  return `<time class="${cls}" datetime="${esc(d.published)}"${d.hasTime ? ' data-rel' : ''}>${esc(shortDate(a))}</time>`
}
function punch(title, p) {
  const t = esc(title)
  if (!p) return t
  const e = esc(p)
  return t.includes(e) ? t.replace(e, `<mark>${e}</mark>`) : t
}
const kickerOf = (a) => a.ogKicker || ''
const PLATFORM = { x: 'X', youtube: 'YouTube', truthsocial: 'Truth Social' }
const ytId = (e) => e.id || /(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/.exec(e.youtubeUrl || e.embedUrl || '')?.[1]
const PLAY = '<svg class="play" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="32"/><path d="M26 20 L46 32 L26 44 Z"/></svg>'
const QUOTE = '<svg class="play" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="32"/><path d="M20 38c0-7 4-12 10-14l1 3c-3 1-5 4-5 6h5v9H20zm15 0c0-7 4-12 10-14l1 3c-3 1-5 4-5 6h5v9H35z"/></svg>'
const dur = (a) => (a.duration ? `<span class="dur">${esc(a.duration)}</span>` : '')

function posterImg(src, eager) {
  return `<img class="poster" src="${esc(src)}" alt="" width="640" height="360" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`
}
function thumb(a, { big = false, eager = false } = {}) {
  const e = a.embed || {}
  const id = e.type === 'youtube' ? ytId(e) : null
  const src = a.poster || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null)
  // No image (e.g. a Truth Social text post): solid blue tile with the kicker. Never grey mock lines.
  const inner = src ? posterImg(src, eager) : `<span class="tkick">${esc(kickerOf(a) || PLATFORM[e.type] || 'Clip')}</span>`
  const bits = `${inner}${e.type === 'truthsocial' ? QUOTE : PLAY}<span class="src">${esc(PLATFORM[e.type] || 'Clip')}</span>${dur(a)}`
  // YouTube-first clips play right in the tile (click-to-load facade; the link fallback is the YouTube page).
  if (a.youtubeId) return `<a class="thumb facade${big ? ' big' : ''}${src ? '' : ' fb'}" href="${esc(e.url)}" target="_blank" rel="noopener" data-type="youtube" data-id="${esc(id)}" data-start="${e.start || 0}" aria-label="Play “${esc(a.title)}” here">${bits}</a>`
  return `<div class="thumb${big ? ' big' : ''}${src ? '' : ' fb'}">${bits}</div>`
}
// Clip tiles land on the player (canonical URLs stay hash-free).
const playHref = (a) => (a.kind === 'clip' && a.embed ? `${hrefFor(a)}#play` : hrefFor(a))
function tile(a, row = false) {
  const meta = `<div class="tmeta">${kickerOf(a) ? `<span class="kick">${esc(kickerOf(a))}</span><span class="dot">·</span>` : ''}${timeEl(a)}</div><h3 class="thed">${punch(a.title, a.ogPunch)}</h3>`
  const full = row ? ` title="${esc(a.title)}" aria-label="${esc(a.title)}"` : ''
  if (a.youtubeId) return `<div class="tile ytile${row ? ' row' : ''}">${thumb(a)}<a class="tbody" href="${esc(hrefFor(a))}"${full}>${meta}</a></div>`
  return `<a class="tile${row ? ' row' : ''}" href="${esc(playHref(a))}"${full}>${thumb(a)}<div class="tbody">${meta}</div></a>`
}
function feat(a) {
  const body = `<div class="tmeta"><span class="new" data-new hidden>New</span>${kickerOf(a) ? `<span class="kick">${esc(kickerOf(a))}</span><span class="dot">·</span>` : ''}${timeEl(a)}</div><h2 class="fhed">${punch(a.title, a.ogPunch)}</h2>${a.dek ? `<p class="fdek">${esc(a.dek)}</p>` : ''}`
  if (a.youtubeId) return `<div class="feat ytile">${thumb(a, { big: true, eager: true })}<a class="fbody" href="${esc(hrefFor(a))}">${body}</a></div>`
  return `<a class="feat" href="${esc(playHref(a))}">${thumb(a, { big: true, eager: true })}<div class="fbody">${body}</div></a>`
}
function card(a) {
  const t = (a.topics || [])[0]
  return `<a class="card" href="${esc(hrefFor(a))}"><div class="cbar"><span class="kick">${esc(kickerOf(a))}</span><span class="file">File ${String(fileNo.get(a.slug) || 0).padStart(3, '0')}</span></div><h3 class="ched">${punch(a.title, a.ogPunch)}</h3><div class="cfoot"><span>${esc(t ? TOPIC_LABEL[t] : a.kind === 'clip' ? 'Clip' : 'File')}</span>${timeEl(a, '')}</div></a>`
}
const chip = (t, on = false, arrow = true) => `<a class="chip${on ? ' on' : ''}" href="/trump-videos/${t}/"${on ? ' aria-current="page"' : ''}>${esc(TOPIC_LABEL[t])}${arrow ? '<span>→</span>' : ''}</a>`
const crumbs = (items) =>
  `<nav class="crumbs wrap" aria-label="Breadcrumb">${items
    .map(([name, href], i) => (i < items.length - 1 ? `<a href="${esc(href)}">${esc(name)}</a><span aria-hidden="true">›</span>` : `<b aria-current="page">${esc(name)}</b>`))
    .join('')}</nav>`
const crumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, href], i) => ({ '@type': 'ListItem', position: i + 1, name, item: href.startsWith('http') ? href : SITE + href })),
})

// ---------- copy (Reed-approved, from design/v4-video-first + v5 mocks) ----------
const FOOT_LINE = 'The administration, annotated. Sourced. Snarky. Receipts attached. Every clip is embedded from its original upload, and every claim links to its source.'
const HUB_INTRO = 'Every Donald Trump clip he’d rather you didn’t rewatch: the gaffes, the lies, the ballroom, the court fights and the cruelty, embedded from the original uploads with our notes and the receipts underneath. Fresh clips land all day, US time.'
// Topic hub intros (Reed-cleared, 21 Oct).
const TOPIC_INTRO = {
  gaffes: 'Every time his mouth outran his brain, on tape. Newest first.',
  'truth-social': 'What he posts at 1am, filed with the receipts underneath.',
  lies: 'He says it on stage, and we check it underneath. The gap is the story.',
  tariffs: 'He says Mexico pays. Your receipts say you do. Every clip has the math underneath.',
  courts: 'Judges he’s lost to, and one he told to go to hell. The court record sits underneath.',
  ballroom: 'He promised it’d be free. Here’s who’s actually paying, with the receipts underneath.',
  cruelty: 'No mask slipping here, because there isn’t one. Every clip is embedded from the original upload, with the sources underneath.',
}
const PROPER_TOPICS = new Set(['truth-social'])
const FAQ = [
  ['Where do these Donald Trump videos come from?', 'Every clip is embedded from its original upload on X or YouTube, usually the White House, C-SPAN, a network or the account that filmed it. We link the source under every video and never re-upload footage.'],
  ['How often is this page updated?', 'All day. The desk adds new Trump clips through the US morning and evening, and the newest always sits at the top.'],
  ['Is The Donald Files neutral?', 'No. We are openly anti-Trump and we mock him. The jokes are ours; the clips and sourced facts are his.'],
  ['Can I share these clips?', 'Yes. Every clip has its own page with a share card, so a link to it unfurls properly on X, WhatsApp and Facebook.'],
  // Hidden until the X account is live AND a daily email actually goes out:
  // ['How do I get new clips first?', 'Follow @TheDonaldFiles on X. A daily email is coming soon.'],
]
const MEMES = [
  { src: '/memes/satire-03-ballroom-gift-receipt.webp', to: '/reports/truth-social-white-house-dump-ballroom/', cap: 'The ballroom gift receipt',
    alt: 'Satire meme: a gift receipt for “1x East Wing Ballroom” marked “Gift — No Taxpayer Dollars*,” with the asterisk pointing to the taxpayer-funded share.' },
  { src: '/memes/satire-01-dividend-void.webp', to: '/reports/trump-dividend-5000-gop-congress/', cap: 'The $5,000 dividend, void',
    alt: 'Satire meme: an oversized fake check made out to “American Voter” for the $5,000 “Trump dividend,” stamped VOID, with fine print saying it’s valid only if the GOP keeps Congress.' },
  { src: '/memes/satire-02-colossus-hiring.webp', to: '/reports/truth-social-colossus-smithsonian-washington/', cap: 'Colossus: now hiring',
    alt: 'Satire meme: a torn “Now Hiring: 30-ft bronze ego” poster riffing on Trump’s giant George Washington statue plan, with bullet points like “apply via Truth Social.”' },
]

// ---------- chrome ----------
function topbar(active) {
  const items = [
    ['Latest', '/reports/', 'latest'],
    ['Trump Videos', '/trump-videos/', 'videos'],
    ['Topics', '/#topics', 'topics'],
    ['The Record', '/the-record', 'record'],
  ]
  const links = items.map(([n, h, k]) => `<a href="${h}"${k === active ? ' class="on" aria-current="page"' : ''}>${n}</a>`).join('')
  const sub = SUBSCRIBE_LIVE ? `<a class="sub" href="/subscribe">Subscribe</a>` : ''
  return `<a class="skip" href="#main">Skip to content</a><header class="topbar"><div class="wrap tb"><a class="logo" href="/">The <mark>Donald</mark> Files</a><nav class="nav" aria-label="Main">${links}${sub}</nav><details class="mnav"><summary class="burger" aria-label="Menu"><i></i><i></i><i></i></summary><nav class="sheet" aria-label="Main">${links}${sub}</nav></details></div></header>`
}
function ticker() {
  const items = posts.slice(0, 8)
  return `<div class="ticker"><div class="wrap tk"><span class="live"><i></i>Latest</span><div class="tkrow">${items
    .map((a) => `<a class="ti" href="${esc(hrefFor(a))}">${timeEl(a, '')}${esc(a.title)}</a>`)
    .join('')}</div></div></div>`
}
function subband(source) {
  if (!SUBSCRIBE_LIVE) return ''
  return `<section class="subband" id="subscribe"><div class="wrap sb"><div><h2 class="sbh">Get the worst of him, <mark>daily</mark>.</h2><p class="sbp">One short email a day: the clips, the receipts, the jokes. Unsubscribe in one click.</p></div>${subForm(source)}</div></section>`
}
const subForm = (source) =>
  `<form class="sbf" data-sub="${esc(source)}" action="/api/subscribe" method="post"><label class="sbl" for="em-${esc(source)}">Your email address</label><input id="em-${esc(source)}" type="email" name="email" required autocomplete="email"><input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><input type="hidden" name="t" value=""><button type="submit">Subscribe</button><p class="sbmsg" data-msg role="status"></p></form>`
function footer() {
  return `<footer class="foot"><div class="wrap fgrid"><div><div class="logo big">The <mark>Donald</mark> Files</div><p class="fline">${esc(FOOT_LINE)}</p></div><div><h4>Watch</h4><a href="/trump-videos/">Trump Videos</a><a href="/reports/">Latest</a><a href="/#memes">Meme Zone</a></div><div><h4>Topics</h4>${TOPICS.map((t) => `<a href="/trump-videos/${t}/">${esc(TOPIC_LABEL[t])}</a>`).join('')}</div><div><h4>Desk</h4><a href="/the-record">The Record</a><a href="/about">About</a>${SUBSCRIBE_LIVE ? '<a href="/subscribe">Subscribe</a>' : ''}<a href="/rss.xml">RSS</a></div></div><div class="wrap fbase"><span>© ${new Date().getFullYear()} The Donald Files</span><span>thedonaldfiles.com</span></div></footer>`
}
const JS = read('scripts/v5/client.js').replace(/^\s*\/\/[^\n]*\n/gm, '').replace(/\s*\n\s*/g, '\n')

const TWJS = '<script async id="twjs" src="https://platform.twitter.com/widgets.js" charset="utf-8" onerror="window.__twFail=1"></script>'
function page({ title, head, active, body, ticker: withTicker = false }) {
  if (body.includes('data-x>')) head += TWJS
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>${head}<link rel="preload" href="/fonts/bricolage-700-800.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/inter-400-700.woff2" as="font" type="font/woff2" crossorigin><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#FAF7F2"><style>${CSS}</style></head><body>${topbar(active)}${withTicker ? ticker() : ''}<main id="main">${body}</main>${footer()}<script>${JS}</script></body></html>`
}
function write(rel, html) {
  const p = join(dist, rel)
  mkdirSync(join(p, '..'), { recursive: true })
  writeFileSync(p, html)
}
const latestMod = (list) => list.map((a) => datesFor(a).modified).sort().pop()

// ---------- pages ----------
function home() {
  const isVid = (c) => c.embed && (c.embed.type === 'x' || c.embed.type === 'youtube')
  const wall = clips.find((c) => c.featured) || clips.find(isVid) || clips[0]
  const rest = clips.filter((c) => c !== wall)
  const side = rest.slice(0, 3)
  const under = rest.slice(3, 6)
  const top = files.slice(0, 4)
  const updated = latestMod(clips)
  const body = `<h1 class="vh">Donald Trump videos, gaffes and lies, mocked daily</h1>
<section class="sec first" aria-labelledby="h-clips"><div class="wrap"><div class="shead"><div><h2 class="stitle" id="h-clips">Today’s <mark>clips</mark></h2><p class="ssub">The worst of him on tape, embedded from X and YouTube. Updated <time datetime="${esc(updated)}">${esc(clockET(updated))}</time>.</p></div><a class="more" href="/trump-videos/">All Trump videos →</a></div>
<div class="cw"><div class="cwf">${feat(wall)}</div><div class="cws">${side.map((a) => tile(a, true)).join('')}</div></div><div class="cwr">${under.map((a) => tile(a)).join('')}</div></div></section>
<section class="sec" aria-labelledby="h-files"><div class="wrap"><div class="shead"><div><h2 class="stitle" id="h-files">Top <mark>files</mark></h2><p class="ssub">The newest sourced files.</p></div><a class="more" href="/reports/">Latest →</a></div><div class="cards">${top.map(card).join('')}</div></div></section>
<section class="sec" id="topics" aria-labelledby="h-topics"><div class="wrap"><div class="shead"><div><h2 class="stitle" id="h-topics">Pick your <mark>outrage</mark></h2><p class="ssub">Topic hubs, every clip in one place.</p></div></div><div class="chips">${TOPICS.map((t) => chip(t)).join('')}</div></div></section>
<section class="sec" id="memes" aria-labelledby="h-memes"><div class="wrap"><div class="shead"><div><h2 class="stitle" id="h-memes">Meme <mark>zone</mark></h2><p class="ssub">Made in-house. Share freely.</p></div></div><div class="memes">${MEMES.map((m) => `<figure class="mm"><a class="mimg" href="${m.to}"><img src="${m.src}" alt="${esc(m.alt)}" width="960" height="540" loading="lazy" decoding="async"><span class="sat">satire</span></a><figcaption><a href="${m.to}">${esc(m.cap)}</a></figcaption></figure>`).join('')}</div></div></section>
${subband('home-band')}`
  const head = headTags({
    title: 'Donald Trump Videos, Gaffes and Lies, Mocked',
    description: 'The worst Donald Trump clips, embedded from the original uploads and annotated with the receipts. Sourced. Snarky. Updated all day, US time.',
    url: `${SITE}/`, image: DEFAULT_OG, type: 'website',
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: `${SITE}/`, inLanguage: 'en-US' },
      { '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: `${SITE}/`, logo: DEFAULT_OG, description: FOOT_LINE },
    ],
  })
  write('index.html', page({ title: 'Donald Trump Videos, Gaffes and Lies, Mocked | The Donald Files', head, active: 'videos', body, ticker: true }))
}

function paginate(list) {
  const pages = []
  for (let i = 0; i < Math.max(1, list.length); i += PER_PAGE) pages.push(list.slice(i, i + PER_PAGE))
  return pages
}
function pager(base, n, total) {
  if (total < 2) return ''
  const href = (k) => (k === 1 ? base : `${base}?page=${k}`)
  return `<nav class="pager" aria-label="Pages">${n > 1 ? `<a rel="prev" href="${href(n - 1)}">← Newer</a>` : '<span></span>'}<span>Page ${n} of ${total}</span>${n < total ? `<a rel="next" class="pnext" href="${href(n + 1)}">Older →</a>` : '<span></span>'}</nav>`
}

function hubPage({ topic }) {
  const list = topic ? clips.filter((c) => (c.topics || []).includes(topic)) : clips
  const label = topic ? TOPIC_LABEL[topic] : null
  const base = topic ? `/trump-videos/${topic}/` : '/trump-videos/'
  const title = topic ? `Donald Trump ${label} Videos | The Donald Files` : 'Donald Trump Videos: The Worst Clips, Annotated | The Donald Files'
  // Sentence case, but proper nouns (Truth Social) keep their capitals.
  const h1Word = topic ? (PROPER_TOPICS.has(topic) ? label : label.toLowerCase()) : ''
  const h1 = topic ? `Donald Trump <mark>${esc(h1Word)}</mark> videos` : 'Donald Trump videos: the worst <mark>clips</mark>, annotated'
  const intro = topic
    ? TOPIC_INTRO[topic] || `Every clip filed under ${h1Word}, embedded from the original uploads with the receipts underneath. Newest first.`
    : HUB_INTRO
  const files4 = topic ? files.filter((f) => (f.topics || []).includes(topic)).slice(0, 4) : []
  const cr = topic ? [['Home', '/'], ['Trump Videos', '/trump-videos/'], [label, base]] : [['Home', '/'], ['Trump Videos', '/trump-videos/']]
  const updated = latestMod(list)
  const pages = paginate(list)
  pages.forEach((items, i) => {
    const n = i + 1
    const url = n === 1 ? `${SITE}${base}` : `${SITE}${base}?page=${n}`
    const faq = !topic && n === 1
    const ld = [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title.replace(/ \| The Donald Files$/, ''), url, description: intro, isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE}/` }, dateModified: updated,
        mainEntity: { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items.map((a, k) => ({ '@type': 'ListItem', position: i * PER_PAGE + k + 1, url: urlFor(a) })) } },
      crumbLd(cr),
    ]
    if (faq) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })
    let head = headTags({ title: title.replace(/ \| The Donald Files$/, ''), description: intro, url, image: DEFAULT_OG, type: 'website', jsonLd: ld })
    if (n > 1) head += `<link rel="prev" href="${n === 2 ? `${SITE}${base}` : `${SITE}${base}?page=${n - 1}`}">`
    if (n < pages.length) head += `<link rel="next" href="${SITE}${base}?page=${n + 1}">`
    const body = `${crumbs(cr)}<section class="hubhead"><div class="wrap"><p class="kick">${topic ? esc(label) : 'Trump videos'}</p><h1 class="h1">${h1}</h1><p class="intro">${esc(intro)}</p><div class="chips filt"><a class="chip${topic ? '' : ' on'}" href="/trump-videos/"${topic ? '' : ' aria-current="page"'}>All clips</a>${TOPICS.map((t) => chip(t, t === topic, false)).join('')}</div><div class="sortrow"><span>Sort: <b>Newest</b></span><span>${list.length} clip${list.length === 1 ? '' : 's'} · updated <time datetime="${esc(updated)}">${esc(clockET(updated))}</time></span></div></div></section>
<section class="sec tight"><div class="wrap"><div class="hgrid" data-grid>${items.map((a) => tile(a)).join('')}</div>${pager(base, n, pages.length)}</div></section>
${files4.length ? `<section class="sec"><div class="wrap"><div class="shead"><div><h2 class="stitle">${esc(label)} <mark>files</mark></h2><p class="ssub">The long reads, sourced.</p></div><a class="more" href="/reports/">Latest →</a></div><div class="cards">${files4.map(card).join('')}</div></div></section>` : ''}
${faq ? `<section class="sec"><div class="wrap"><div class="faqbox"><h2 class="stitle">Donald Trump videos: <mark>FAQ</mark></h2>${FAQ.map(([q, a], k) => `<details class="faq"${k < 2 ? ' open' : ''}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></div></section>` : ''}
${subband(topic ? `hub-${topic}` : 'hub')}`
    write(n === 1 ? `${base.slice(1)}index.html` : `${base.slice(1)}page/${n}/index.html`, page({ title: n === 1 ? title : title.replace(' |', ` (page ${n}) |`), head, active: 'videos', body }))
  })
}

function facade(e, { big = false, label = '', poster: pst = null, kicker = '', anchor = false } = {}) {
  const who = e.accountName ? `${esc(e.accountName)}${e.account ? ` (${esc(e.account)})` : ''}` : esc(e.account || '')
  if (e.type === 'truthsocial') {
    return `<figure class="player"${anchor ? ' id="play"' : ''}><div class="qcard"><p class="qsrc">Truth Social · ${who}</p><p class="qnote">A text post, not a video. Read it in full on the Trump’s Truth archive, which keeps a copy if the original disappears.</p><p class="qlinks"><a href="${esc(e.archiveUrl || e.url)}" target="_blank" rel="noopener noreferrer">Read the post (archive) ↗</a><a href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">Original on Truth Social ↗</a></p></div></figure>`
  }
  const id = e.type === 'youtube' ? ytId(e) : e.id
  const url = e.url || e.youtubeUrl || `https://www.youtube.com/watch?v=${id}`
  const src = pst || e.poster || (e.type === 'youtube' ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null)
  const poster = src ? posterImg(src, big) : `<span class="tkick">${esc(kicker || PLATFORM[e.type])}</span>`
  const plat = PLATFORM[e.type]
  const credit = `<figcaption class="credit">${e.title ? `<b>${esc(e.title)}</b>${e.caption ? ` · ${esc(e.caption)}` : ''} · ` : ''}Original upload${who ? `: ${who}` : ''} on ${plat} <a href="${esc(url)}" target="_blank" rel="noopener noreferrer">↗</a></figcaption>`
  if (e.type === 'x') {
    // X: the real embed renders on page load (widgets.js in <head>). The poster sits on top until X's iframe
    // shows up; if it hasn't after 4s, or widgets.js is blocked, the poster becomes a "Watch on X" button.
    // The blockquote stays invisible until then, so readers never see X's bare fallback link.
    const tw = url.replace('https://x.com/', 'https://twitter.com/')
    return `<figure class="player xp${big ? '' : ' small'}"${anchor ? ' id="play"' : ''}>${label ? `<p class="plabel">${label}</p>` : ''}<div class="xembed" data-x><blockquote class="twitter-tweet" data-dnt="true" data-align="center" data-conversation="none"><a href="${esc(tw)}">${esc(url)}</a></blockquote><a class="xph thumb${big ? ' big' : ''}${src ? '' : ' fb'}" href="${esc(url)}" target="_blank" rel="noopener" aria-label="Watch${e.title ? ` “${esc(e.title)}”` : ' the clip'} on X (opens in a new tab)">${poster}${PLAY}<span class="src">${plat}</span>${who ? `<span class="who">${who}</span>` : ''}<span class="xload" aria-hidden="true">Loading the post from X…</span><span class="xcta">Watch on X ↗</span></a></div>${credit}</figure>`
  }
  return `<figure class="player${big ? '' : ' small'}"${anchor ? ' id="play"' : ''}>${label ? `<p class="plabel">${label}</p>` : ''}<a class="facade thumb${big ? ' big' : ''}${src ? '' : ' fb'}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" data-type="${e.type}" data-id="${esc(id)}" data-start="${e.start || 0}" data-url="${esc(url)}" aria-label="Play${e.title ? ` “${esc(e.title)}”` : ' the clip'} (loads ${plat})">${poster}${PLAY}<span class="src">${plat}</span></a>${credit}</figure>`
}
function sourcesBox(a) {
  return `<section class="srcbox" aria-labelledby="h-src"><h2 id="h-src">Source files</h2><ol>${a.sources.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`).join('')}</ol></section>`
}
function shareRow(a) {
  const u = urlFor(a)
  return `<div class="share"><span>Share</span><a href="https://x.com/intent/post?text=${encodeURIComponent(a.title)}&url=${encodeURIComponent(u)}" target="_blank" rel="noopener noreferrer">X</a><a href="https://wa.me/?text=${encodeURIComponent(`${a.title} ${u}`)}" target="_blank" rel="noopener noreferrer">WhatsApp</a><button type="button" data-copy="${esc(u)}">Copy link</button></div>`
}
function relatedLinks(a) {
  const items = []
  if (a.relatedArticle && BY.get(a.relatedArticle)) items.push(['Read the full file', BY.get(a.relatedArticle)])
  for (const s of a.relatedClips || []) if (BY.get(s)) items.push([a.kind === 'clip' ? 'Related clip' : 'Watch the clip', BY.get(s)])
  if (!items.length) return ''
  return `<section class="rel" aria-label="Related"><h2>Related</h2>${items.map(([k, r]) => `<a href="${esc(hrefFor(r))}"><span>${esc(k)}</span>${esc(r.title)}</a>`).join('')}</section>`
}
const hero = (a, h1) =>
  `<header class="phead">${kickerOf(a) ? `<p class="kick">${esc(kickerOf(a))}</p>` : ''}<h1 class="ph1">${h1}</h1>${a.kind !== 'clip' && a.dek ? `<p class="pdek">${esc(a.dek)}</p>` : ''}<p class="pmeta">${timeLine(a)}${a.duration ? ` · ${esc(a.duration)}` : ''}</p></header>`
function timeLine(a) {
  const { published, modified, hasTime } = datesFor(a)
  const p = hasTime ? `${fmt(published, { month: 'short', day: 'numeric', year: 'numeric' })}, ${clockET(published)}` : fmt(etNoon(a.date), { month: 'short', day: 'numeric', year: 'numeric' })
  let h = `Published <time datetime="${esc(published)}">${esc(p)}</time>`
  if (modified > published) h += ` · Updated <time datetime="${esc(modified)}">${esc(fmt(modified, { month: 'short', day: 'numeric', year: 'numeric' }))}, ${esc(clockET(modified))}</time>`
  return h
}

function clipPage(a) {
  const t = (a.topics || [])[0]
  const cr = [['Home', '/'], ['Trump Videos', '/trump-videos/'], ...(t && TOPICS.includes(t) ? [[TOPIC_LABEL[t], `/trump-videos/${t}/`]] : []), [a.title, hrefFor(a)]]
  const sameTopic = clips.filter((c) => c !== a && (c.topics || []).some((x) => (a.topics || []).includes(x)))
  const related = [...sameTopic, ...clips.filter((c) => c !== a && !sameTopic.includes(c))].slice(0, 6)
  const d = datesFor(a)
  const isVideo = a.embed && a.embed.type !== 'truthsocial'
  const ld = clipLd(a).map((x) => (x['@type'] === 'BreadcrumbList' ? crumbLd(cr) : x))
  const head = headTags({ title: a.title, description: a.dek || a.title, url: urlFor(a), image: articleOg(a.slug), type: isVideo ? 'video.other' : 'article', published: d.published, modified: d.modified, section: 'Trump Videos', jsonLd: ld })
  const body = `${crumbs(cr.map(([n, h], i) => (i === cr.length - 1 ? ['This clip', h] : [n, h])))}<article class="wrap post">${hero(a, punch(a.title, a.ogPunch))}
${a.embed ? facade(a.embed, { big: true, poster: a.poster, kicker: kickerOf(a), anchor: true }) : ''}${a.xEmbed ? `<p class="alsox">Also on X: <a href="${esc(a.xEmbed.url)}" target="_blank" rel="noopener">${esc(a.xEmbed.accountName || a.xEmbed.account || 'the original post')}${a.xEmbed.account && a.xEmbed.accountName ? ` (${esc(a.xEmbed.account)})` : ''} ↗</a></p>` : ''}
<div class="prose">${a.body.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
${a.beforeEmbed ? facade(a.beforeEmbed, { label: `Before · ${esc(a.beforeEmbed.label || '')}` }) : ''}
${relatedLinks(a)}${sourcesBox(a)}${shareRow(a)}</article>
<section class="sec"><div class="wrap"><div class="shead"><div><h2 class="stitle">More <mark>clips</mark></h2></div><a class="more" href="/trump-videos/">All Trump videos →</a></div><div class="cwr">${related.map((c) => tile(c)).join('')}</div><div class="chips topchips">${TOPICS.map((x) => chip(x)).join('')}</div></div></section>
${subband(`clip-${a.slug}`.slice(0, 64))}`
  write(`trump-videos/${a.slug}/index.html`, page({ title: `${a.title} | ${isVideo ? 'Trump Video' : 'Trump Watch'} | The Donald Files`, head, active: 'videos', body }))
}

function articlePage(a) {
  const byAfter = new Map()
  for (const e of a.embeds || []) {
    const idx = e.afterBodyIndex == null ? a.body.length - 1 : Math.max(0, Math.min(a.body.length - 1, e.afterBodyIndex))
    byAfter.set(idx, [...(byAfter.get(idx) || []), e])
  }
  const prose = a.body.map((p, i) => `<p>${esc(p)}</p>${(byAfter.get(i) || []).map((e) => facade({ ...e, type: 'youtube' })).join('')}`).join('')
  const cr = [['Home', '/'], ['Latest', '/reports/'], ['This file', hrefFor(a)]]
  const d = datesFor(a)
  const more = files.filter((f) => f !== a).slice(0, 4)
  const head = headTags({ title: a.title, description: a.dek || a.title, url: urlFor(a), image: articleOg(a.slug), type: 'article', published: d.published, modified: d.modified, section: 'Files', jsonLd: [newsArticleLd(a), crumbLd([['Home', '/'], ['Latest', '/reports/'], [a.title, hrefFor(a)]])] })
  const body = `${crumbs(cr)}<article class="wrap post">${hero(a, punch(a.title, a.ogPunch))}<div class="prose">${prose}</div>${relatedLinks(a)}${sourcesBox(a)}${shareRow(a)}</article>
<section class="sec"><div class="wrap"><div class="shead"><div><h2 class="stitle">More <mark>files</mark></h2></div><a class="more" href="/reports/">Latest →</a></div><div class="cards">${more.map(card).join('')}</div></div></section>
${subband(`file-${a.slug}`.slice(0, 64))}`
  write(`reports/${a.slug}/index.html`, page({ title: `${a.seoTitle || a.title} | The Donald Files`, head, active: 'latest', body }))
}

function latestPage() {
  const cr = [['Home', '/'], ['Latest', '/reports/']]
  const head = headTags({ title: 'Latest Trump files and clips', description: 'Every Donald Trump file and clip from The Donald Files, newest first. Sourced. Snarky. Receipts attached.', url: `${SITE}/reports/`, image: DEFAULT_OG, type: 'website', jsonLd: [crumbLd(cr), { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Latest', url: `${SITE}/reports/`, mainEntity: { '@type': 'ItemList', itemListElement: files.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: urlFor(a) })) } }] })
  const body = `${crumbs(cr)}<section class="hubhead"><div class="wrap"><p class="kick">Latest</p><h1 class="h1">Every <mark>file</mark>, newest first</h1><p class="intro">${esc(FOOT_LINE)}</p></div></section>
<section class="sec tight"><div class="wrap"><div class="shead"><div><h2 class="stitle">Newest <mark>clips</mark></h2></div><a class="more" href="/trump-videos/">All Trump videos →</a></div><div class="cwr">${clips.slice(0, 6).map((a) => tile(a)).join('')}</div></div></section>
<section class="sec"><div class="wrap"><div class="shead"><div><h2 class="stitle">All <mark>files</mark></h2><p class="ssub">${files.length} files</p></div></div><div class="cards">${files.map(card).join('')}</div></div></section>${subband('latest')}`
  write('reports/index.html', page({ title: 'Latest Trump Files and Clips | The Donald Files', head, active: 'latest', body }))
}

function recordPage() {
  const groups = new Map()
  for (const a of posts) {
    const k = fmt(datesFor(a).hasTime ? pub(a) : etNoon(a.date), { month: 'long', day: 'numeric', year: 'numeric' })
    groups.set(k, [...(groups.get(k) || []), a])
  }
  const head = headTags({ title: 'The Record: every Trump file and clip, by date', description: 'The Donald Files record: every published file and clip about Donald Trump, by date, newest first.', url: `${SITE}/the-record`, image: DEFAULT_OG, type: 'website', jsonLd: crumbLd([['Home', '/'], ['The Record', '/the-record']]) })
  const body = `${crumbs([['Home', '/'], ['The Record', '/the-record']])}<section class="hubhead"><div class="wrap"><p class="kick">The Record</p><h1 class="h1">Everything we’ve <mark>filed</mark>, by date</h1></div></section><section class="sec tight"><div class="wrap rec">${[...groups]
    .map(([day, list]) => `<h2>${esc(day)}</h2><ul>${list.map((a) => `<li><span class="rk">${a.kind === 'clip' ? 'Clip' : 'File'}</span><a href="${esc(hrefFor(a))}">${esc(a.title)}</a></li>`).join('')}</ul>`)
    .join('')}</div></section>`
  write('the-record.html', page({ title: 'The Record | The Donald Files', head, active: 'record', body }))
}

function aboutPage() {
  const head = headTags({ title: 'About The Donald Files', description: FOOT_LINE, url: `${SITE}/about`, image: DEFAULT_OG, type: 'website', jsonLd: crumbLd([['Home', '/'], ['About', '/about']]) })
  const body = `${crumbs([['Home', '/'], ['About', '/about']])}<article class="wrap post"><header class="phead"><p class="kick">About</p><h1 class="ph1">The administration, <mark>annotated</mark>.</h1></header><div class="prose"><p>${esc(FOOT_LINE)}</p><h2>Is The Donald Files neutral?</h2><p>${esc(FAQ[2][1])}</p><h2>Where do the videos come from?</h2><p>${esc(FAQ[0][1])}</p><h2>Can I share these clips?</h2><p>${esc(FAQ[3][1])}</p></div></article>${subband('about')}`
  write('about.html', page({ title: 'About | The Donald Files', head, active: '', body }))
}

function subscribePage() {
  const head = headTags({ title: 'Subscribe to The Donald Files', description: 'One short email a day: the clips, the receipts, the jokes. Unsubscribe in one click.', url: `${SITE}/subscribe`, image: DEFAULT_OG, type: 'website', noindex: !SUBSCRIBE_LIVE })
  const body = SUBSCRIBE_LIVE
    ? `${crumbs([['Home', '/'], ['Subscribe', '/subscribe']])}<section class="wrap post subpage"><p class="status" data-status role="status" hidden></p><header class="phead"><p class="kick">Subscribe</p><h1 class="ph1">Get the worst of him, <mark>daily</mark>.</h1><p class="pdek">One short email a day: the clips, the receipts, the jokes. Unsubscribe in one click.</p></header>${subForm('subscribe-page')}<p class="fine">We send one email to confirm your address first. Nothing else arrives until you click it.</p></section>`
    : `<section class="wrap post"><h1 class="ph1">Subscribe</h1><p class="pdek">Not open yet.</p></section>`
  write('subscribe.html', page({ title: 'Subscribe | The Donald Files', head, active: '', body }))
}

function notFound() {
  const body = `<section class="wrap post"><header class="phead"><p class="kick">404</p><h1 class="ph1">This file is <mark>missing</mark>.</h1><p class="pdek">The page you wanted isn’t here. The newest clips are.</p></header></section><section class="sec"><div class="wrap"><div class="cwr">${clips.slice(0, 3).map((a) => tile(a)).join('')}</div></div></section>`
  write('404.html', page({ title: 'Not found | The Donald Files', head: '<meta name="robots" content="noindex">', active: '', body }))
}

// ---------- build ----------
rmSync(dist, { recursive: true, force: true })
cpSync(join(root, 'public'), dist, { recursive: true })
home()
hubPage({})
for (const t of TOPICS) hubPage({ topic: t })
for (const a of clips) clipPage(a)
for (const a of files) articlePage(a)
latestPage()
recordPage()
aboutPage()
subscribePage()
notFound()
// Pages Functions only run for paginated hub URLs (?page=N) and the API; everything else is pure static.
writeFileSync(join(dist, '_routes.json'), JSON.stringify({ version: 1, include: ['/api/*', '/trump-videos', '/trump-videos/', ...TOPICS.flatMap((t) => [`/trump-videos/${t}`, `/trump-videos/${t}/`])], exclude: [] }, null, 2))
console.log(`v5: home, hub + ${TOPICS.length} topic hubs (${TOPICS.join(', ')}), ${clips.length} clip pages, ${files.length} file pages, latest, record, about, subscribe, 404 · CSS ${(CSS.length / 1024).toFixed(1)}KB · per page ${PER_PAGE}`)
