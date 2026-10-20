/**
 * Share card v1 (Vex) renderer: screenshots scripts/share-card/template.html
 * with query params in headless Chrome → 1200x630 PNG. Spec: scripts/share-card/SHARE-CARD-SPEC.md
 * Fonts (Antonio, IBM Plex Mono/Serif/Sans) come from the box's system fonts.
 */
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright-core'

const BANNED_STAMPS = /^(FACT|REPORTS?|ANALYSIS|SATIRE|OPINION|TIMELINE)$/i
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome'

const escHtml = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function cardParams(a, fileNo) {
  let stamp = (a.ogStamp || 'FILED').toUpperCase()
  if (BANNED_STAMPS.test(stamp)) {
    console.warn(`share-card: stamp "${stamp}" not allowed for ${a.slug} → FILED`)
    stamp = 'FILED'
  }
  const kicker = a.ogKicker ?? (a.slug?.startsWith('truth-social-') ? 'Truth Social watch' : '')
  let hed = escHtml(a.title)
  if (a.ogPunch) {
    const p = escHtml(a.ogPunch)
    if (hed.includes(p)) hed = hed.replace(p, `*${p}*`)
    else console.warn(`share-card: ogPunch "${a.ogPunch}" not in hed for ${a.slug} — no highlight`)
  }
  return {
    kicker: escHtml(kicker),
    file: escHtml(a.ogFile || `FILE // ${String(fileNo).padStart(3, '0')}`),
    stamp: escHtml(stamp),
    hed,
    dek: escHtml(a.dek || ''),
  }
}

export async function openRenderer(root) {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--font-render-hinting=none'] })
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  const tpl = pathToFileURL(join(root, 'scripts/share-card/template.html')).href

  async function load(params) {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString()
    await page.goto(`${tpl}?${q}`, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    return page.evaluate(() => {
      const r = (id) => document.getElementById(id)?.getBoundingClientRect()
      const hed = document.getElementById('h')
      const dek = document.getElementById('d')
      const top = document.querySelector('.top').getBoundingClientRect()
      const foot = document.querySelector('.foot').getBoundingClientRect()
      const h = r('h'), s = r('s'), d = r('d')
      const issues = []
      if (hed.scrollWidth > hed.clientWidth + 1) issues.push('hed wider than box')
      if (h.top < top.bottom + 12) issues.push('hed collides with kicker row')
      if (s && h.top < s.bottom && h.right > s.left) issues.push('hed under stamp')
      const last = d || h
      if (last.bottom > foot.top - 8) issues.push('text into footer')
      const dekLines = dek ? Math.round(dek.getBoundingClientRect().height / parseFloat(getComputedStyle(dek).lineHeight)) : 0
      const fontsOk = getComputedStyle(hed).fontFamily.includes('Antonio')
      return { issues, dekLines, fontsOk }
    })
  }

  /** Render; dek is dropped unless it fits on one line (spec). Throws on layout overflow. */
  async function render(params) {
    let m = await load(params)
    let usedDek = !!params.dek
    if (params.dek && (m.dekLines > 1 || m.issues.length)) {
      m = await load({ ...params, dek: '' })
      usedDek = false
    }
    if (m.issues.length) throw new Error(`layout: ${m.issues.join(', ')}`)
    return { png: await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } }), usedDek }
  }

  return { render, close: () => browser.close() }
}
