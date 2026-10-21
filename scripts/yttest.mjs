// YouTube-first player test: clip page one-click inline play + tile inline play (one at a time).
import pw from 'playwright-core'
const BASE = process.env.BASE || 'http://localhost:8799'
const CLIP = process.env.CLIP || '/trump-videos/trump-mexico-paid-for-wall-tariffs/'
const OUT = '/workspace/shots-v5/ytfirst'
const shots = new Set((process.env.SHOTS || '').split(','))
const iframeState = (p, sel) => p.evaluate((sel) => [...document.querySelectorAll(sel)].map((f) => ({ src: f.src, h: f.offsetHeight, w: f.offsetWidth })), sel)
for (const name of ['chromium', 'webkit', 'firefox']) {
  const b = await pw[name].launch()
  for (const [w, h, tag] of [[1280, 860, 'desktop'], [390, 844, 'mobile']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, ...(name === 'chromium' && tag === 'mobile' ? { isMobile: true, hasTouch: true } : {}) })
    const p = await ctx.newPage()
    // 1) clip page: one click → inline iframe with autoplay/start/rel/playsinline
    await p.goto(BASE + CLIP, { waitUntil: 'domcontentloaded' })
    const pre = await p.evaluate(() => ({ facade: !!document.querySelector('#play a.facade[data-type=youtube]'), xEmbed: !!document.querySelector('#play [data-x]'), alsox: document.querySelector('.alsox')?.textContent || null, twjs: !!document.getElementById('twjs') }))
    if (shots.has(`${name}-${tag}-clip`)) await p.locator('#play').screenshot({ path: `${OUT}/${name}-${tag}-clip-poster.png` })
    await p.locator('#play a.facade').click()
    await p.waitForSelector('#play iframe', { timeout: 8000 })
    await p.waitForTimeout(5000)
    const fr = (await iframeState(p, '#play iframe'))[0]
    const params = new URL(fr.src).searchParams
    // inside the YouTube frame: did the player load (title or video element present)?
    const yf = p.frames().find((f) => f.url().includes('youtube-nocookie.com/embed'))
    let ytLoaded = false
    if (yf) { try { await yf.waitForSelector('video, .ytp-title, .ytmCuedOverlayHost, #player', { timeout: 8000 }); ytLoaded = true } catch {} }
    const playing = yf ? await yf.evaluate(() => { const v = document.querySelector('video'); return v ? { paused: v.paused, t: Math.round(v.currentTime * 10) / 10, muted: v.muted } : null }).catch(() => null) : null
    console.log(JSON.stringify({ browser: name, tag, page: 'clip', ...pre, sameTab: p.url().startsWith(BASE), iframe: { host: new URL(fr.src).host, autoplay: params.get('autoplay'), start: params.get('start'), rel: params.get('rel'), playsinline: params.get('playsinline'), w: fr.w, h: fr.h }, ytLoaded, video: playing }))
    if (shots.has(`${name}-${tag}-clip`)) await p.locator('#play').screenshot({ path: `${OUT}/${name}-${tag}-clip-playing.png` })
    // 2) home: tile plays inline; second tile stops the first
    await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' })
    const facades = p.locator('.ytile a.facade')
    const n = await facades.count()
    await facades.nth(0).scrollIntoViewIfNeeded(); await facades.nth(0).click()
    await p.waitForTimeout(1200)
    const one = (await iframeState(p, '.ytile iframe')).length
    if (n > 1) { await p.locator('.ytile a.facade').first().scrollIntoViewIfNeeded(); await p.locator('.ytile a.facade').first().click(); await p.waitForTimeout(1200) }
    const after = await iframeState(p, '.ytile iframe')
    const hedLink = await p.evaluate(() => document.querySelector('.ytile .tbody, .ytile .fbody')?.getAttribute('href'))
    console.log(JSON.stringify({ browser: name, tag, page: 'home', ytTiles: n, afterFirstClick: one, afterSecondClick: after.length, stillOnHome: new URL(p.url()).pathname === '/', hedLink, nonYtTileHref: await p.evaluate(() => document.querySelector('a.tile[href*="#play"]')?.getAttribute('href')) }))
    if (shots.has(`${name}-${tag}-home`)) { const f = p.locator('.ytile iframe').first(); await f.scrollIntoViewIfNeeded(); await p.waitForTimeout(2000); await p.screenshot({ path: `${OUT}/${name}-${tag}-home-tile-playing.png` }) }
    await ctx.close()
  }
  await b.close()
}
