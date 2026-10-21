// Caption sampler: plays <id> from <start> via the live site player and logs on-screen captions + video time. usage: node scripts/capsub.mjs <id> <start> [secs] [shot.png]
import pw from 'playwright-core'
const [id, start, secs = '22', shot] = process.argv.slice(2)
const b = await pw.chromium.launch()
const p = await (await b.newContext({ viewport: { width: 1280, height: 860 } })).newPage()
await p.goto('https://thedonaldfiles.com/trump-videos/trump-shylock-slur-roger-marshall-kansas/', { waitUntil: 'domcontentloaded' })
await p.evaluate(({ id, start }) => { const a = document.querySelector('#play a.facade'); a.dataset.id = id; a.dataset.start = start }, { id, start })
await p.locator('#play a.facade').click()
await p.waitForSelector('#play iframe')
await p.evaluate(() => { const f = document.querySelector('#play iframe'); f.src = f.src + '&cc_load_policy=1&cc_lang_pref=en&hl=en' })
await p.waitForTimeout(2500)
{ const yf = p.frames().find((f) => f.url().includes('/embed/' + id)); const info = await yf.evaluate(() => { const btn = document.querySelector('.ytp-subtitles-button'); const r = { btn: !!btn, pressed: btn && btn.getAttribute('aria-pressed'), title: btn && (btn.getAttribute('data-title-no-tooltip') || btn.title) }; if (btn && btn.getAttribute('aria-pressed') !== 'true') btn.click(); return r }); console.log('cc button', JSON.stringify(info)) }
await p.waitForTimeout(1000)
let last = ''
for (let i = 0; i < +secs * 2; i++) {
  const yf = p.frames().find((f) => f.url().includes('/embed/' + id))
  const r = yf ? await yf.evaluate(() => { const v = document.querySelector('video'); const c = [...document.querySelectorAll('.ytp-caption-segment')].map((s) => s.textContent).join(' '); return { t: v ? v.currentTime : -1, ad: !!document.querySelector('.ad-showing'), c } }).catch(() => null) : null
  if (!r) console.log('no frame', p.frames().map((f) => f.url().slice(0, 70)).join(' | '))
  if (r && i % 3 === 0) { console.log(`${r.t.toFixed(1)}${r.ad ? ' [ad]' : ''}: ${r.c}`); last = r.c }
  if (shot && r && r.t >= +start + 4 && !p._shot) { await p.locator('#play').screenshot({ path: shot }); p._shot = 1 }
  await p.waitForTimeout(500)
}
await b.close()
