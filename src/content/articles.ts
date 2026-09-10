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
  {
    slug: 'trump-dividend-5000-gop-congress',
    title: 'Trump pledges $5,000 “Trump dividend” if GOP keeps Congress',
    category: 'REPORTS',
    date: '2026-09-10',
    dek: 'At a Dallas midterm convention, Trump pledged a $5,000 “Trump dividend” to every adult U.S. citizen if Republicans retain Congress.',
    body: [
      'At the Republican midterm convention in Dallas on 9 September 2026, President Donald Trump pledged to issue a $5,000 “Trump dividend” to every adult U.S. citizen if Republicans retain both the House and Senate in November, the Associated Press and Reuters reported.',
      'AP quotes Trump: “If the Republicans win the Senate and House, because of our tremendous strength and success economically, I will issue a dividend to every adult citizen in the United States of America for $5,000.” He said recipients would have to spend the money in the United States and offered no implementation details. Reuters independently reported the same pledge, estimating the proposal would likely cost more than $1 trillion (≈270 million U.S. adults) and could require congressional approval; legality and mechanics were unclear.',
      'Both wire reports place the speech at the center of an unusual midterm convention that cast Trump as the campaign’s focus despite low approval ratings and public discontent over living costs and the Iran war. Reuters notes some vulnerable Republicans skipped the event; AP reports Trump also defended the Iran war and tariffs in the same address.',
    ],
    sources: [
      {
        label:
          'Associated Press (via WRTV), 9 Sep 2026 — Colvin/Beaumont/Weissert',
        url: 'https://www.wrtv.com/news/politics/trump-promises-5000-dividend-to-citizens-during-midterm-convention-speech/',
      },
      {
        label: 'Reuters, 10 Sep 2026 — Bose/Holland/Layne',
        url: 'https://www.reuters.com/world/us/trump-touts-5000-payout-if-republicans-win-vance-waits-wings-2026-09-10/',
      },
    ],
    published: true,
  },

  {
    slug: 'doj-scotus-nevada-us-attorney-chattah',
    title: 'DOJ asks Supreme Court to keep Nevada U.S. attorney after 9th Circuit disqualification',
    category: 'REPORTS',
    date: '2026-09-09',
    dek: 'DOJ asks SCOTUS to overturn a 9th Circuit ruling that Sigal Chattah is not validly serving as Nevada’s top federal prosecutor.',
    body: [
      'The Trump administration petitioned the U.S. Supreme Court on 9 September 2026 to overturn a 9th Circuit ruling that Sigal Chattah is not validly serving as Nevada’s top federal prosecutor, Reuters reported — part of a broader fight over installing U.S. attorneys without Senate confirmation.',
      'Reuters says Solicitor General D. John Sauer argued the August appeals‑court decision and similar 2nd and 3rd Circuit rulings conflict with the Federal Vacancies Reform Act (FVRA), risk “chaos,” and threaten confusion across five Ninth Circuit U.S. Attorney’s Offices handling over 8,000 cases a year. The petition seeks to reverse the disqualification of Chattah from supervising three criminal cases.',
      'The primary 9th Circuit opinion (filed 17 August 2026 in United States v. Jackson and consolidated cases) held the Attorney General cannot make someone Acting U.S. Attorney by designating them first assistant to an already‑vacant office, and cannot create a de facto Acting U.S. Attorney by fully delegating all U.S. Attorney powers. The panel affirmed district‑court disqualification of Chattah from those prosecutions and dismissed defendants’ cross‑appeals seeking indictment dismissal for lack of appellate jurisdiction.',
      'Reuters recounts Chattah’s path: interim appointment under 28 U.S.C. § 546 (late March 2025, 120‑day limit), then redesignation as First Assistant / acting when that term was ending; Nevada federal public defenders challenged her authority. Case caption at the Court: United States v. Jackson, No. 26‑304.',
    ],
    sources: [
      {
        label: 'Reuters, 9 Sep 2026 — Nate Raymond',
        url: 'https://www.reuters.com/legal/government/doj-asks-us-supreme-court-allow-trump-ally-remain-nevadas-top-federal-prosecutor-2026-09-09/',
      },
      {
        label:
          'Primary — 9th Cir. opinion, 17 Aug 2026, Nos. 25‑6214 et al. (United States v. Jackson)',
        url: 'https://cdn.ca9.uscourts.gov/datastore/opinions/2026/08/17/25-6470.pdf',
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
