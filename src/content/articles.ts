import type { Category } from '../components/CategoryLabel'

export type SourceFile = {
  label: string
  url: string
}

export type Article = {
  slug: string
  title: string
  category: Category
  date: string
  dek: string
  body: string[]
  sources: SourceFile[]
  published: boolean
}

export const articles: Article[] = [
  {
    slug: 'iran-war-midterms-pickaxe-mountain',
    title: 'Iran war tied to midterms; Pickaxe Mountain threat',
    category: 'REPORTS',
    date: '2026-09-10',
    dek: 'Trump says the U.S.–Iran war will end after the November midterms and again threatens a strike on Pickaxe Mountain.',
    body: [
      'President Donald Trump said he expects the U.S.–Iran war to end immediately after the November midterm elections, and again threatened a strike on Iran’s Pickaxe Mountain site linked to its nuclear programme, Reuters reported on 10 September 2026.',
      'Speaking to reporters, Trump claimed Tehran cannot “hold out any longer” and is “desperate to try and affect the election.” At the Republican midterm convention he separately warned of “a little activity at Pickaxe,” advising Iran “not to get cute” or face a hard hit — a threat Reuters notes he has repeated since at least mid‑July.',
      'Reuters places the conflict at about six months old (U.S. and Israel struck Iran in February). The same dispatch reports renewed shipping attacks, Brent crude hovering above $100, and Houthi moves toward leverage over the Bab el‑Mandeb Strait. Trump’s popularity, Reuters says, has been driven to record lows by the war and higher fuel prices. A Wall Street Journal report that top advisers privately warn the war could last through his term (to January 2029) was noted by Reuters as unverified by its reporters.',
    ],
    sources: [
      {
        label:
          'Reuters, 10 Sep 2026 — Trump on post‑midterm war end + Pickaxe threat',
        url: 'https://www.reuters.com/world/middle-east/trump-says-iran-war-end-after-us-midterm-elections-threatens-attack-pickaxe-2026-09-10/',
      },
      {
        label: 'Reuters, 10 Sep 2026 — Pickaxe Mountain remarks (Holland/Singh)',
        url: 'https://www.reuters.com/world/trump-says-activity-seen-irans-pickaxe-mountain-urges-tehran-not-get-cute-2026-09-10/',
      },
    ],
    published: true,
  },
  {
    slug: 'doj-scotus-save-voter-verification',
    title: 'DOJ asks Supreme Court to restore blocked SAVE voter‑verification system',
    category: 'REPORTS',
    date: '2026-09-08',
    dek: 'The administration seeks a Supreme Court stay of a district‑court order blocking DHS SAVE use for state voter‑roll checks.',
    body: [
      'The Trump administration asked the U.S. Supreme Court on 8 September 2026 to stay a June district‑court order that blocked use of a revamped DHS Systematic Alien Verification for Entitlements (SAVE) database for checking state voter rolls — one of several moves expanding federal election involvement ahead of the 3 November midterms, Reuters reported.',
      'In the stay application, DOJ lawyers called Judge Sparkle Sooknanan’s order “indefensible,” arguing it vacates the government’s ability to use Social Security data when responding to state citizenship‑verification requests. The primary filing (DHS v. League of Women Voters, application dated 8 Sep 2026) states DHS updated SAVE in May 2025 to allow Social Security numbers and bulk queries, and that the D.C. Circuit denied a stay on 4 September before the Supreme Court ask.',
      'Reuters reports the June ruling found the overhaul haphazard and the citizenship data unreliable; advocacy groups say eligible voters have been wrongly flagged as noncitizens. Democracy Forward’s Skye Perryman said courts have rejected an “unlawful system” that risks privacy and voting rights. The administration is also seeking relief on a blocked Postal Service mail‑ballot rule, per the same Reuters piece.',
    ],
    sources: [
      {
        label: 'Reuters, 8 Sep 2026 — John Kruzel',
        url: 'https://www.reuters.com/legal/government/trump-asks-supreme-court-allow-voter-verification-database-blocked-by-judge-2026-09-08/',
      },
      {
        label:
          'Primary — SCOTUS stay application PDF, DHS et al. v. League of Women Voters et al. (filed 8 Sep 2026)',
        url: 'https://www.supremecourt.gov/DocketPDF/26/26A308/423264/20260908101245314_DHS%20v%20League%20of%20Women%20Voters%20Stay%20Application.pdf',
      },
    ],
    published: true,
  },
]

export function getPublishedArticles(): Article[] {
  return articles
    .filter((a) => a.published)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug && a.published)
}

export function getPublishedReports(): Article[] {
  return getPublishedArticles().filter((a) => a.category === 'REPORTS')
}
