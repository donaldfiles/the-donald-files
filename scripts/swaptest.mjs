// Live check: each YouTube-first clip plays inline from its start. usage: node scripts/swaptest.mjs chromium|webkit [slug]
import pw from 'playwright-core'
const BASE = 'https://thedonaldfiles.com'
const C = [['trump-ilhan-omar-could-go-to-jail',5535],['trump-jimmy-carter-died-a-happy-man',5660],['trump-5000-if-we-lose-you-get-nothing',8978],['trump-protesters-treat-them-very-very-rough',4131],['trump-husted-never-studied-body-of-a-man',747],['trump-cooper-going-to-become-your-senator',1941],['trump-watercane-hurricane-helene',5095],['trump-dumocrat-new-term-since-may',4074],['trump-ukraine-town-that-got-hit-or-whatever',4732],['trump-daily-wire-is-good-sorry',228],['trump-budget-deficit-trade-deficit-confusion',3768],['trump-sick-person-reporter-oval-office',5718],['trump-gas-prices-small-price-to-pay',5680],['trump-christianity-know-more-than-anybody-two-corinthians',1068],['trump-shylock-slur-roger-marshall-kansas',2061],['trump-nobody-appreciates-me-kansas-rally',2443]]
const which = process.argv[2] || 'chromium'
const list = process.argv[3] ? C.filter((c) => c[0] === process.argv[3]) : which === 'webkit' ? [C[1], C[4]] : C
const b = await pw[which].launch()
for (const [slug, start] of list) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 860 } }); const p = await ctx.newPage()
  await p.goto(`${BASE}/trump-videos/${slug}/`, { waitUntil: 'domcontentloaded' })
  const alsox = await p.evaluate(() => document.querySelector('.alsox a')?.href || null)
  await p.locator('#play a.facade').click(); await p.waitForSelector('#play iframe', { timeout: 8000 }); await p.waitForTimeout(7000)
  const src = await p.evaluate(() => document.querySelector('#play iframe').src)
  const yf = p.frames().find((f) => f.url().includes('youtube-nocookie.com/embed'))
  const v = yf ? await yf.evaluate(() => { const v = document.querySelector('video'); return v ? { paused: v.paused, t: Math.round(v.currentTime), muted: v.muted } : null }).catch(() => null) : null
  await p.locator('#play').screenshot({ path: `${process.env.OUT || '/workspace/shots-v5/swap3'}/${which}-${slug}.png` })
  console.log(JSON.stringify({ which, slug, startParam: new URL(src).searchParams.get('start'), want: start, video: v, ok: !!v && !v.paused && v.t >= start && v.t < start + 15, alsox, sameTab: p.url().startsWith(BASE) }))
  await ctx.close()
}
await b.close()
