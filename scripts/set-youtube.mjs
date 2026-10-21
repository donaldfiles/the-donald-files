#!/usr/bin/env node
// Make a live clip YouTube-first (data-only edit of src/content/articles.ts).
//   node scripts/set-youtube.mjs <slug> <youtube-url-or-id> [startSeconds] [channel]
//   node scripts/set-youtube.mjs <slug> --remove            (back to the X embed)
// Examples:
//   node scripts/set-youtube.mjs trump-gas-prices-small-price-to-pay https://www.youtube.com/watch?v=abc123DEF45&t=95 "" "The White House"
//   node scripts/set-youtube.mjs trump-watercane-hurricane-helene https://youtu.be/abc123DEF45 312 C-SPAN
// A start in the URL (t=95, t=1m35s, start=95) is used when startSeconds is omitted or "".
// Then: npm run deploy  (the build fetches the YouTube poster into /posters/ and switches the player).
import { readFileSync, writeFileSync } from 'node:fs'

const file = new URL('../src/content/articles.ts', import.meta.url)
const [slug, ref, startArg, channel] = process.argv.slice(2)
if (!slug || !ref) { console.error('Usage: node scripts/set-youtube.mjs <slug> <youtube-url-or-id> [startSeconds] [channel]'); process.exit(2) }

let src = readFileSync(file, 'utf8')
const at = src.indexOf(`    slug: '${slug}',\n`)
if (at < 0) { console.error(`No post with slug '${slug}'.`); process.exit(1) }
const end = src.indexOf('\n  },\n', at)
let block = src.slice(at, end)
if (!/kind: 'clip'/.test(block)) { console.error(`'${slug}' is not a clip.`); process.exit(1) }
block = block.replace(/\n    youtube(Id|Start|Channel): [^\n]*/g, '')

if (ref !== '--remove') {
  const secs = (t) => {
    if (!t) return 0
    if (/^\d+$/.test(t)) return Number(t)
    const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t)
    return m ? (Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0)) : 0
  }
  let id = null, urlStart = 0
  if (/^[\w-]{11}$/.test(ref)) id = ref
  else {
    try {
      const u = new URL(ref)
      id = u.searchParams.get('v') || (/^\/(?:embed|shorts|live|v)\/([\w-]{11})/.exec(u.pathname) || [])[1] || (u.hostname.endsWith('youtu.be') ? u.pathname.slice(1, 12) : null)
      urlStart = secs(u.searchParams.get('t') || u.searchParams.get('start') || '')
    } catch {}
  }
  if (!id || !/^[\w-]{11}$/.test(id)) { console.error(`Can't find a YouTube video ID in '${ref}'.`); process.exit(2) }
  const start = startArg !== undefined && startArg !== '' ? secs(startArg) : urlStart
  const q = (v) => `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, '’')}'`
  const lines = [`    youtubeId: '${id}',`]
  if (start) lines.push(`    youtubeStart: ${start},`)
  if (channel) lines.push(`    youtubeChannel: ${q(channel)},`)
  block = block.replace(/(\n    kind: 'clip',)/, `$1\n${lines.join('\n')}`)
  console.log(`${slug}: YouTube ${id}${start ? ` from ${start}s` : ''}${channel ? ` (${channel})` : ''}`)
} else console.log(`${slug}: YouTube removed, back to the X embed`)

src = src.slice(0, at) + block + src.slice(end)
writeFileSync(file, src)
