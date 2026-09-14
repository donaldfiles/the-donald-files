import type { Article } from '../content/articles'
import type { StampVariant } from '../components/Stamp'
import type { Category } from '../components/CategoryLabel'

export function fileIdFromArticle(article: Article, index = 0): string {
  const d = article.date.replace(/-/g, '').slice(2) // YYMMDD
  const n = String(index + 1).padStart(2, '0')
  return `DF-${d.slice(0, 4)}-${d.slice(4)}${n}`
}

export function formatDisplayDate(iso: string): string {
  const [y, m, day] = iso.split('-').map(Number)
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ]
  if (!y || !m || !day) return iso
  return `${months[m - 1]} ${String(day).padStart(2, '0')}, ${y}`
}

export function stampForCategory(category: Category): StampVariant {
  switch (category) {
    case 'ANALYSIS':
      return 'analysis'
    case 'OPINION':
      return 'opinion'
    case 'TIMELINE':
      return 'fact'
    case 'REPORTS':
    default:
      return 'fact'
  }
}

const CHIP_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /reuters/i, label: 'Reuters' },
  { re: /\bap\b|associated press/i, label: 'AP' },
  { re: /washington post|wapo/i, label: 'WaPo' },
  { re: /wall street journal|\bwsj\b/i, label: 'WSJ' },
  { re: /nbc/i, label: 'NBC' },
  { re: /supreme court|scotus/i, label: 'SCOTUS' },
  { re: /9th cir|ninth circuit|ca9/i, label: '9th Cir.' },
  { re: /federal register/i, label: 'Fed. Register' },
  { re: /\bdhs\b/i, label: 'DHS' },
  { re: /\bdoj\b/i, label: 'DOJ' },
  { re: /court docs|primary/i, label: 'Court docs' },
]

export function sourceChips(article: Article, max = 3): string[] {
  const found: string[] = []
  for (const s of article.sources) {
    for (const { re, label } of CHIP_PATTERNS) {
      if (re.test(s.label) && !found.includes(label)) {
        found.push(label)
        break
      }
    }
    if (found.length >= max) break
  }
  return found.length ? found : ['SOURCE']
}
