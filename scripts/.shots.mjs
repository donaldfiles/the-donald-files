import { chromium } from 'playwright-core'
const BASE = process.env.BASE || 'http://localhost:8788'
const OUT = process.env.OUT || '/workspace/shots-v5'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const pages = [['/', 'home'], ['/trump-videos/', 'hub'], ['/reports/camp-lejeune-no-win-no-money/', 'article'], ['/trump-videos/trump-christianity-know-more-than-anybody-two-corinthians/', 'clip']]
for (const [vw, vh, tag, dpr] of [[1440, 900, 'desktop', 1], [390, 844, 'mobile', 2]]) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: dpr })
  const p = await ctx.newPage()
  for (const [u, n] of pages) {
    await p.goto(BASE + u, { waitUntil: 'networkidle' })
    await p.evaluate(() => document.fonts.ready)
    const ov = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)
    if (ov) console.log('HORIZONTAL OVERFLOW', tag, n)
    await p.screenshot({ path: `${OUT}/${n}-${tag}.png`, fullPage: true })
  }
  await ctx.close()
}
await b.close()
