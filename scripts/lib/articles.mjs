/** Shared parser for src/content/articles.ts (regex-based, no TS compile). */
export function parseStringExpr(expr) {
  // Preserve literal "+" inside quotes; only join string-concatenation +.
  const parts = []
  let cur = ''
  let i = 0
  while (i < expr.length) {
    const c = expr[i]
    if (c === "'") {
      cur += c
      i++
      while (i < expr.length) {
        if (expr[i] === '\\' && i + 1 < expr.length) {
          cur += expr[i] + expr[i + 1]
          i += 2
          continue
        }
        const ch = expr[i]
        cur += ch
        i++
        if (ch === "'") break
      }
      continue
    }
    if (c === '+') {
      parts.push(cur.trim().replace(/^'|'$/g, '').replace(/\\'/g, "'"))
      cur = ''
      i++
      while (i < expr.length && /\s/.test(expr[i])) i++
      continue
    }
    cur += c
    i++
  }
  if (cur.trim()) {
    parts.push(cur.trim().replace(/^'|'$/g, '').replace(/\\'/g, "'"))
  }
  return parts.join('')
}

function parseEmbed(block, key) {
  const m = new RegExp(`\\n    ${key}: \\{([\\s\\S]*?)\\n    \\},`).exec(block)
  if (!m) return undefined
  const out = {}
  const re = /\n      (\w+): '((?:\\'|[^'])*)',/g
  let f
  while ((f = re.exec(m[1]))) out[f[1]] = f[2].replace(/\\'/g, "'")
  return out
}

function strList(block, key) {
  const m = new RegExp(`\\n    ${key}: \\[([^\\]]*)\\]`).exec(block)
  if (!m) return []
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1])
}

export const hrefFor = (a) => (a.kind === 'clip' ? `/trump-videos/${a.slug}/` : `/reports/${a.slug}/`)

export function extractArticles(text) {
  const articles = []
  const blockRe =
    /\{\s*slug:\s*'([^']+)'[\s\S]*?published:\s*(true|false)[\s\S]*?\n\s*\}/g
  let m
  while ((m = blockRe.exec(text))) {
    const block = m[0]
    const slug = m[1]
    if (m[2] !== 'true') continue

    const titleMatch = block.match(
      /title:\s*((?:'(?:\\'|[^'])*'\s*\+\s*)*'(?:\\'|[^'])*')/,
    )
    const titleStr = titleMatch ? parseStringExpr(titleMatch[1]) : slug
    const dek = /dek:\s*'((?:\\'|[^'])*)'/.exec(block)
    const date = /date:\s*'([^']+)'/.exec(block)
    const category = /category:\s*'([^']+)'/.exec(block)
    const bodyBlock = /body:\s*\[([\s\S]*?)\]\s*,\s*sources:/.exec(block)
    const bodies = []
    if (bodyBlock) {
      const pr = /'((?:\\'|[^'])*)'/g
      let pm
      while ((pm = pr.exec(bodyBlock[1]))) {
        bodies.push(pm[1].replace(/\\'/g, "'"))
      }
    }
    const sourcesBlock = /sources:\s*\[([\s\S]*?)\]\s*,\s*(?:embeds|published|relatedClips|relatedArticle|fixture|proseArticle):/.exec(block)
    const sources = []
    if (sourcesBlock) {
      const sr =
        /\{\s*label:\s*((?:'(?:\\'|[^'])*'\s*\+\s*)*'(?:\\'|[^'])*')\s*,\s*url:\s*'([^']+)'\s*,?\s*\}/g
      let sm
      while ((sm = sr.exec(sourcesBlock[1]))) {
        sources.push({ label: parseStringExpr(sm[1]), url: sm[2] })
      }
    }
    const fixture = /fixture:\s*true/.test(block)
    const embeds = []
    const embedsBlock =
      /embeds:\s*\[([\s\S]*?)\],\s*(?:published|fixture):/.exec(block) ||
      /embeds:\s*\[([\s\S]*?)\]\s*,?\s*(?:published|fixture):/.exec(block)
    if (embedsBlock) {
      const er = /\{\s*type:\s*'youtube'[\s\S]*?\}/g
      let em
      while ((em = er.exec(embedsBlock[1]))) {
        const eb = em[0]
        const id = /(?:^|[,\s])id:\s*'([^']+)'/.exec(eb)
        const youtubeUrl = /youtubeUrl:\s*'([^']+)'/.exec(eb)
        const embedUrl = /embedUrl:\s*'([^']+)'/.exec(eb)
        const titleMatch = /\btitle:\s*'((?:\\'|[^'])*)'/.exec(eb)
        const caption = /caption:\s*'((?:\\'|[^'])*)'/.exec(eb)
        const after = /afterBodyIndex:\s*(\d+)/.exec(eb)
        embeds.push({
          type: 'youtube',
          id: id?.[1],
          youtubeUrl: youtubeUrl?.[1],
          embedUrl: embedUrl?.[1],
          title: titleMatch ? titleMatch[1].replace(/\\'/g, "'") : undefined,
          caption: caption ? caption[1].replace(/\\'/g, "'") : undefined,
          afterBodyIndex: after ? Number(after[1]) : undefined,
        })
      }
    }
    const proseArticle = /proseArticle:\s*true/.test(block)
    const ogStr = (k) => {
      const m = new RegExp(`\\b${k}:\\s*'((?:\\\\'|[^'])*)'`).exec(block)
      return m ? m[1].replace(/\\'/g, "'") : undefined
    }
    articles.push({
      slug,
      title: titleStr,
      dek: dek ? dek[1].replace(/\\'/g, "'") : '',
      date: date?.[1] ?? '',
      category: category?.[1] ?? 'REPORTS',
      body: bodies,
      sources,
      embeds,
      fixture,
      proseArticle,
      ogKicker: ogStr('ogKicker'),
      ogPunch: ogStr('ogPunch'),
      ogStamp: ogStr('ogStamp'),
      ogFile: ogStr('ogFile'),
      kind: ogStr('kind') === 'clip' ? 'clip' : 'article',
      embed: parseEmbed(block, 'embed'),
      beforeEmbed: parseEmbed(block, 'beforeEmbed'),
      duration: ogStr('duration'),
      publishedAt: ogStr('publishedAt'),
      relatedArticle: ogStr('relatedArticle'),
      relatedClips: strList(block, 'relatedClips'),
      topics: strList(block, 'topics'),
    })
  }
  return articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}
