#!/usr/bin/env node
/**
 * X posting queue (prep only — no X account / keys exist yet).
 *
 *   node scripts/post-queue.mjs                 # dry run (default): print drafts, write nothing
 *   node scripts/post-queue.mjs --write-drafts  # also write data/x-drafts.json
 *   node scripts/post-queue.mjs --post          # call postToX() for each unposted article
 *                                               #   (stub; no-ops without X_API_* env vars)
 *   node scripts/post-queue.mjs --mark-posted <slug> [--tweet-id <id>]
 *   options: --feed <path|url>  (default dist/feed.json, fallback https://thedonaldfiles.com/feed.json)
 *            --limit <n>        (max articles this run, default 3)
 *
 * Hand-written drafts (data/x-custom-drafts.json, keyed by slug) replace the auto draft for that article;
 * entries may carry quoteTweetId (sent as quote_tweet_id when posting is wired).
 * State lives in data/x-post-state.json: { posted: { [slug]: { at, tweetId } } }.
 * Only --post (after a real success) and --mark-posted modify state.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const STATE = join(root, 'data/x-post-state.json')
const DRAFTS = join(root, 'data/x-drafts.json')
const CUSTOM = join(root, 'data/x-custom-drafts.json')
const LIVE_FEED = 'https://thedonaldfiles.com/feed.json'
const MAX = 280
const URL_LEN = 23 // X wraps every link in t.co → always counts as 23

const args = process.argv.slice(2)
const flag = (n) => args.includes(n)
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d)

function loadState() {
  if (!existsSync(STATE)) return { posted: {} }
  const s = JSON.parse(readFileSync(STATE, 'utf8'))
  s.posted ||= {}
  return s
}
const saveState = (s) => writeFileSync(STATE, JSON.stringify(s, null, 2) + '\n')

async function loadFeed() {
  const src = opt('--feed', existsSync(join(root, 'dist/feed.json')) ? join(root, 'dist/feed.json') : LIVE_FEED)
  if (/^https?:/.test(src)) {
    const r = await fetch(src)
    if (!r.ok) throw new Error(`feed ${src} → HTTP ${r.status}`)
    return { src, feed: await r.json() }
  }
  return { src, feed: JSON.parse(readFileSync(src, 'utf8')) }
}

/** X-weighted length: URLs count 23; most CJK/emoji count 2 (approximation). */
export function xLength(text) {
  let n = 0
  const parts = text.split(/(https?:\/\/\S+)/)
  for (const p of parts) {
    if (/^https?:\/\//.test(p)) { n += URL_LEN; continue }
    for (const ch of p) n += ch.codePointAt(0) > 0x10ff ? 2 : 1
  }
  return n
}

function trimTo(s, budget) {
  if (xLength(s) <= budget) return s
  let out = ''
  for (const w of s.split(' ')) {
    const next = out ? `${out} ${w}` : w
    if (xLength(next + '…') > budget) break
    out = next
  }
  return out.replace(/[\s,;:.–—-]+$/, '') + '…'
}

/** Headline hook + (dek if it fits) + link. Always ≤ 280 X-weighted chars. */
export function draftPost(item) {
  const link = item.url
  const title = item.title.trim()
  const reserve = 2 + URL_LEN // "\n\n" + link
  const hook = trimTo(title, MAX - reserve)
  let text = `${hook}\n\n${link}`
  const dek = (item.summary || '').trim()
  if (dek) {
    const room = MAX - xLength(text) - 2
    if (room >= 60) {
      const d = trimTo(dek, room)
      text = `${hook}\n\n${d}\n\n${link}`
    }
  }
  if (xLength(text) > MAX) throw new Error(`draft too long for ${item.slug}`)
  return text
}

/**
 * STUB — X API v2 POST /2/tweets. Intentionally does not call the network yet.
 * Requires OAuth 1.0a user-context creds in env:
 *   X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
 * Returns { ok:false, skipped:true } when any are missing. When wiring for real,
 * sign the request (e.g. oauth-1.0a) and POST { text } to https://api.x.com/2/tweets,
 * returning { ok:true, id } from response.data.id.
 */
export async function postToX(text, { quoteTweetId } = {}) {
  const need = ['X_API_KEY', 'X_API_SECRET', 'X_ACCESS_TOKEN', 'X_ACCESS_TOKEN_SECRET']
  const missing = need.filter((k) => !process.env[k])
  if (missing.length) return { ok: false, skipped: true, reason: `missing env: ${missing.join(', ')}` }
  // TODO(press): implement signed POST to https://api.x.com/2/tweets once the account + keys exist.
  return { ok: false, skipped: true, reason: 'postToX is a stub — not implemented yet', length: text.length, quoteTweetId }
}

async function main() {
  const state = loadState()

  if (flag('--mark-posted')) {
    const slug = opt('--mark-posted')
    if (!slug) throw new Error('--mark-posted needs a slug')
    state.posted[slug] = { at: new Date().toISOString(), tweetId: opt('--tweet-id', null) }
    saveState(state)
    console.log(`marked ${slug} as posted`)
    return
  }

  const { src, feed } = await loadFeed()
  const items = [...(feed.items || [])].sort((a, b) => (a.date_published < b.date_published ? 1 : a.date_published > b.date_published ? -1 : 0))
  const queue = items.filter((it) => !state.posted[it.slug || it.id])
  const limit = Number(opt('--limit', 3))
  const batch = queue.slice(0, limit)
  const custom = existsSync(CUSTOM) ? JSON.parse(readFileSync(CUSTOM, 'utf8')) : {}
  const drafts = batch.flatMap((it) => {
    const hand = Array.isArray(custom[it.slug]) ? custom[it.slug] : null
    if (!hand) return [{ slug: it.slug, url: it.url, image: it.image, text: draftPost(it) }]
    return hand.map((h, i) => {
      if (xLength(h.text) > MAX) throw new Error(`custom draft ${it.slug}#${i + 1} is ${xLength(h.text)} chars`)
      return { slug: it.slug, url: it.url, image: it.image, text: h.text, quoteTweetId: h.quoteTweetId, n: h.n ?? i + 1, custom: true }
    })
  })

  const mode = flag('--post') ? 'POST' : 'DRY RUN'
  console.log(`[${mode}] feed=${src} · ${items.length} articles · ${queue.length} unposted · showing ${drafts.length}\n`)
  for (const d of drafts) {
    console.log(`— ${d.slug}${d.custom ? ` #${d.n} (Ink)` : ''}${d.quoteTweetId ? ` · quote of ${d.quoteTweetId}` : ''} (${xLength(d.text)}/280)\n${d.text}\n`)
  }
  if (flag('--write-drafts')) {
    writeFileSync(DRAFTS, JSON.stringify({ generatedAt: new Date().toISOString(), drafts }, null, 2) + '\n')
    console.log(`wrote ${DRAFTS}`)
  }
  if (!flag('--post')) return

  for (const d of drafts) {
    const r = await postToX(d.text, { quoteTweetId: d.quoteTweetId })
    if (r.ok) {
      state.posted[d.slug] = { at: new Date().toISOString(), tweetId: r.id }
      saveState(state)
      console.log(`posted ${d.slug} → ${r.id}`)
    } else {
      console.log(`not posted ${d.slug}: ${r.reason}`)
    }
  }
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
