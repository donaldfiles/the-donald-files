// Clip posters + durations, cached in the repo (public/posters/*.webp + data/clip-media.json).
// X: public syndication endpoint (the same one the official embed uses; no keys). YouTube: i.ytimg.com hqdefault.
// Runs at build; only fetches clips not yet cached (pass --refresh to refetch all). Never fails the build.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { extractArticles } from './lib/articles.mjs'

const root = new URL('..', import.meta.url).pathname
const out = join(root, 'public', 'posters')
const metaPath = join(root, 'data', 'clip-media.json')
mkdirSync(out, { recursive: true })
const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, 'utf8')) : {}
const refresh = process.argv.includes('--refresh')
const clips = extractArticles(readFileSync(join(root, 'src/content/articles.ts'), 'utf8')).filter((a) => a.kind === 'clip')
const ytId = (e) => e.id || /(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/.exec(e.url || '')?.[1]

async function xMedia(id) {
  const token = ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, '')
  const r = await fetch(`https://cdn.syndication.twimg.com/tweet-result?id=${id}&lang=en&token=${token}`)
  if (!r.ok) throw new Error(`syndication ${r.status}`)
  const j = await r.json()
  const v = (j.mediaDetails || []).find((m) => m.type === 'video' || m.type === 'animated_gif') || (j.mediaDetails || [])[0]
  return { img: j.video?.poster || v?.media_url_https, durationMs: v?.video_info?.duration_millis }
}
async function save(url, file) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`image ${r.status}`)
  const tmp = `${file}.src`
  writeFileSync(tmp, Buffer.from(await r.arrayBuffer()))
  // 16:9 center crop, 640x360 WebP (python Pillow is on the box).
  execFileSync('python3', ['-c', `
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB'); w,h=im.size; t=w*9/16
if h>t: y=(h-t)/2; im=im.crop((0,int(y),w,int(y+t)))
else:
  t2=h*16/9; x=(w-t2)/2; im=im.crop((int(x),0,int(x+t2),h))
im.resize((640,360),Image.LANCZOS).save(sys.argv[2],'WEBP',quality=78,method=6)
`, tmp, file])
  execFileSync('rm', ['-f', tmp])
}

let got = 0
for (const a of clips) {
  for (const [key, e] of [[a.slug, a.embed], [`${a.slug}--before`, a.beforeEmbed]]) {
    if (!e || (e.type !== 'x' && e.type !== 'youtube')) continue
    const file = join(out, `${key}.webp`)
    const want = e.type === 'youtube' ? `youtube:${ytId(e)}` : `x:${e.id}`
    const have = meta[key]?.source === 'youtube' && e.type === 'youtube' ? want : meta[key]?.source === 'x' && e.type === 'x' ? want : meta[key]?.source
    if (!refresh && have === want && existsSync(file)) continue
    try {
      let img, durationMs
      if (e.type === 'x') ({ img, durationMs } = await xMedia(e.id))
      else {
        // Highest-res still YouTube serves for the video (maxres isn't generated for every upload).
        img = `https://i.ytimg.com/vi/${ytId(e)}/hqdefault.jpg`
        const mx = `https://i.ytimg.com/vi/${ytId(e)}/maxresdefault.jpg`
        if ((await fetch(mx, { method: 'HEAD' })).ok) img = mx
      }
      if (!img) throw new Error('no preview image')
      await save(img, file)
      meta[key] = { poster: `/posters/${key}.webp`, ...(durationMs ? { durationSeconds: Math.round(durationMs / 1000) } : {}), source: want, fetched: new Date().toISOString() }
      got++
    } catch (err) {
      console.warn(`posters: ${key}: ${err.message} (falls back to the blue kicker tile)`)
    }
  }
}
writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n')
console.log(`posters: ${got} fetched, ${Object.keys(meta).length} cached`)
