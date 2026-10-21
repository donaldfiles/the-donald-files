// Fill data/related.json (slug → [related slugs]) for live posts that have fewer than MIN related links.
// Scores candidates by shared event (same source video), shared topics, shared title/slug keywords, same day.
// Existing entries are never rewritten (hand edits stick); curated relatedClips/relatedArticle in articles.ts count first.
// usage: node scripts/pick-related.mjs [--dry]
import { readFileSync, writeFileSync } from 'node:fs'
import { extractArticles } from './lib/articles.mjs'
const root = new URL('..', import.meta.url).pathname
const PATH = root + 'data/related.json'
const MIN = 2, WANT = 3
const posts = extractArticles(readFileSync(root + 'src/content/articles.ts', 'utf8')).filter((a) => !a.fixture && !a.unlisted)
const BY = new Map(posts.map((a) => [a.slug, a]))
let map = {}
try { map = JSON.parse(readFileSync(PATH, 'utf8')) } catch {}
const STOP = new Set('trump trumps the a an and or of to in on at for is it its his he him says say said with from by as be this that new one two not no you your we our they them their was were are about after then just when what who how why time week weeks every again more most than into over its truth social file files clip called out own get gets tells told before asks asked man 000 save also back still money'.split(' '))
const words = (a) => new Set(`${a.slug} ${a.title}`.toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w)))
const curated = (a) => [...(a.relatedArticle ? [a.relatedArticle] : []), ...(a.relatedClips || [])].filter((s) => BY.has(s))
function score(a, b) {
  let s = 0; const why = []
  if (a.youtubeId && a.youtubeId === b.youtubeId) { s += 6; why.push('same video') }
  const shared = (a.topics || []).filter((t) => (b.topics || []).includes(t))
  if (shared.length) { s += 2 * shared.length + ((a.topics || [])[0] === (b.topics || [])[0] ? 1 : 0); why.push('topic ' + shared.join('+')) }
  const wa = words(a), kw = [...words(b)].filter((w) => wa.has(w))
  if (kw.length) { s += 2 * kw.length; why.push('keywords ' + kw.join(',')) }
  if (a.date === b.date) { s += 1; why.push('same day') }
  return { s, why }
}
const dry = process.argv.includes('--dry'); let added = 0
for (const a of posts) {
  const have = new Set([...curated(a), ...(map[a.slug] || []).filter((s) => BY.has(s))])
  if (have.size >= WANT) continue
  const picks = posts.filter((b) => b !== a && !have.has(b.slug)).map((b) => ({ b, ...score(a, b) })).filter((x) => x.why.some((w) => w !== 'same day'))
    .sort((x, y) => y.s - x.s || (y.b.date > x.b.date ? 1 : -1)).slice(0, WANT - have.size)
  if (have.size + picks.length < MIN) console.warn(`⚠ ${a.slug}: only ${have.size + picks.length} related candidates`)
  map[a.slug] = [...(map[a.slug] || []), ...picks.map((x) => x.b.slug)]
  added += picks.length
  for (const x of picks) console.log(`${a.slug} → ${x.b.slug}  [${x.s}: ${x.why.join('; ')}]`)
}
if (!dry) { writeFileSync(PATH, JSON.stringify(Object.fromEntries(Object.entries(map).sort()), null, 2) + '\n') }
console.log(`${dry ? '(dry) ' : ''}${added} related link(s) picked`)
