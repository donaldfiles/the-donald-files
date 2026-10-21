import { chromium } from 'playwright-core'
const BASE = process.env.BASE || 'http://localhost:8788'
const OUT = process.env.OUT || '/workspace/shots-v5/qa'
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' })
const pages = (process.env.PAGES || '/:home,/trump-videos/:hub').split(',').map((x) => x.split(':'))
for (const [vw, vh, tag, dpr] of [[1440, 900, 'desktop', 1], [390, 844, 'mobile', 2]]) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: dpr })
  const p = await ctx.newPage()
  for (const [u, n] of pages) {
    await p.goto(BASE + u, { waitUntil: 'networkidle' })
    await p.evaluate(async () => { await document.fonts.ready; for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 100)) } scrollTo(0, 0) })
    await p.waitForTimeout(800)
    if (await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) console.log('OVERFLOW', tag, n)
    await p.screenshot({ path: `${OUT}/${n}-${tag}.png`, fullPage: true })
  }
  await ctx.close()
}
await b.close()
