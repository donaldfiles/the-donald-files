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
    title:
      'Trump ties endless Iran war to the midterms, threatens Pickaxe Mountain again',
    category: 'REPORTS',
    date: '2026-09-10',
    dek: 'Six months in, Trump says the Iran war ends after November — and threatens Pickaxe Mountain again.',
    body: [
      'Six months into a war he sold as a quick hit, President Donald Trump is now pitching voters a new timeline: the Iran fight ends after November — conveniently once the ballots are in. Reuters, 10 September 2026.',
      'To reporters, Trump claimed Tehran “can’t hold out any longer” and is “desperate to try and affect the election.” At the GOP’s midterm convention he also spotted “a little activity at Pickaxe” — the buried nuclear-linked site he’s been threatening since mid‑July — and warned Iran not to “get cute” or get hit “very hard.”',
      'Meanwhile, reality: shipping attacks are back, Brent’s parked above $100, Houthis are muscling toward Bab el‑Mandeb, and the war-plus-gas-prices combo has dragged Trump’s popularity to record lows, per Reuters. A Wall Street Journal bit that top aides privately fear this drags through January 2029? Reuters flagged it as unverified on their end — so it stays rumor until someone documents it.',
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
    title: 'DOJ begs the Supreme Court to revive its blocked voter-purge database',
    category: 'REPORTS',
    date: '2026-09-08',
    dek: 'Two months out from midterms, the Trump DOJ asks SCOTUS to unfreeze a citizenship-check system a federal judge already called a mess.',
    body: [
      'Two months out from midterms, the Trump DOJ is asking the Supreme Court to unfreeze a citizenship-check system a federal judge already called a mess — because nothing says “election integrity” like bulk Social Security scrapes and wrongful purge risk. Reuters, 8 September 2026.',
      'Lawyers called Judge Sparkle Sooknanan’s June block “indefensible,” moaning it strips their power to feed states citizenship hits from a revamped DHS SAVE database. The primary filing (DHS v. League of Women Voters, 8 Sep 2026) admits the May 2025 upgrade added SSNs + bulk search; the D.C. Circuit shrugged off a stay on 4 September, so now it’s SCOTUS cosplay.',
      'Sooknanan’s court found the rebuild haphazard with unreliable citizenship data. Rights groups say eligible voters — often naturalized citizens — get wrongly tagged as noncitizens and bounced off the rolls. Democracy Forward’s Skye Perryman: courts keep rejecting an “unlawful system” that torches privacy and the franchise. Bonus ask in the same Reuters piece: revive a blocked Postal Service mail-ballot rule. Pattern recognition not required, but it helps.',
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
    title:
      'Trump’s midterm bribe cosplay: $5,000 “Trump dividend” if the GOP keeps Congress',
    category: 'REPORTS',
    date: '2026-09-10',
    dek: 'At Dallas’s “Trumpapalooza,” Trump floated $5,000 to every adult citizen — only if Republicans keep the House and Senate.',
    body: [
      'At Dallas’s “Trumpapalooza” midterm convention, the president floated the most expensive campaign flyer in American history: $5,000 to every adult citizen — but only if Republicans keep the House and Senate. AP + Reuters, 9–10 September 2026.',
      'His words, via AP: win both chambers and “I will issue a dividend to every adult citizen… for $5,000.” Spend it in America, he shrugged, with zero mechanics. Reuters ran the calculator: ~270 million adults ≈ $1 trillion+, likely needs Congress, legality fuzzy. Approval underwater, Iran war toxic, cost of living grinding — so sure, promise everyone a yacht voucher and call it economic genius.',
      'Vulnerable Republicans skipped the show. He still spent the night defending the forever-adjacent Iran war and his tariff chaos. Bold strategy: make the midterms all about him while voters try to afford gas.',
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
    title:
      'DOJ asks SCOTUS to keep Nevada’s unlawfully parked U.S. attorney',
    category: 'REPORTS',
    date: '2026-09-09',
    dek: 'The Trump DOJ asks SCOTUS to bless parking political allies as U.S. attorneys without Senate confirmation — starting with Nevada’s Sigal Chattah.',
    body: [
      'The Trump DOJ just asked the Supreme Court to bless a staffing trick three appeals courts have already called illegal: parking political allies as U.S. attorneys without Senate confirmation. Target #1 — Nevada’s Sigal Chattah. Reuters, 9 September 2026.',
      'Solicitor General D. John Sauer says the August 9th Circuit smackdown (plus similar 2nd and 3rd Circuit losses) conflicts with the Federal Vacancies Reform Act, risks “chaos,” and could confuse five Ninth Circuit U.S. Attorney’s Offices handling 8,000+ cases a year. Translation: please let us keep the workaround.',
      'The primary opinion (United States v. Jackson, filed 17 August 2026) is blunt: you cannot make someone Acting U.S. Attorney by labeling them “first assistant” to an office that’s already vacant, and you cannot invent a de facto Acting U.S. Attorney by dumping every U.S. Attorney power onto one person. Panel affirmed Chattah’s disqualification from three prosecutions; defendants’ bid to kill the indictments got bounced for lack of appellate jurisdiction.',
      'Her path, via Reuters: interim under 28 U.S.C. § 546 (late March 2025, 120-day clock), then First Assistant / acting redesignation as the clock ran out. Nevada federal public defenders sued. Court caption: United States v. Jackson, No. 26-304.',
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

  {
    slug: 'trump-west-wing-holiday-cash-gifts',
    title: 'Trump gave $45k cash “holiday” gifts to West Wing favorites',
    category: 'REPORTS',
    date: '2026-09-09',
    dek: 'Disclosures show Trump handed $45,000 cash “holiday gifts” to three close aides — and $20,000 to a fourth — on top of federal salaries.',
    body: [
      'Fresh financial disclosures show President Donald Trump personally handed $45,000 cash “holiday gifts” to three close White House aides — and $20,000 to a fourth — on top of their federal salaries, Reuters reported 9 September 2026 (Washington Post first flagged the filings).',
      'The recipients: executive assistant Natalie Harp, communications adviser Margo Martin, and Oval Office ops deputy Chamberlain Harris ($45k each). Oval Office ops director Walt Nauta got $20k. Their own disclosure PDFs label the payments “Cash Gift for Holidays.” Harp, Martin, and Harris earn $150,000 a year; Nauta $175,000 — so the $45k gifts are roughly a one-third bump for that trio.',
      'Federal employees are generally barred from compensation beyond government pay. Former Bush ethics chief Richard Painter: “A White House staffer is not your Fifth Avenue doorman.” White House spokesman Davis Ingle said the gifts comply with ethics rules — Trump’s “longstanding practice” of Christmas gifts to people “in his orbit,” unrelated to “official government duties” and “entirely permissible.”',
      'Harp and Nauta are among Trump’s closest aides (including the secret Turkey-to-UK flight shuffle amid Iran threat fears, per prior WaPo reporting noted by Reuters). Harp helps run his Truth Social feed; colleagues call her the “human printer.” Nauta, a former valet, was charged (case later dropped) over the Mar-a-Lago documents matter after Trump returned to office.',
    ],
    sources: [
      {
        label: 'Reuters, 9 Sep 2026 — Pamuk/Chiacu',
        url: 'https://www.reuters.com/legal/government/trump-gave-45000-cash-gifts-close-aide-natalie-harp-others-2026-09-09/',
      },
      {
        label: 'Associated Press (via NBC), 9 Sep 2026',
        url: 'https://www.nbcnews.com/politics/politics-news/trump-gave-45000-holiday-gifts-natalie-harp-two-white-house-aides-rcna596751',
      },
      {
        label: 'Primary — Natalie Harp 2026 annual disclosure (PDF)',
        url: 'https://www.whitehouse.gov/wp-content/uploads/2026/09/Harp-Natalie-2026-Annual.pdf',
      },
      {
        label: 'Primary — Chamberlain Harris 2026 annual disclosure (PDF)',
        url: 'https://www.whitehouse.gov/wp-content/uploads/2026/09/Harris-Chamberlain-2026-Annual.pdf',
      },
      {
        label: 'Primary — Margo Martin 2026 annual disclosure (PDF)',
        url: 'https://www.whitehouse.gov/wp-content/uploads/2026/09/Martin-Margo-2026-Annual.pdf',
      },
      {
        label:
          'Primary — 2026 Annual Report to Congress on White House Staff (salaries)',
        url: 'https://www.whitehouse.gov/wp-content/uploads/2026/07/2026-Annual-Report-to-Congress-on-White-House-Staff.pdf',
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
