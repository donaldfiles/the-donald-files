import pw from 'playwright-core'
const BASE = process.env.BASE || 'https://thedonaldfiles.com'
const OUT = '/workspace/shots-v5/playfix'
const X = '/trump-videos/trump-gas-prices-small-price-to-pay/'
const YT_PAGE = '/trump-videos/trump-dumocrat-new-term-since-may/' // has a YouTube "before" embed
const shots = new Set((process.env.SHOTS || '').split(','))
const res = []
const log = (r) => { res.push(r); console.log(JSON.stringify(r)) }
for (const name of ['chromium', 'webkit', 'firefox']) {
  const b = await pw[name].launch()
  for (const [w, h, tag] of [[1280, 860, 'desktop'], [390, 844, 'mobile']]) {
    for (const blocked of name === 'chromium' ? [false, true] : [true, false]) {
      const ctx = await b.newContext({ viewport: { width: w, height: h }, ...(name !== 'firefox' && tag === 'mobile' ? { isMobile: name === 'chromium', hasTouch: true } : {}) })
      if (blocked) await ctx.route(/platform\.twitter\.com|syndication\.twitter\.com|cdn\.syndication\.twimg\.com/, (r) => r.abort())
      const p = await ctx.newPage()
      const t0 = Date.now()
      await p.goto(BASE + X + '#play', { waitUntil: 'domcontentloaded' })
      let state = 'none', at = 0
      for (let i = 0; i < 60; i++) {
        const s = await p.evaluate(() => { const b = document.querySelector('[data-x]'); return b.classList.contains('ready') ? 'ready' : b.classList.contains('fail') ? 'fail' : 'loading' })
        if (s === 'ready' || (s === 'fail' && blocked)) { state = s; at = Date.now() - t0; break }
        if (s === 'fail' && i > 40) { state = s; at = Date.now() - t0; break }
        await p.waitForTimeout(250)
      }
      await p.waitForTimeout(state === 'ready' ? 1500 : 300)
      const info = await p.evaluate(() => {
        const box = document.querySelector('[data-x]'), pl = document.getElementById('play').getBoundingClientRect()
        const cta = box.querySelector('.xcta'), ph = box.querySelector('.xph')
        const bq = box.querySelector('blockquote.twitter-tweet')
        const ifr = box.querySelector('iframe')
        // any visible "View the post"/bare tweet link text?
        const bareVisible = bq ? getComputedStyle(bq).visibility !== 'hidden' && bq.offsetHeight > 0 : false
        return {
          inView: pl.top < innerHeight && pl.bottom > 0 && pl.top > -10, top: Math.round(pl.top),
          iframeH: ifr ? ifr.offsetHeight : 0,
          ctaVisible: !!cta && getComputedStyle(cta).display !== 'none',
          ctaHref: ph && ph.href, ctaTarget: ph && ph.target, ctaRel: ph && ph.rel,
          placeholderShown: ph && getComputedStyle(ph).display !== 'none',
          bareLinkVisible: bareVisible,
        }
      })
      log({ browser: name, width: w, blocked, state, ms: at, ...info })
      const key = `${name}-${tag}-${blocked ? 'blocked' : 'open'}`
      if (shots.has(key)) await p.screenshot({ path: `${OUT}/${key}.png` })
      await ctx.close()
    }
  }
  // YouTube facade still click-to-load
  const ctx = await b.newContext({ viewport: { width: 1280, height: 860 } })
  const p = await ctx.newPage()
  await p.goto(BASE + YT_PAGE, { waitUntil: 'domcontentloaded' })
  const before = await p.locator('a.facade[data-type="youtube"]').count()
  await p.locator('a.facade[data-type="youtube"]').first().scrollIntoViewIfNeeded()
  await p.locator('a.facade[data-type="youtube"]').first().click()
  await p.waitForTimeout(2500)
  const yt = await p.evaluate(() => { const f = document.querySelector('iframe.yt'); return f ? { src: f.src.slice(0, 60), h: f.offsetHeight } : null })
  log({ browser: name, youtube: { facades: before, iframe: yt } })
  if (shots.has(`${name}-youtube`)) { await p.locator('iframe.yt').scrollIntoViewIfNeeded(); await p.waitForTimeout(1500); await p.screenshot({ path: `${OUT}/${name}-youtube-desktop.png` }) }
  await ctx.close()
  await b.close()
}
