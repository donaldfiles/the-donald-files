// Build gate: fail if any internal desk-note text reaches the built site (pages, feeds, sitemaps, OG/meta, JSON).
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
const ROOT = 'dist'
const TEXT = new Set(['.html', '.xml', '.json', '.txt', '.js', '.webmanifest', ''])
const BAD = [/desk note/i, /reed gate/i, /AUDIO[- ]TIMED/, /NEEDS (?:A |AN )?(?:TRANSCRIPT PANEL|AUDIO) CHECK/i, /\/workspace\/verify\//, /(^|\n)\s*(?:&gt;|>)\s*Desk/i]
const hits = []
const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); const s = statSync(p); if (s.isDirectory()) walk(p); else if (TEXT.has(extname(n))) { const t = readFileSync(p, 'utf8'); for (const re of BAD) { const m = t.match(re); if (m) hits.push(`${p}: ${JSON.stringify(m[0])}`) } } } }
walk(ROOT)
if (hits.length) { console.error(`✖ desk-note check: ${hits.length} hit(s) in built output\n  ` + hits.slice(0, 20).join('\n  ')); process.exit(1) }
console.log('desk-note check: 0 hits in built output')
