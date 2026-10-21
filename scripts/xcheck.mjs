import pw from 'playwright-core'
const OUT = '/workspace/shots-v5/newclips-1021'
for (const name of ['chromium', 'webkit']) {
  const b = await pw[name].launch()
  for (const slug of process.argv.slice(2)) {
    const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage()
    await p.goto(`https://thedonaldfiles.com/trump-videos/${slug}/`, { waitUntil: 'domcontentloaded' })
    await p.waitForTimeout(6500)
    const r = await p.evaluate(() => { const box = document.querySelector('#play [data-x]'); const f = box && box.querySelector('iframe'); return { hasX: !!box, ready: box?.classList.contains('ready'), fail: box?.classList.contains('fail'), iframeH: f ? f.offsetHeight : 0, fallback: box?.querySelector('.xfb, a[href*="x.com"]')?.textContent?.trim().slice(0, 30), bareBlockquote: !!document.querySelector('#play blockquote.twitter-tweet:not([data-rendered])') && !box?.classList.contains('ready') && !box?.classList.contains('fail') } })
    await p.locator('#play').screenshot({ path: `${OUT}/${name}-${slug}.png` })
    console.log(JSON.stringify({ name, slug, ...r }))
  }
  await b.close()
}
