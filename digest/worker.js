// The Donald Files daily digest (Cloudflare Worker, cron).
// 07:00 New York: read feed.json, take the top 3–5 posts from the last 24h (clips first), send one email per
// confirmed subscriber via Resend batch (chunks of 100, idempotency keys), log every send in Supabase.
// No posts in 24h → no send. Database access: public key + shared digest secret checked in SECURITY DEFINER RPCs.
const TZ = 'America/New_York'
const MAX_ITEMS = 5
const CHUNK = 100
const enc = new TextEncoder()
const C = { paper: '#FAF7F2', card: '#FFFFFF', line: '#E7E1D6', text: '#16213A', muted: '#5A6378', blue: '#2450FF', hl: '#FFE14D', soft: '#EAF0FF' }

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')

export function nyParts(d = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' }).formatToParts(d).map((x) => [x.type, x.value]))
  return { date: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) }
}
const longDate = (d) => new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'long', month: 'long', day: 'numeric' }).format(d)

async function unsubUrl(env, id) {
  const key = await crypto.subtle.importKey('raw', enc.encode(env.UNSUB_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = b64url(await crypto.subtle.sign('HMAC', key, enc.encode(`unsub:${id}`)))
  return `${env.SITE}/api/unsubscribe?id=${encodeURIComponent(id)}&sig=${sig}`
}

async function rpc(env, fn, args) {
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_secret: env.DIGEST_SECRET, ...args }),
  })
  if (!r.ok) throw new Error(`rpc ${fn} → ${r.status}`)
  return r.json()
}

