// Tracks published/modified times per post. Writes src/content/content-dates.json (committed),
// read by the SPA, the static pages (visible "Published"/"Updated") and JSON-LD dateModified.
// A post's modified time moves only when its title (ignoring capitalisation), dek, body, sources or embeds change.
// --rehash: store current hashes without touching modified times (after a hash-formula change).
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { extractArticles } from './lib/articles.mjs'

const root = new URL('..', import.meta.url).pathname
const out = `${root}src/content/content-dates.json`
const articles = extractArticles(readFileSync(`${root}src/content/articles.ts`, 'utf8'))
const state = existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : {}
const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z')

export const contentHash = (a) =>
  createHash('sha256')
    .update(JSON.stringify([String(a.title).toLowerCase(), a.dek, a.body, a.sources, a.embed || null, a.beforeEmbed || null]))
    .digest('hex')
    .slice(0, 16)

let changed = 0
for (const a of articles) {
  const h = contentHash(a)
  const published = a.publishedAt ? new Date(a.publishedAt).toISOString().replace(/\.\d+Z$/, 'Z') : null
  const prev = state[a.slug]
  if (!prev) {
    state[a.slug] = { hash: h, published, modified: published }
    changed++
  } else if (process.argv.includes('--rehash')) {
    prev.hash = h
  } else if (prev.hash !== h) {
    state[a.slug] = { ...prev, hash: h, modified: now }
    changed++
  }
}
for (const k of Object.keys(state)) if (!articles.some((a) => a.slug === k)) delete state[k]
writeFileSync(out, JSON.stringify(state, null, 2) + '\n')
console.log(`content-dates: ${articles.length} posts, ${changed} new/changed`)
