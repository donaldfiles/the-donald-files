// Post-deploy: submit new/changed URLs to IndexNow (Bing, Yandex, Seznam, Naver… share submissions).
// Usage: node scripts/indexnow.mjs          → only URLs whose built HTML changed since the last run
//        node scripts/indexnow.mjs --all    → every URL in dist/sitemap.xml
//        add --dry to print without sending
// Key file: public/<key>.txt (served at the site root). State: data/indexnow-state.json.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const dist = join(root, 'dist')
const HOST = 'thedonaldfiles.com'
const SITE = `https://${HOST}`
const keyFile = readdirSync(join(root, 'public')).find((f) => /^[0-9a-f]{32}\.txt$/.test(f))
if (!keyFile) throw new Error('No IndexNow key file in public/')
const key = keyFile.slice(0, -4)
const all = process.argv.includes('--all')
const dry = process.argv.includes('--dry')
const statePath = join(root, 'data', 'indexnow-state.json')
const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : { hashes: {} }

const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.startsWith(SITE))

function fileFor(u) {
  let p = u.slice(SITE.length).replace(/\?.*$/, '')
  if (p.endsWith('/')) p += 'index.html'
  const cands = [join(dist, p), join(dist, `${p}.html`), join(dist, p, 'index.html'), join(dist, 'index.html')]
  return cands.find((c) => existsSync(c) && !c.endsWith('/'))
}
const hashes = {}
for (const u of urls) {
  const f = fileFor(u)
  // Strip the hashed asset names so a rebuild alone doesn't count as a change.
  const html = f ? readFileSync(f, 'utf8').replace(/\/assets\/[^"']+/g, '') : u
  hashes[u] = createHash('sha256').update(html).digest('hex').slice(0, 16)
}
const todo = all ? urls : urls.filter((u) => state.hashes[u] !== hashes[u])
console.log(`IndexNow: ${todo.length}/${urls.length} URL(s) to submit${dry ? ' (dry run)' : ''}`)
if (!todo.length) process.exit(0)
if (dry) {
  todo.forEach((u) => console.log('  ' + u))
  process.exit(0)
}
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `${SITE}/${keyFile}`, urlList: todo }),
})
console.log(`IndexNow → HTTP ${res.status} ${res.statusText}`)
if (res.status === 200 || res.status === 202) {
  for (const u of todo) state.hashes[u] = hashes[u]
  state.lastSubmit = new Date().toISOString()
  writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n')
} else {
  console.log(await res.text())
  process.exit(1)
}