function oneLine(s, max = 160) {
  s = String(s || '').replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  const first = (s.match(/^.+?[.!?](?:[”’"'])?(?=\s|$)/) || [s])[0]
  if (first.length <= max) return first
  return s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'
}

export async function pickItems(env, now = new Date(), hours = 24) {
  const r = await fetch(`${env.SITE}/feed.json`, { cf: { cacheTtl: 0 }, headers: { 'Cache-Control': 'no-cache' } })
  if (!r.ok) throw new Error(`feed.json → ${r.status}`)
  const feed = await r.json()
  const since = now.getTime() - hours * 3600e3
  const fresh = feed.items
    .filter((i) => Date.parse(i.date_published) > since && Date.parse(i.date_published) <= now.getTime())
    .map((i) => ({ ...i, clip: /\/trump-videos\//.test(i.url) }))
  fresh.sort((a, b) => (a.clip !== b.clip ? (a.clip ? -1 : 1) : Date.parse(b.date_published) - Date.parse(a.date_published)))
  return fresh.slice(0, MAX_ITEMS).map((i) => ({ title: i.title, line: oneLine(i.summary || i.content_text), url: i.url, image: i.image, clip: i.clip }))
}

const subjectFor = (items) => {
  const s = items[0].title
  return items.length > 1 ? `${s} (+${items.length - 1} more)` : s
}
const utm = (u) => `${u}${u.includes('?') ? '&' : '?'}utm_source=digest&utm_medium=email`

export function renderEmail({ items, intro, unsubscribe, date, site }) {
  const pre = esc(oneLine(intro || items.map((i) => i.title).join(' · '), 140))
  const rows = items.map((it, k) => `
<tr><td style="padding:${k ? '20px' : '4px'} 0 0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.card};border:1px solid ${C.line};border-radius:16px;border-collapse:separate">
<tr><td style="padding:12px 12px 0"><a href="${esc(utm(it.url))}" target="_blank"><img src="${esc(it.image)}" width="512" alt="${esc(it.title)}" style="display:block;width:100%;max-width:512px;height:auto;border:0;border-radius:10px"></a></td></tr>
<tr><td style="padding:14px 18px 0;font:700 12px/1.2 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${C.blue}">${it.clip ? '▶ Clip' : 'File'}</td></tr>
<tr><td style="padding:6px 18px 0;font:800 21px/1.25 Arial,Helvetica,sans-serif;color:${C.text}"><a href="${esc(utm(it.url))}" target="_blank" style="color:${C.text};text-decoration:none">${esc(it.title)}</a></td></tr>
<tr><td style="padding:8px 18px 0;font:16px/1.5 Georgia,'Times New Roman',serif;color:${C.muted}">${esc(it.line)}</td></tr>
<tr><td style="padding:14px 18px 18px"><a href="${esc(utm(it.url))}" target="_blank" style="display:inline-block;background:${C.blue};color:#FFFFFF;font:700 14px/1 Arial,Helvetica,sans-serif;text-decoration:none;padding:11px 18px;border-radius:999px">${it.clip ? 'Watch it' : 'Read it'} →</a></td></tr>
</table></td></tr>`).join('')
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light"><title>The Donald Files</title></head>
<body style="margin:0;padding:0;background:${C.paper}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${pre}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px">
<tr><td style="padding:0 4px 4px;font:800 24px/1 Arial,Helvetica,sans-serif;color:${C.text};letter-spacing:-.02em">The <span style="background:${C.hl};padding:0 5px;border-radius:5px">Donald</span> Files</td></tr>
<tr><td style="padding:8px 4px 14px;font:700 12px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${C.muted}">The daily digest · ${esc(date)}</td></tr>
${intro ? `<tr><td style="padding:0 0 14px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${C.soft};border-left:4px solid ${C.blue};border-radius:10px;padding:14px 16px;font:17px/1.45 Georgia,'Times New Roman',serif;color:${C.text}">${esc(intro)}</td></tr></table></td></tr>` : ''}
${rows}
<tr><td style="padding:26px 4px 0;font:13px/1.6 Arial,Helvetica,sans-serif;color:${C.muted}">You’re getting this because you confirmed a subscription at <a href="${esc(site)}/" style="color:${C.blue}">thedonaldfiles.com</a>. Sourced. Snarky. Receipts attached.<br>
<a href="${esc(unsubscribe)}" style="color:${C.muted};text-decoration:underline">Unsubscribe in one click</a></td></tr>
</table></td></tr></table></body></html>`
  const text = `THE DONALD FILES · The daily digest · ${date}\n\n${intro ? `${intro}\n\n` : ''}${items.map((it) => `${it.clip ? '[CLIP] ' : ''}${it.title}\n${it.line}\n${utm(it.url)}\n`).join('\n')}\n—\nYou’re getting this because you confirmed a subscription at thedonaldfiles.com.\nUnsubscribe in one click: ${unsubscribe}\n`
  return { html, text }
}

async function sendBatch(env, payload, idemKey) {
  const r = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': idemKey },
    body: JSON.stringify(payload),
  })
  const body = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(`resend batch → ${r.status} ${body?.message || body?.name || ''}`.trim())
  return body.data || []
}

export async function runDigest(env, { test = false, now = new Date(), force = false, hours = 24 } = {}) {
  const { date, hour } = nyParts(now)
  if (!force && hour !== 7) return { skipped: `not 7am in New York (hour ${hour})`, date }
  const items = await pickItems(env, now, hours)
  if (!items.length) return { skipped: 'nothing published in the last 24 hours', date }
  const prep = await rpc(env, 'df_digest_prepare', { p_date: date, p_test: test })
  const recips = prep.recipients || []
  if (!recips.length) return { skipped: 'no recipients left for today', date, items: items.length }
  const subject = subjectFor(items)
  const dateLabel = longDate(now)
  let sent = 0, failed = 0
  for (let i = 0; i < recips.length; i += CHUNK) {
    const chunk = recips.slice(i, i + CHUNK)
    const payload = []
    for (const s of chunk) {
      const unsubscribe = await unsubUrl(env, s.id)
      const { html, text } = renderEmail({ items, intro: prep.intro, unsubscribe, date: dateLabel, site: env.SITE })
      payload.push({
        from: env.MAIL_FROM, to: [s.email], subject, html, text,
        ...(env.REPLY_TO ? { reply_to: env.REPLY_TO } : {}),
        headers: { 'List-Unsubscribe': `<${unsubscribe}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
        tags: [{ name: 'type', value: test ? 'digest_test' : 'digest' }],
      })
    }
    // Same date + same recipients → same key, so a retry inside Resend's 24h window never double-sends.
    const idem = `df-digest/${date}/${test ? 'test' : 'live'}/${hex(await crypto.subtle.digest('SHA-256', enc.encode(chunk.map((s) => s.id).join(',')))).slice(0, 32)}`
    let rows
    try {
      const data = await sendBatch(env, payload, idem)
      rows = chunk.map((s, k) => ({ subscriber_id: s.id, status: data[k]?.id ? 'sent' : 'failed', resend_id: data[k]?.id || null, error: data[k]?.id ? null : 'no id returned' }))
    } catch (e) {
      rows = chunk.map((s) => ({ subscriber_id: s.id, status: 'failed', resend_id: null, error: e.message }))
    }
    sent += rows.filter((r) => r.status === 'sent').length
    failed += rows.filter((r) => r.status === 'failed').length
    await rpc(env, 'df_digest_log', { p_date: date, p_rows: rows, p_test: test, p_items: items.length })
  }
  return { date, items: items.length, sent, failed, test }
}

async function authed(request, env) {
  const got = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')
  if (!env.DIGEST_SECRET || got.length !== env.DIGEST_SECRET.length) return false
  let d = 0
  for (let i = 0; i < got.length; i++) d |= got.charCodeAt(i) ^ env.DIGEST_SECRET.charCodeAt(i)
  return d === 0
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runDigest(env, { now: new Date(event.scheduledTime) }).then((r) => console.log('digest', JSON.stringify(r)), (e) => console.error('digest failed', e.message)))
  },
  async fetch(request, env) {
    const u = new URL(request.url)
    if (!(await authed(request, env))) return new Response('Not found', { status: 404 })
    const hours = Math.min(72, Math.max(1, Number(u.searchParams.get('hours')) || 24))
    // GET /preview → the HTML a subscriber would get (dummy unsubscribe link). Sends nothing.
    if (u.pathname === '/preview') {
      const items = await pickItems(env, new Date(), hours)
      if (!items.length) return new Response('nothing published in the last 24 hours', { status: 204 })
      const { intro } = await rpc(env, 'df_digest_prepare', { p_date: nyParts().date, p_test: true })
      const { html, text } = renderEmail({ items, intro, unsubscribe: `${env.SITE}/api/unsubscribe?id=preview`, date: longDate(new Date()), site: env.SITE })
      return new Response(u.searchParams.has('text') ? text : html, { headers: { 'Content-Type': `text/${u.searchParams.has('text') ? 'plain' : 'html'}; charset=utf-8`, 'Cache-Control': 'no-store' } })
    }
    // POST /run-test → sends now, ONLY to test rows (source = 'test'); real subscribers are excluded in SQL.
    if (u.pathname === '/run-test' && request.method === 'POST') {
      return Response.json(await runDigest(env, { test: true, force: true, hours }))
    }
    if (u.pathname === '/stats') return Response.json(await rpc(env, 'df_digest_stats', {}))
    return new Response('Not found', { status: 404 })
  },
}
