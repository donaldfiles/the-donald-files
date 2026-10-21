// usage: node .frames.mjs <id> <outprefix> t1 t2 ...  — seeks the embed and screenshots each frame (paused)
import pw from 'playwright-core'
const [id, pre, ...ts] = process.argv.slice(2)
const b = await pw.chromium.launch()
const p = await (await b.newContext({ viewport: { width: 1280, height: 860 } })).newPage()
await p.goto('https://thedonaldfiles.com/trump-videos/trump-shylock-slur-roger-marshall-kansas/', { waitUntil: 'domcontentloaded' })
await p.evaluate(({ id, start }) => { const a = document.querySelector('#play a.facade'); a.dataset.id = id; a.dataset.start = start }, { id, start: ts[0] })
await p.locator('#play a.facade').click()
await p.waitForSelector('#play iframe'); await p.waitForTimeout(5000)
const yf = () => p.frames().find((f) => f.url().includes('/embed/' + id))
for (const t of ts) {
  await yf().evaluate((t) => { const v = document.querySelector('video'); v.currentTime = +t; v.pause() }, t)
  await p.waitForTimeout(1800)
  const ct = await yf().evaluate(() => document.querySelector('video').currentTime)
  await p.locator('#play iframe').screenshot({ path: `${pre}-${t}.png` })
  console.log(t, ct.toFixed(2))
}
await b.close()
