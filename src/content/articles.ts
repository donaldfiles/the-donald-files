import type { Category } from '../components/CategoryLabel'

export type SourceFile = {
  label: string
  url: string
}

/** Optional YouTube (or clean embed URL) exhibit on an article. */
export type ArticleEmbed = {
  type: 'youtube'
  /** Raw 11-character YouTube video id */
  id?: string
  /** watch?v= / youtu.be / shorts / embed URL — normalized to nocookie */
  youtubeUrl?: string
  /** https youtube.com/embed/... or youtube-nocookie.com/embed/... */
  embedUrl?: string
  title?: string
  caption?: string
  /**
   * Insert after this 0-based body paragraph index.
   * Omit → after last body graf (before SOURCE FILES).
   */
  afterBodyIndex?: number
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
  /** Optional video embeds (YouTube → youtube-nocookie). Reed/Ink fill these. */
  embeds?: ArticleEmbed[]
  /**
   * Engineering fixture — published for direct /reports/:slug access + static
   * HTML, but excluded from home / reports feeds.
   */
  fixture?: boolean
  /**
   * Continuous snark prose — no FACT/ANALYSIS/SATIRE body labels;
   * DossierCover omits tone Stamp chips when true.
   */
  proseArticle?: boolean
  /** Share card (og:image) kicker tape — short topic beat taken from the hed. */
  ogKicker?: string
  /** Word/phrase already in the hed to get the red highlight band. */
  ogPunch?: string
  /** Mood stamp: FILED / RECEIPTS / ON TAPE / IN WRITING. Never FACT/REPORT/ANALYSIS/SATIRE. */
  ogStamp?: string
  /** Override dossier number, e.g. 'FILE // 007'. Default derives from order. */
  ogFile?: string
  /** 'clip' = short video post at /trump-videos/<slug>/ (v4 ClipPost). Default 'article' at /reports/<slug>/. */
  kind?: 'article' | 'clip'
  /** ClipPost: the original upload, embedded (never re-hosted). hed = title, kicker = ogKicker. */
  embed?: ClipEmbed
  /** ClipPost: optional "before" clip shown under the main embed. */
  beforeEmbed?: ClipEmbed & { label?: string }
  /** ClipPost: display duration, e.g. "1:42". */
  duration?: string
  /** ClipPost: duration in seconds (for ISO 8601 PT…S). */
  durationSeconds?: number
  /** ClipPost: when we published, ISO with offset. */
  publishedAt?: string
  updatedAt?: string
  topics?: Topic[]
  featured?: boolean
  /** Slug of the long-form file this clip belongs to. */
  relatedArticle?: string
  /** Slugs of related clips (also used on articles to link back to their clips). */
  relatedClips?: string[]
}

export type Topic = 'gaffes' | 'lies' | 'ballroom' | 'tariffs' | 'truth-social' | 'courts' | 'cruelty'

export type ClipEmbed = {
  type: 'x' | 'youtube' | 'truthsocial'
  id: string
  url: string
  account?: string
  accountName?: string
  poster?: string
  /** truthsocial only: trumpstruth.org archive link for the quote card. */
  archiveUrl?: string
}

/** Site path for any post: clips live under /trump-videos/, files under /reports/. */
export function hrefFor(a: Pick<Article, 'slug' | 'kind'>): string {
  return a.kind === 'clip' ? `/trump-videos/${a.slug}/` : `/reports/${a.slug}`
}

export const articles: Article[] = [
  {
    slug: 'camp-lejeune-no-win-no-money',
    ogKicker: 'NO WIN, NO MONEY',
    ogPunch: 'ballot',
    ogStamp: 'RECEIPTS',
    title: 'He played fraud bounty hunter at lunch, then put sick Marines’ payouts on the ballot',
    category: 'REPORTS',
    date: '2026-10-21',
    dek: 'Afternoon: “I will be very generous.” Evening: “If we don’t win, there’s no money.” Same president. Same Tuesday. Different customers.',
    body: [
      'Turns out the government does have money for people who come forward. You just have to come forward to the right guy.',
      'Tuesday afternoon, in the Oval Office, Donald Trump and JD Vance rolled out a $25 million Justice Department program that pays tipsters up to $30,000 for reporting fraud that leads to convictions or big federal enforcement actions. A 24-year-old conservative YouTuber got a $10,000 check on the spot. Very game show.',
      'Then Trump added the twist nobody asked for. He’d personally be “the arbitrator of all of these decisions.” He’d decide who’s “deserving.” And he’d be “very generous. Believe me... we’re not looking to save on that.”',
      'Not looking to save. Hold that thought until dinner.',
      'Tuesday night, Greenville, North Carolina. A midterm rally in the same state as Camp Lejeune. For decades the drinking water on that Marine base was laced with industrial solvents, and up to a million people who lived or worked there from 1953 to 1987 may have been exposed. These are the people still fighting the government over cancer and worse.',
      'Trump announced his administration had delivered $1 billion in settlements to these veterans and their families. Applause. Then came the fine print.',
      '“If we win the House and the Senate, I am directing the Department of Justice to settle all remaining legitimate claims as soon as possible.” And then, so nobody missed it: “If we don’t win, there’s no money. If we do win, you’re getting it.”',
      'So that’s the system. Rat out a stranger and the president will be very generous. Get poisoned serving your country and he’ll want to see your ballot first.',
      'North Carolina’s governor, Josh Stein, didn’t bother with diplomacy. Conditioning “doing the right thing by sick North Carolinians on who wins the election,” he posted, “is foul.”',
      'And it’s not like this crept up on the White House. The same day, Laura Loomer, of all people, was on X calling the Justice Department’s settlement offers “lowball” and warning it was “a political disaster waiting to happen.” Attorney General Todd Blanche fired back that “We love our veterans and we want to get these cases right.” By nightfall the boss had a fix. Get them right after November 3. Maybe.',
      'This isn’t a one-off, either. It’s the whole tour. A $5,000 check for every adult citizen, but only if Republicans hold Congress. The night before in Kansas, year-round higher-ethanol gas sales, but only if Kansans keep their Republican senator. Every promise on this road trip comes with an “if,” and the “if” is always you voting the right way.',
      'Every president promises to deliver for voters. This one is promising to withhold from them.',
      'Cancer doesn’t care who controls the Senate. The guy in charge of the settlements apparently does.',
    ],
    sources: [
      {
        label: 'VIDEO EMBED — Trump on Camp Lejeune claims, Greenville rally, 20 Oct 2026 (original upload via Aaron Rupar)',
        url: 'https://x.com/atrupar/status/2112709597777596755',
      },
      {
        label: 'NBC News live blog — fraud tips program, “arbitrator” quote, Camp Lejeune remarks, Loomer/Blanche, 20 Oct 2026',
        url: 'https://www.nbcnews.com/politics/trump-administration/live-blog/trump-midterm-rally-north-carolina-2026-election-congress-live-updates-rcna604465',
      },
      {
        label: 'The Guardian live blog — “no money” for Camp Lejeune claims, Loomer vs DOJ, Nick Shirley $10,000 check, Kansas ethanol threat, 20 Oct 2026',
        url: 'https://www.theguardian.com/us-news/live/2026/oct/20/donald-trump-midterms-republicans-democrats-north-carolina-latest-updates',
      },
      {
        label: 'Raleigh News & Observer — Greenville rally live updates, Gov. Josh Stein’s response, $5,000 promise, 20 Oct 2026',
        url: 'https://www.newsobserver.com/news/politics-government/election/article317703733.html',
      },
      {
        label: 'CNN — Trump says he’ll direct DOJ to settle remaining Camp Lejeune claims if GOP wins, 20 Oct 2026',
        url: 'https://www.cnn.com/2026/10/20/politics/live-news/midterm-election-congress',
      },
      {
        label: 'AP — Trump campaigns in North Carolina; $5,000 checks and fraud-tip program, 20 Oct 2026',
        url: 'https://apnews.com/article/trump-ukraine-zelenskyy-congress-midterm-elections-a298dcb9327bbad29c0bcc9e61955edb',
      },
      {
        label: 'Washington Post — Tracking Trump: fraud tip rewards and more, 20 Oct 2026',
        url: 'https://www.washingtonpost.com/the-seven-trump/2026/10/20/tracking-trump-us-delays-missiles-ukraine-voters-doubt-trump-will-accept-midterm-loss-trumps-fraud-tip-rewards-more/',
      },
      {
        label: 'VA — Camp Lejeune past water contamination (background)',
        url: 'https://www.publichealth.va.gov/EXPOSURES/CAMP-LEJEUNE/',
      },
    ],
    relatedClips: ['trump-sick-person-reporter-oval-office', 'trump-budget-deficit-trade-deficit-confusion'],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'trump-data-centers-mandated-by-me',
    kind: 'clip',
    ogKicker: 'POSTED AT 1:37AM',
    ogPunch: 'Mandates',
    ogStamp: 'RECEIPTS',
    title: 'Trump ‘Mandates’ Data Centers at 1:37am. In March It Was a Pledge.',
    category: 'REPORTS',
    date: '2026-10-21',
    dek: 'Nothing good gets posted at 1:37 in the morning. Ask anyone’s ex. Or the President of the United States.',
    publishedAt: '2026-10-21T11:30:00+02:00',
    topics: ['truth-social'],
    embed: {
      type: 'truthsocial',
      id: '117477279556215047',
      url: 'https://truthsocial.com/@realDonaldTrump/117477279556215047',
      account: '@realDonaldTrump',
      accountName: 'Donald Trump',
      archiveUrl: 'https://www.trumpstruth.org/statuses/42533',
    },
    body: [
      'Nothing good gets posted at 1:37 in the morning. Ask anyone’s ex. Or the President of the United States.',
      'Overnight, Donald Trump announced on Truth Social that he’s been “watching Data Centers very closely” and has reached “a very strong conclusion.” New data centers, the “gigantic” ones included, “are mandated by me to make their own electricity.” The result, in his own words: “therefore there is electric price increase.” Then the next sentence: “In fact, there could be a substantial decrease.” Pick one, sir. It’s 1:37.',
      'Mandated by him? In March the White House brought in seven tech giants, Amazon, Google, Meta, Microsoft, OpenAI, Oracle and xAI, to sign what its own fact sheet calls the “Ratepayer Protection Pledge.” A pledge. Companies agreed to build, bring or buy their own power. The BBC asked energy analysts at the time how anyone would enforce it. Nobody had a great answer.',
      'The other thing he said in March: tech companies “need some PR help.” Seven months later, his PR plan is to have them hand the neighbours cash. “Pay the community, and/or individuals within the community, a ‘dividend.’” Data centers that were unpopular, he says, became “extremely popular when a financial deal is struck.” That’s not energy policy. That’s a bribe with a dividend sticker on it.',
      'And the receipt nobody at 1:37 brought up: on the campaign trail he promised to cut energy bills in half in his first year. According to the government’s own energy statisticians, residential electricity prices rose 6% in 2025.',
    ],
    sources: [
      {
        label: 'Trump on Truth Social: the data center post (archived at Trump’s Truth)',
        url: 'https://www.trumpstruth.org/statuses/42533',
      },
      {
        label: 'Reuters via CNBC-TV18: Trump says data center firms should pay communities a “dividend”',
        url: 'https://www.cnbctv18.com/technology/trump-says-companies-should-pay-dividend-to-communities-to-make-data-centres-popular-20015962.htm',
      },
      {
        label: 'White House fact sheet: the Ratepayer Protection Pledge, March 2026',
        url: 'https://www.whitehouse.gov/fact-sheets/2026/03/fact-sheet-president-donald-j-trump-advances-energy-affordability-with-the-ratepayer-protection-pledge/',
      },
      {
        label: 'BBC News: Tech firms pledge to pay for data center power costs. But will they?',
        url: 'https://www.bbc.co.uk/news/articles/cx244kdplnzo',
      },
      {
        label: 'American Presidency Project: Trump’s remarks at the Ratepayer Protection Pledge roundtable',
        url: 'http://presidency.ucsb.edu/documents/remarks-during-roundtable-discussion-the-ratepayer-protection-pledge',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'trump-budget-deficit-trade-deficit-confusion',
    kind: 'clip',
    ogKicker: 'WRONG DEFICIT, SIR',
    ogPunch: 'Deficit',
    ogStamp: 'ON TAPE',
    title: 'Asked About the Budget Deficit, Trump Answers About Canada',
    category: 'REPORTS',
    date: '2026-10-20',
    dek: 'Two deficits walk into the Oval Office. The president can only see one of them.',
    publishedAt: '2026-10-21T11:30:00+02:00',
    topics: ['gaffes'],
    embed: {
      type: 'x',
      id: '2112614474561552601',
      url: 'https://x.com/atrupar/status/2112614474561552601',
      account: '@atrupar',
      accountName: 'Aaron Rupar',
    },
    relatedArticle: 'camp-lejeune-no-win-no-money',
    relatedClips: ['trump-sick-person-reporter-oval-office'],
    body: [
      'Two deficits walk into the Oval Office. The president can only see one of them.',
      'Tuesday, at the fraud bounty event, a reporter asked a straight budget question: could all the fraud and waste the administration says it’s cutting make a difference to the deficit next year? Trump: “Absolutely, a tremendous difference.” So far so good.',
      'Then he explained how. “I’m cutting back the deficit with these countries where we do business.” Canada, $90 billion. Mexico, $175 billion. The European Union. He’s cutting them “way back to the old days.” Those are trade gaps, sir. What Americans buy from other countries versus what we sell them. They don’t come out of the Treasury, and cutting them doesn’t put a dime back in.',
      'The deficit the reporter asked about is the federal one, and the government’s own numbers put this fiscal year’s at close to $2 trillion. Not a typo. Trillion.',
      'The man running the world’s largest economy, at an event about catching people who mix up money, mixed up the two most famous deficits in economics. You can’t make it up. You don’t have to. It’s on tape.',
    ],
    sources: [
      {
        label: 'Aaron Rupar: the deficit answer clip',
        url: 'https://x.com/atrupar/status/2112614474561552601',
      },
      {
        label: 'The White House: full video of the Trump and Vance announcement, 20 Oct',
        url: 'https://www.whitehouse.gov/videos/president-trump-and-vice-president-jd-vance-make-an-announcement/',
      },
      {
        label: 'CNBC: US budget deficit for fiscal 2026 near $2 trillion',
        url: 'https://www.cnbc.com/2026/10/16/us-budget-deficit-2026.html',
      },
      {
        label: 'Council on Foreign Relations: the US trade deficit, and how much it matters',
        url: 'https://www.cfr.org/backgrounders/us-trade-deficit-how-much-does-it-matter',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'trump-dumocrat-new-term-since-may',
    kind: 'clip',
    ogKicker: 'STILL FRESH, APPARENTLY',
    ogPunch: 'Dumocrat',
    ogStamp: 'ON TAPE',
    title: 'Trump’s ‘Brand New’ Dumocrat Joke Turns Five Months Old',
    category: 'REPORTS',
    date: '2026-10-20',
    dek: 'Every comedian has one bit they can’t let go of. This one has the nuclear codes.',
    publishedAt: '2026-10-21T11:30:00+02:00',
    topics: ['gaffes'],
    embed: {
      type: 'x',
      id: '2112759782864224757',
      url: 'https://x.com/RpsAgainstTrump/status/2112759782864224757',
      account: '@RpsAgainstTrump',
      accountName: 'Republicans against Trump',
    },
    beforeEmbed: {
      type: 'youtube',
      id: 'Ov3clNfykaI',
      url: 'https://www.youtube.com/watch?v=Ov3clNfykaI',
      accountName: 'FOX Nashville',
      label: 'FOX Nashville on YouTube: Trump debuts “Dumocrats” in Suffern, NY, May 2026',
    },
    body: [
      'Every comedian has one bit they can’t let go of. This one has the nuclear codes.',
      'Tuesday night in Greenville, North Carolina, Donald Trump treated the crowd to his latest invention. “Dumocrat. I use that new term. It took me years to figure it out.” Then the method, step by step, like he’s explaining the Manhattan Project: take out the E, put in a U, and “most people don’t know that ‘dumb’ has a B, so we throw that out too.”',
      'New term. Took years. Funny thing about that. In May, at a rally in Suffern, New York, he did the exact same bit, the E, the U, “a lot of people don’t know dumb has a B in it,” and called it “a new name I came up with, you’ve never heard.” He ran it again in Wisconsin in early June. His own Rapid Response account was posting “Radical Dumocrats” the night before Greenville.',
      'So, to recap: the President of the United States has spent at least five months introducing the same one-letter joke as brand new, and each time explaining that the rest of us don’t know how to spell “dumb.”',
      'He used it on Roy Cooper, who’s running for Senate. Cooper’s response wasn’t necessary. The bit did the work.',
    ],
    sources: [
      {
        label: 'Republicans against Trump: the Greenville “Dumocrat” clip',
        url: 'https://x.com/RpsAgainstTrump/status/2112759782864224757',
      },
      {
        label: 'FOX Nashville on YouTube: Trump debuts “Dumocrats” in Suffern, NY, May 2026',
        url: 'https://www.youtube.com/watch?v=Ov3clNfykaI',
      },
      {
        label: 'Forbes Breaking News on YouTube: “A lot of people don’t know dumb has a B,” June 2026',
        url: 'https://www.youtube.com/watch?v=GsAUQu4L61M',
      },
      {
        label: 'Rapid Response 47: “Radical Dumocrats” post, 19 Oct',
        url: 'https://x.com/RapidResponse47/status/2112346642632331698',
      },
      {
        label: 'WITN: Trump’s Greenville rally',
        url: 'https://www.witn.com/2026/10/20/president-trump-holding-midterm-rally-greenville-today/',
      },
      {
        label: 'WCTI: Trump rallies Republicans in Greenville, criticizes Cooper',
        url: 'https://wcti12.com/news/local/trump-rallies-republicans-in-greenville-criticizes-cooper-ahead-of-midterms',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'trump-gas-prices-small-price-to-pay',
    kind: 'clip',
    ogKicker: 'EASY FOR HIM TO SAY',
    ogPunch: 'Small',
    ogStamp: 'FILED',
    title: 'Trump Says Your Gas Bill Is a ‘Small Price to Pay.’ Small for Whom?',
    category: 'REPORTS',
    date: '2026-10-20',
    dek: 'Great news, rural America: the president has looked at your fuel bill and decided it’s cheap.',
    publishedAt: '2026-10-21T11:30:00+02:00',
    topics: ['gaffes'],
    embed: {
      type: 'x',
      id: '2112622965774778437',
      url: 'https://x.com/atrupar/status/2112622965774778437',
      account: '@atrupar',
      accountName: 'Aaron Rupar',
    },
    body: [
      'Great news, rural America: the president has looked at your fuel bill and decided it’s cheap.',
      'Tuesday in the Oval Office, a reporter cited Fox News’ own numbers: less than a quarter of rural voters are happy with the economy. Was Trump concerned? “No.” Once the war is over, “it’s gonna end very soon,” oil will “drop like a rock.” Meanwhile, “It’s a small price to pay” to keep Iran from getting a nuclear weapon.',
      'Small for him. Out in Kansas, farmers are bringing in the harvest with diesel more than $2.50 a gallon higher than a year ago. The man calling that small hasn’t paid for his own fuel since January 2025. Air Force One runs on yours.',
      'And “very soon” is doing a lot of work. The night before, he told a Wichita TV station “We could win tomorrow, frankly. We could leave today.” If you can leave today and win tomorrow, the voters paying at the pump would like to know why they’re paying for next week.',
    ],
    sources: [
      {
        label: 'Aaron Rupar: the full Oval Office “small price to pay” exchange',
        url: 'https://x.com/atrupar/status/2112622965774778437',
      },
      {
        label: 'Fox News: Trump says high gas prices are a small price to pay to stop an Iranian nuclear weapon',
        url: 'https://www.foxnews.com/video/6407148730112',
      },
      {
        label: 'KWCH 12 News: Trump’s one-on-one with Dylan Domangue',
        url: 'https://www.kwch.com/2026/10/20/exclusive-president-trumps-one-on-one-with-12-news-dylan-domangue/',
      },
      {
        label: 'HuffPost live updates: Kansas farmers and diesel prices',
        url: 'https://www.huffpost.com/entry/live-updates_n_6ad5dc16e4b061c2be4462bd/liveblog_6ad6e7dce4b05d72fd9429d4',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'trump-sick-person-reporter-oval-office',
    kind: 'clip',
    ogKicker: 'QUIET! QUIET!',
    ogPunch: 'Sick',
    ogStamp: 'ON TAPE',
    title: 'Trump to Reporter Asking About His Golf Course: ‘Are You a Sick Person?’',
    category: 'REPORTS',
    date: '2026-10-20',
    dek: 'The fraud tip line had been open about an hour before the president found something he really wanted to report: a journalist.',
    publishedAt: '2026-10-21T11:30:00+02:00',
    topics: ['cruelty'],
    embed: {
      type: 'x',
      id: '2112623065263726702',
      url: 'https://x.com/atrupar/status/2112623065263726702',
      account: '@atrupar',
      accountName: 'Aaron Rupar',
    },
    relatedArticle: 'camp-lejeune-no-win-no-money',
    relatedClips: ['trump-daily-wire-is-good-sorry', 'trump-budget-deficit-trade-deficit-confusion'],
    body: [
      'The fraud tip line had been open about an hour before the president found something he really wanted to report: a journalist.',
      'Tuesday in the Oval Office, The Independent’s Andrew Feinberg asked a simple money question. Why would a whistleblower take the administration’s new bounty, about 1% by Trump’s own pitch, when the False Claims Act, on the books since Lincoln, pays up to a quarter of what’s recovered? Trump’s answer, per Feinberg: “Because it’s a lot of money.” Math is optional at this level.',
      'Then he asked Feinberg who he was. Feinberg has covered him for a decade, and by his account Trump winked at him earlier in that same event. A little later: “I don’t know who the hell you are, but you better be careful.”',
      'Then Feinberg tried a question about Trump’s plan to rebuild a public D.C. golf course. “Wait. Wait. Quiet. Quiet. What’s wrong with you? Are you a sick person?” Feinberg: “Not that I know of, sir.” Trump: “I actually think there’s something wrong with you.” Aaron Rupar counted it as Trump’s third blowup of the Q&A.',
      'There’s a pattern. The day before, Trump called the federal judge on the same golf course case a “crazed lunatic” on Truth Social. Ask about the golf course and you get a diagnosis. Feinberg says that after the event the White House rapid-response account called him a “Mongoloid Moron” and Vance called him an “imbecile.” Feinberg, for the record, says his annual physical came back fine.',
    ],
    sources: [
      {
        label: 'Aaron Rupar: the “Are you a sick person?” clip',
        url: 'https://x.com/atrupar/status/2112623065263726702',
      },
      {
        label: 'Bulwark Clips: the full golf course exchange',
        url: 'https://x.com/BulwarkClips/status/2112625146397700141',
      },
      {
        label: 'The Independent: Andrew Feinberg’s account of the Oval Office exchange',
        url: 'https://www.the-independent.com/news/world/americas/us-politics/trump-the-independent-reporter-oval-office-andrew-feinberg-b3070310.html',
      },
      {
        label: 'The Hill: Trump snaps at White House reporter, “Are you a sick person?”',
        url: 'https://thehill.com/homenews/media/6161621-trump-snaps-at-white-house-reporter-are-you-a-sick-person/',
      },
      {
        label: 'Fox News: Judge Trump called a “crazed lunatic” backs off DOJ demand in golf course case',
        url: 'https://www.foxnews.com/politics/judge-trump-called-lunatic-abruptly-backs-off-demand-showdown-doj-3',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'trump-ukraine-mostly-soldiers-die',
    kind: 'clip',
    ogKicker: '“OR WHATEVER”',
    ogPunch: 'Soldiers',
    ogStamp: 'RECEIPTS',
    title: 'Trump on Russia’s Strikes: ‘Mostly Soldiers Die.’ The Baby in the Stroller Wasn’t One.',
    category: 'REPORTS',
    date: '2026-10-20',
    dek: 'Sunday a Russian drone hit a park in Nova Vodolaha, in Ukraine’s Kharkiv region. Six civilians dead.',
    publishedAt: '2026-10-21T11:30:00+02:00',
    topics: ['cruelty'],
    embed: {
      type: 'x',
      id: '2112626041554628792',
      url: 'https://x.com/United24media/status/2112626041554628792',
      account: '@United24media',
      accountName: 'UNITED24 Media',
    },
    body: [
      'Sunday a Russian drone hit a park in Nova Vodolaha, in Ukraine’s Kharkiv region. Six civilians dead. The youngest was a baby just over a year old, in her stroller. Fifteen wounded, seven of them kids.',
      'Tuesday, in the Oval Office, the President of the United States was asked about Russia hitting civilians. His answer: “Some people die in a town that got hit or whatever, but mostly soldiers die.”',
      'Or whatever. That’s the eulogy.',
      'In the same Q&A he said Zelensky “has to want to settle this war,” and that America had “given tremendous amounts to Ukraine” and gotten “nothing back other than high diesel.” Hard to say what high diesel means here. Ten days ago Trump lifted US sanctions on Russian diesel, so the only diesel in this story came from the side flying the drones.',
      'Also Tuesday, by the Guardian’s count, at least nine more people were killed across Ukraine, including passengers on the Kyiv to Odesa highway. Mostly soldiers, presumably. Or whatever.',
    ],
    sources: [
      {
        label: 'UNITED24 Media: the “mostly soldiers die” clip',
        url: 'https://x.com/United24media/status/2112626041554628792',
      },
      {
        label: 'Bulwark Clips: the “nothing back other than high diesel” clip',
        url: 'https://x.com/BulwarkClips/status/2112618857256890419',
      },
      {
        label: 'Kyiv Post: Trump says Ukraine “has to want to make a deal” and “mostly soldiers die”',
        url: 'https://www.kyivpost.com/post/87673',
      },
      {
        label: 'PBS News / AP: Trump says US has gotten “nothing” from Ukraine',
        url: 'https://www.pbs.org/newshour/politics/watch-trump-says-u-s-has-gotten-nothing-from-ukraine-other-than-high-diesel-urging-deal',
      },
      {
        label: 'The Guardian: US resumes intelligence sharing with Ukraine; Tuesday’s death toll and the diesel sanctions',
        url: 'https://www.theguardian.com/world/2026/oct/20/us-has-resumed-sharing-intelligence-with-ukraine-about-russian-strikes-says-zelenskyy',
      },
      {
        label: 'Ukrainska Pravda: Russian drone strike on Kharkiv Oblast park kills six',
        url: 'https://www.pravda.com.ua/eng/news/2026/10/19/8058772/',
      },
      {
        label: 'Kyiv Post: Russian drone kills six in Kharkiv park, including infant in stroller',
        url: 'https://www.kyivpost.com/post/87532',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'trump-watercane-hurricane-helene',
    kind: 'clip',
    ogKicker: 'NEW WORD JUST DROPPED',
    ogPunch: 'Watercane',
    ogStamp: 'ON TAPE',
    title: 'Trump Invents the ‘Watercane,’ a Hurricane but Wetter',
    category: 'REPORTS',
    date: '2026-10-20',
    dek: 'Somewhere a meteorologist just closed their laptop and walked into the sea.',
    publishedAt: '2026-10-21T11:30:00+02:00',
    topics: ['gaffes'],
    embed: {
      type: 'x',
      id: '2112700772815155620',
      url: 'https://x.com/atrupar/status/2112700772815155620',
      account: '@atrupar',
      accountName: 'Aaron Rupar',
    },
    body: [
      'Somewhere a meteorologist just closed their laptop and walked into the sea.',
      'Tuesday night in Greenville, North Carolina, Donald Trump got around to Hurricane Helene, the 2024 storm that wrecked the western half of the state. He gave it a rebrand. “We call it a watercane.” Who “we” is, he didn’t say. Nobody at the National Hurricane Center has been informed.',
      'His scientific finding: there’s never been a hurricane “that threw out more water than that.” A hurricane. With water. Stop the presses.',
      'To be fair, he has a back catalogue. In 2018 Florence was “one of the wettest we’ve ever seen from the standpoint of water.” In 2019 there was the Sharpie on the Dorian map. And in 2025 he said he’d start “phasing out” FEMA, the agency that actually turns up after the watercane leaves.',
      'He used the storm to call Roy Cooper, the former governor now running for Senate, “horrible” on recovery. Disaster-response tips from the man who wanted to phase out disaster response. Very wet advice.',
    ],
    sources: [
      {
        label: 'Aaron Rupar: the “watercane” clip, Greenville rally',
        url: 'https://x.com/atrupar/status/2112700772815155620',
      },
      {
        label: 'HuffPost: Trump faces storm of criticism over “water cane”',
        url: 'https://www.huffpost.com/entry/trump-watercane-hurricane_n_6ad830cfe4b02def98693d8c',
      },
      {
        label: 'PBS News: Trump holds GOP midterm rally in North Carolina',
        url: 'https://www.pbs.org/newshour/politics/watch-live-trump-holds-gop-midterm-rally-in-north-carolina',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'trump-christianity-know-more-than-anybody-two-corinthians',
    kind: 'clip',
    ogKicker: 'TWO CORINTHIANS WALK INTO A BAR',
    ogPunch: 'Christianity',
    ogStamp: 'ON TAPE',
    title: 'Trump Knows More About Christianity ‘Than Anybody,’ Says the ‘Two Corinthians’ Guy',
    category: 'REPORTS',
    date: '2026-10-19',
    dek: 'Move over, theologians. The man has spoken.',
    publishedAt: '2026-10-21T11:30:00+02:00',
    topics: ['gaffes'],
    embed: {
      type: 'x',
      id: '2112338361079812590',
      url: 'https://x.com/atrupar/status/2112338361079812590',
      account: '@atrupar',
      accountName: 'Aaron Rupar',
    },
    beforeEmbed: {
      type: 'youtube',
      id: '8EIgHsGZAmk',
      url: 'https://www.youtube.com/watch?v=8EIgHsGZAmk',
      accountName: 'C-SPAN',
      label: 'C-SPAN on YouTube: Trump, “Two Corinthians,” Liberty University, Jan 2016',
    },
    body: [
      'Move over, theologians. The man has spoken.',
      'Monday night in Park City, Kansas, Donald Trump told the crowd he has “the all-time, in history, Christian vote,” and then went a step further: “I know more, I know more than anybody.” About Christianity. More than anybody. Including, presumably, the guy it’s named after.',
      'Then he told the pastor story. A “certain pastor from a place in Dallas, Texas” supposedly said Trump “might not read the Bible as much as us, he might not know every passage,” but would “lead us to a period of time in Christianity that nobody else can do.” Trump’s review: “And he turned out to be right.” Hold on. He opened with “I know more than anybody,” then quoted a pastor saying he doesn’t know every passage. Two claims, under a minute apart.',
      'The pastor is Robert Jeffress of First Baptist Dallas. He told HuffPost Trump was paraphrasing a 2015 Fox interview, and what he actually remembers saying is that Trump would be “the most faith-friendly president in history.” Not quite a new era of Christianity. That’s a Yelp review.',
      'The vault has the receipt. In January 2016, at Liberty University, candidate Trump quoted “Two Corinthians” to a room full of evangelicals who’d spent their whole lives saying “Second Corinthians.” The room laughed. Ten years later he knows more than anybody. Growth.',
    ],
    sources: [
      {
        label: 'Aaron Rupar: the “period of time in Christianity” clip',
        url: 'https://x.com/atrupar/status/2112338361079812590',
      },
      {
        label: 'Acyn: “I know more than anybody” clip',
        url: 'https://x.com/Acyn/status/2112338245703053374',
      },
      {
        label: 'HuffPost via Yahoo: Trump says he’ll lead a “time of Christianity,” and pastor Robert Jeffress responds',
        url: 'https://www.yahoo.com/news/politics/articles/trump-says-ll-lead-us-222326707.html',
      },
      {
        label: 'Trump Archive: Park City, Kansas rally transcript, 19 Oct 2026',
        url: 'https://trump-archive.com/item/a8a2b457-2f12-4209-8743-25fd4f8b2038',
      },
      {
        label: 'C-SPAN on YouTube: Trump, “Two Corinthians,” Liberty University, Jan 2016',
        url: 'https://www.youtube.com/watch?v=8EIgHsGZAmk',
      },
      {
        label: 'Washington Post / Reuters video: “Two Corinthians” reference draws laughs',
        url: 'https://www.washingtonpost.com/video/politics/trumps-two-corinthians-reference-draws-laughs-at-liberty-university/2016/01/19/d640a1ba-be82-11e5-98c8-7fab78677d51_video.html',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'trump-daily-wire-is-good-sorry',
    kind: 'clip',
    ogKicker: 'OH. SORRY.',
    ogPunch: 'Fake',
    ogStamp: 'ON TAPE',
    title: 'Trump Calls a Question ‘Fake News,’ Then Learns It’s From the Daily Wire',
    category: 'REPORTS',
    date: '2026-10-19',
    dek: 'About fifteen seconds. That’s how long it takes the fake news to become real news, if it’s from the right outlet.',
    publishedAt: '2026-10-21T11:30:00+02:00',
    topics: ['gaffes'],
    embed: {
      type: 'x',
      id: '2112263827538505803',
      url: 'https://x.com/atrupar/status/2112263827538505803',
      account: '@atrupar',
      accountName: 'Aaron Rupar',
    },
    relatedClips: ['trump-sick-person-reporter-oval-office'],
    body: [
      'About fifteen seconds. That’s how long it takes the fake news to become real news, if it’s from the right outlet.',
      'Monday, before leaving for Kansas, Donald Trump got a question about France: Emmanuel Macron, the reporter began, was blaming the Iran war and Trump for the rioting there. Trump didn’t let her finish. “That’s fake news. Who are you with?”',
      '“No, sir. Mary Margaret with the Daily Wire.”',
      'And just like that: “Oh, the Daily Wire is good. Sorry. Daily Wire is good.” Same question. Same facts, or lack of them. The only thing that changed was the logo on the mic.',
      'Save this one for next time he talks about media bias. Because the next day, in the Oval Office, a reporter from The Independent who has covered him for a decade got “I don’t know who the hell you are” and “Are you a sick person?” Same president. Same “who are you with?” Different answer, different treatment.',
    ],
    sources: [
      {
        label: 'Aaron Rupar: the “Daily Wire is good. Sorry.” clip',
        url: 'https://x.com/atrupar/status/2112263827538505803',
      },
      {
        label: 'Newsweek: Trump apologizes for calling Daily Wire question “fake news”',
        url: 'https://www.newsweek.com/trump-apologized-daily-wire-news-question-fake-france-12591572',
      },
      {
        label: 'Mediaite: Trump snaps at reporter, then apologizes after hearing she’s with the Daily Wire',
        url: 'https://www.mediaite.com/media/news/trump-snipes-at-reporter-then-apologizes-after-hearing-shes-with-pro-maga-outlet-sorry-daily-wire-is-good/',
      },
      {
        label: 'The Independent: Trump was about to unload on a reporter. Then she said 8 words',
        url: 'https://www.independent.co.uk/news/world/americas/us-politics/trump-reporter-daily-wire-iran-macron-b3069560.html',
      },
      {
        label: 'The Independent: Andrew Feinberg on the next day’s Oval Office exchange',
        url: 'https://www.the-independent.com/news/world/americas/us-politics/trump-the-independent-reporter-oval-office-andrew-feinberg-b3070310.html',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'trump-nobody-appreciates-me-kansas-rally',
    kind: 'clip',
    ogKicker: 'PITY PARTY OF ONE',
    ogPunch: 'Sad',
    ogStamp: 'ON TAPE',
    title: 'Trump Is Very Sad Nobody Appreciates How Great a President Trump Is',
    category: 'REPORTS',
    date: '2026-10-19',
    dek: 'Nothing says “golden age” like the president crying about it into a microphone in Kansas.',
    publishedAt: '2026-10-21T11:30:00+02:00',
    topics: ['gaffes'],
    embed: {
      type: 'x',
      id: '2112344604045725803',
      url: 'https://x.com/Acyn/status/2112344604045725803',
      account: '@Acyn',
      accountName: 'Acyn',
    },
    body: [
      'Nothing says “golden age” like the president crying about it into a microphone in Kansas.',
      'Monday night in Park City, Donald Trump told a rally crowd what he thinks about while sitting in “the most magnificent office in the world.” Not the economy. Not the war. Him. “Nobody appreciates how great a president I am!” Then, in case anyone missed the violin: “I feel very sad.”',
      'The crowd tried to cheer him up. It didn’t take. He kept going with the list of things he feels nobody thanks him for: rebuilding the military, Space Force, “the best job numbers in history,” the border. A man reading his own Yelp review out loud and giving it five stars.',
      'Then he saw the headline coming and tried to block it. If the media reported he was in a down mood, he said, “they are just absolute scum.” So: be sad on stage, call it news, call the people who report it scum. A full emotional cycle in one rally.',
      'Here’s the bit he skipped. He did this with his approval at a record low and the midterms two weeks out. Turns out the country has noticed how great a president he is. That’s the problem.',
    ],
    sources: [
      {
        label: 'Acyn: “Nobody appreciates how great a president I am” clip',
        url: 'https://x.com/Acyn/status/2112344604045725803',
      },
      {
        label: 'HuffPost via AOL: Trump whines about Americans not appreciating him',
        url: 'https://www.aol.com/articles/trump-whines-americans-not-appreciating-012850000.html',
      },
      {
        label: 'New York Magazine: the Kansas rally, including the “nobody appreciates” riff',
        url: 'https://nymag.com/intelligencer/article/trump-antisemitic-slur-shylock-kansas-rally.html',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'trump-shylock-slur-roger-marshall-kansas',
    kind: 'clip',
    ogKicker: 'HE WAS WARNED',
    ogPunch: 'Slur',
    ogStamp: 'RECEIPTS',
    title: 'Trump Defends Senator Who Sued 700 Patients With an Antisemitic Slur',
    category: 'REPORTS',
    date: '2026-10-19',
    dek: 'Usually a politician’s worst story gets buried. Donald Trump dug this one up on stage and threw a slur in with it.',
    publishedAt: '2026-10-21T11:30:00+02:00',
    topics: ['cruelty'],
    embed: {
      type: 'x',
      id: '2112342320339439718',
      url: 'https://x.com/Acyn/status/2112342320339439718',
      account: '@Acyn',
      accountName: 'Acyn',
    },
    body: [
      'Usually a politician’s worst story gets buried. Donald Trump dug this one up on stage and threw a slur in with it.',
      'Back story: last month the New York Times reported that Sen. Roger Marshall’s obstetrics practice, before he went into politics, sued more than 700 patients over unpaid bills. In 81 of those cases patients were arrested after missing court dates. The Kansas City Star later found the practice charged 18% interest, possibly above the state’s 15% cap. Not great for a guy in a surprisingly tight race in Kansas.',
      'So on Monday in Park City, Trump came to the rescue. Marshall was “mandated by law” to chase that money, Trump claimed. “And they made it like he was some kind of a Shylock type guy. I don’t know if I should be saying it.”',
      'He shouldn’t have. He knows that, because Jewish groups called him out for using the same word at a rally in July 2025. Back then he said he’d “never heard it that way.” Fifteen months is apparently not enough time to hear it that way.',
      'New York Magazine adds the cherry: Trump said someone on his team had told him not to bring up the lawsuit story at all. He did it anyway, “because I believe it’s appropriate.” The ADL condemned the term without naming him. Kansas Jewish leaders were less shy.',
    ],
    sources: [
      {
        label: 'Acyn: the full “Shylock type guy” clip',
        url: 'https://x.com/Acyn/status/2112342320339439718',
      },
      {
        label: 'NBC News: Trump uses antisemitic slur defending Roger Marshall',
        url: 'https://www.nbcnews.com/politics/donald-trump/president-uses-antisemitic-slur-defending-roger-marshall-kansas-rally-rcna604497',
      },
      {
        label: 'KCUR: Trump used antisemitic slur while defending Marshall’s lawsuits against patients',
        url: 'https://www.kcur.org/politics-elections-and-government/2026-10-20/trump-used-antisemitic-slur-in-kansas-while-defending-marshalls-lawsuits-against-patients',
      },
      {
        label: 'The Guardian: ADL condemns the slur but doesn’t name Trump',
        url: 'https://www.theguardian.com/us-news/2026/oct/20/trump-kansas-rally-antisemitic-slur-anti-defamation-league',
      },
      {
        label: 'New York Magazine: Trump drops antisemitic slur at Kansas rally',
        url: 'https://nymag.com/intelligencer/article/trump-antisemitic-slur-shylock-kansas-rally.html',
      },
      {
        label: 'The New York Times: Roger Marshall sued 700 patients for debts; 81 were arrested',
        url: 'https://www.nytimes.com/2026/09/08/us/politics/roger-marshall-obgyn-doctor-debts.html',
      },
      {
        label: 'Kansas City Star: Marshall charged 18% on medical bills',
        url: 'https://www.kansascity.com/news/politics-government/article317557935.html',
      },
      {
        label: 'KWCH: Jewish community responds after Trump uses slur at Wichita rally',
        url: 'https://www.kwch.com/2026/10/21/jewish-community-responds-after-president-trump-uses-antisemitic-slur-wichita-rally/',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'wh-youtube-trump-tv',
    ogKicker: 'Press pool watch',
    ogPunch: 'Trump TV',
    ogStamp: 'ON TAPE',
    title: 'He banned the pool, then launched Trump TV on YouTube',
    category: 'REPORTS',
    date: '2026-09-24',
    dek: 'Kick the cameras out, flip on Channel 47, call it “unfiltered.” Same week. Same White House. Same taxpayer YouTube account.',
    body: [
      'The joke writes itself, and then the White House streams it in 24/7 stereo.',
      'Mid-September, Trump accused CNN, MS NOW, and Politico of “reporting FAKE NEWS,” then the White House took their access and their press passes. Two days later — no apology tour, no cooling-off period — the same White House flipped on a round-the-clock YouTube livestream called TRUMP TV: The Essentials Station.',
      'Kick the reporters out. Cue the victory reel. Brand it “unfiltered.”',
      'Official copy pitched “top past moments, announcements, and the latest and greatest from the Administration all in one place.” Then came the quiet confession that doubles as a mission statement: “Not every big moment has made it on your tv, now it can.” Translation: if cable won’t play the cut you like, put it on Channel 47 yourself.',
      'And yes, they numbered it like cable. On the White House Live page it sits as CH 47 · Trump TV 24/7, right next to CH 45 · White House Live and a White House Wire ticker. A presidency with its own channel lineup. On the government’s YouTube. On your dime.',
      'The stream lives on the official White House channel. The launch video was titled, with zero shame, “Trump TV is Here.”',
      'Kaelan Dorr, the White House’s head of digital strategy, put the product brief in plain English. Trump TV would show “the Administration’s greatest hits, unfiltered,” he said, because the press had “reported inaccurately or not at all on the Administration’s many record breaking accomplishments…” Greatest hits. Unfiltered. Government final cut. If that sounds like a state playlist with better lighting, that’s because it is.',
      'The same Monday the stream went live, ABC, CBS, NBC, Fox News, and CNN suspended presidential TV pool coverage after CNN was blocked from finishing scheduled pool duty. Their joint line was blunt: “No Administration should restrict a news organization because it objects to its reporting.” The White House’s answer was not a press conference. It was a playlist.',
      'Then came the visual that needed no talking points. At a White House helipad ribbon-cutting, Marine One drowned out Trump’s remarks on the official feed. There was no microphone, because the pool cameras weren’t there. When the independent mics leave, the soundtrack is rotor wash and whatever the house feed decides counts as news.',
      'None of this fell out of the sky. Last year the White House launched White House Wire — a Drudge-style aggregator pitched as “real news” that just happened to favor the agenda. Reporting later found YouTube was Wire’s top linkout destination, and nearly all those links pointed straight back at the White House’s own channel. Trump TV doesn’t invent the content mill. It fires the middleman and loops the victory reel forever.',
      'What’s actually on it? Curated past speeches. Executive-action victory laps. Some live events. While Trump addressed the UN General Assembly, Trump TV was reportedly replaying an earlier National Prayer Breakfast speech. Early live viewership sat around 1,500 people, despite millions of channel subscribers. Critics reached for the blunt phrase the same week: literally state-run TV. State media built for YouTube. You don’t need a cable license when a `.gov` page and a free upload button do the distribution.',
      'So no — this is not a boring livestream upgrade. It is a same-week trade. Boot the independent cameras. Sell the country a 24/7 greatest-hits channel. Stamp it CH 47 like one man’s presidency finally got its own cable number. “Unfiltered” was never the point. Unopposed was.',
    ],
    sources: [
      {
        label: 'PRIMARY EMBED — TRUMP TV 24/7',
        url: 'https://www.youtube.com/watch?v=A4gNgHfZ-v4',
      },
      {
        label: 'White House Live (CH 45 / CH 47 / Wire)',
        url: 'https://www.whitehouse.gov/live/',
      },
      {
        label: 'Official White House YouTube channel',
        url: 'https://www.youtube.com/@whitehouse',
      },
      {
        label: '“Trump TV is Here”',
        url: 'https://www.whitehouse.gov/videos/trump-tv-is-here/',
      },
      {
        label: 'White House Wire',
        url: 'https://www.whitehouse.gov/wire/',
      },
      {
        label: '2026 White House staff report — Dorr title/salary',
        url: 'https://www.whitehouse.gov/wp-content/uploads/2026/07/2026-Annual-Report-to-Congress-on-White-House-Staff.pdf',
      },
      {
        label: 'Reuters — CNN / MS NOW / Politico shutout, 19 Sep 2026',
        url: 'https://www.reuters.com/world/white-house-turns-away-cnn-ms-now-politico-reporters-after-trump-announces-ban-2026-09-19/',
      },
      {
        label: 'TIME — Trump TV / pool ban / state-run criticism, 22 Sep 2026',
        url: 'https://time.com/article/2026/09/22/trump-tv-white-house-press-pool-ban-boycott-state-media/',
      },
      {
        label: 'The Guardian — “Literally state-run TV,” 22 Sep 2026',
        url: 'https://www.theguardian.com/us-news/2026/sep/22/trump-launches-youtube-channel-amid-boycott-by-us-networks/',
      },
      {
        label: 'Axios — what’s on Trump TV, 22 Sep 2026',
        url: 'https://www.axios.com/2026/09/22/trump-trumptv-white-house-live-news-network',
      },
      {
        label: 'Axios — Wire launch, 30 Apr 2025',
        url: 'https://www.axios.com/2025/04/30/trump-white-house-drudge-style-website-launch',
      },
      {
        label: 'The Verge — Wire → WH YouTube, 3 Jul 2025',
        url: 'https://www.theverge.com/politics/698148/white-house-wire-youtube',
      },
      {
        label: 'Streaming Wars — “State Media Built for YouTube”',
        url: 'https://www.thestreamingwars.tv/programming/trump-tv-is-state-media-built-for-youtube/',
      },
      {
        label: 'The Wrap — pool shutout / state-run reactions',
        url: 'https://www.thewrap.com/media-platforms/politics/trump-tv-press-shutout-state-run-media-reactions/',
      },
      {
        label: 'WH remarks upload, 22 Sep 2026',
        url: 'https://www.youtube.com/watch?v=Q5WyknJN3qY',
      },
      {
        label: 'Vance fraud press conference',
        url: 'https://www.youtube.com/watch?v=gwXS24qsEEM',
      },
      {
        label: 'Ballroom construction visit',
        url: 'https://www.youtube.com/watch?v=qQxek3C2Gds',
      },
      {
        label: '“Story of America: Benjamin Franklin”',
        url: 'https://www.youtube.com/watch?v=Ho4Ym6rzfoo',
      },
    ],
    embeds: [
      {
        type: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=A4gNgHfZ-v4',
        title: 'TRUMP TV: The Essentials Station (official WH)',
        afterBodyIndex: 1,
      },
      {
        type: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=Q5WyknJN3qY',
        title: 'White House remarks (Sep 22 2026)',
        afterBodyIndex: 5,
      },
      {
        type: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=gwXS24qsEEM',
        title: 'Vance fraud press conference (WH)',
        afterBodyIndex: 7,
      },
      {
        type: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=qQxek3C2Gds',
        title: 'Ballroom construction visit (WH)',
        afterBodyIndex: 8,
      },
      {
        type: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=Ho4Ym6rzfoo',
        title: 'Story of America: Benjamin Franklin (WH)',
        afterBodyIndex: 10,
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'trump-un-blunders',
    ogKicker: 'UN watch',
    ogPunch: 'teleprompter',
    ogStamp: 'ON TAPE',
    title:
      'UNGA’s greatest hits: the laugh track, the broken teleprompter, and seven wars that weren’t',
    category: 'REPORTS',
    date: '2026-09-24',
    dek: 'The room laughed at his 2018 boast. In 2025 he opened with “whoever’s operating this teleprompter is in big trouble.” Trump’s UN podium never misses, and the fact-checkers keep the receipts.',
    body: [
      'Most speakers need a fact-checker. Trump’s UN audience brought its own.',
      'Start with 2018. At the General Assembly, Trump told the room his administration had “accomplished more than almost any administration in the history of our country.”',
      'The room laughed. Out loud. A hall full of world leaders.',
      'His recovery: “I didn’t expect that reaction, but that’s OK.” Reader, the tape is still funny.',
      'The year before, he’d set the tone from the same podium. He vowed the U.S. would “totally destroy” North Korea if forced to defend itself, and christened Kim Jong Un “Rocket Man.” Diplomacy, now with nicknames.',
      'Then came 2025, the slapstick upgrade. He opened by announcing the teleprompter wasn’t working and that “whoever’s operating this teleprompter is in big trouble.” Laughter again. Later he joked that the UN had handed him “a bad escalator and a bad teleprompter.”',
      'About that escalator. That same day, he and Melania were riding it when it stopped. The UN said a safety mechanism kicked in, and spokesperson Stéphane Dujarric said a U.S.-delegation videographer filming backward “may have inadvertently triggered the safety function.”',
      'And the teleprompter? A UN official told the BBC the White House was running it, on its own laptops plugged into the UN system.',
      'So his own crew may have tripped the escalator, his own crew was running the prompter, and the UN took the blame for both. Even the architecture is deep state now.',
      'Then the main event: “I have ended seven unendable wars.” His list was Cambodia–Thailand, Kosovo–Serbia, Congo–Rwanda, Pakistan–India, Israel–Iran, Egypt–Ethiopia and Armenia–Azerbaijan.',
      'PolitiFact rated it Mostly False. Some of those ceasefires did have a U.S. role. Egypt–Ethiopia wasn’t a war. The Kosovo–Serbia claim was thin. The violence between Congo and Rwanda kept going. And India disputes that he gets any credit for mediating.',
      'CNN’s Daniel Dale and AP’s fact-checkers flagged the claim too. Pitching “seven unendable wars” to the one room that keeps the casualty counts takes a certain kind of confidence.',
      'For dessert, PBS caught two more lines. Countries with uncontrolled migration are “going to hell.” And climate change is “the greatest con job ever perpetrated on the world.”',
      'You don’t need to edit any of this. Run the 2018 laugh, cut to the “big trouble” teleprompter line, then cut to the UN explaining that his own videographer stopped the escalator. Three beats, zero invented dialogue. The tape does the roasting.',
    ],
    sources: [
      {
        label: 'AP — Trump’s boast gets a laugh at the UN (2018 video)',
        url: 'https://www.youtube.com/watch?v=-z4y8OJxlK8',
      },
      {
        label: 'UN Web TV — the full 2025 UNGA speech',
        url: 'https://webtv.un.org/en/asset/k19/k1952w5l08',
      },
      {
        label: 'ABC — the full 2025 UNGA speech (video)',
        url: 'https://www.youtube.com/watch?v=RLoxCqc3Tro',
      },
      {
        label: 'State Department — 2025 UNGA remarks (video)',
        url: 'https://www.youtube.com/watch?v=lw9foqNRpyE',
      },
      {
        label: 'NBC — the teleprompter malfunction clip',
        url: 'https://www.nbcnews.com/video/trump-s-teleprompter-malfunctions-during-united-nations-speech-248154181727',
      },
      {
        label: 'State Department — the 2017 “Rocket Man” address (video)',
        url: 'https://www.youtube.com/watch?v=AyttM9EnObc',
      },
      {
        label: 'White House — Trump’s 2025 remarks to the UN General Assembly',
        url: 'https://www.whitehouse.gov/videos/president-trump-delivers-remarks-to-the-united-nations-general-assembly/',
      },
      {
        label: 'BBC — the escalator and the teleprompter',
        url: 'https://www.bbc.com/news/articles/cn76kyxp6epo',
      },
      {
        label: 'The Guardian — the 2018 UNGA speech',
        url: 'https://www.theguardian.com/us-news/2018/sep/25/trump-united-nations-general-assembly-speech-globalism-america',
      },
      {
        label: 'UN AV Library — 2018 package',
        url: 'https://media.un.org/avlibrary/en/asset/d224/d2243857',
      },
      {
        label: 'Reuters — “totally destroy” North Korea, 2017',
        url: 'https://www.reuters.com/article/world/if-threatened-us-will-totally-destroy-north-korea-trump-vows-idUSKCN1BU0B3/',
      },
      {
        label: 'PBS — 7 key moments from Trump’s 2025 UN speech',
        url: 'https://www.pbs.org/newshour/politics/7-key-moments-from-trumps-u-n-speech',
      },
      {
        label: 'CNN — Daniel Dale fact-checks the UN speech',
        url: 'https://www.cnn.com/2025/09/23/politics/fact-check-un-speech-claims-trump',
      },
      {
        label: 'PolitiFact — “ended seven wars” rated Mostly False',
        url: 'https://www.politifact.com/factchecks/2025/sep/23/donald-trump/trump-ended-seven-wars-un-general-assembly/',
      },
      {
        label: 'PolitiFact — the UN speech, claim by claim',
        url: 'https://www.politifact.com/article/2025/sep/23/trump-un-general-assembly-speech/',
      },
      {
        label: 'AP Fact Focus — the seven wars claim',
        url: 'https://apnews.com/article/trump-peace-wars-claim-fact-check-10128b26232e1d1eb9e68c5617320cf3',
      },
    ],
    embeds: [
      {
        type: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=-z4y8OJxlK8',
        title: 'AP — Trump boast gets laugh at UN (2018)',
        caption: 'The room laughs, 2018.',
        afterBodyIndex: 2,
      },
      {
        type: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=AyttM9EnObc',
        title: 'State Dept — full 2017 UNGA address (Rocket Man)',
        caption: 'The 2017 address, in full.',
        afterBodyIndex: 4,
      },
      {
        type: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=RLoxCqc3Tro',
        title: 'ABC — full 2025 UNGA speech',
        caption: 'The 2025 speech, teleprompter open.',
        afterBodyIndex: 5,
      },
      {
        type: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=lw9foqNRpyE',
        title: 'State Dept — 2025 UNGA remarks',
        caption: 'The 2025 remarks, State Department upload.',
        afterBodyIndex: 5,
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'truth-social-save-america-act-photo-id',
    ogKicker: 'Voting watch',
    ogPunch: 'choke',
    ogStamp: 'IN WRITING',
    title:
      'Two lines, one midterm choke: photo ID + proof of citizenship',
    category: 'REPORTS',
    date: '2026-09-14',
    dek: 'Labor Day morning, Trump boiled the SAVE America Act down to an all-caps checklist, photo ID and proof of citizenship for every voter, while the Senate still won’t hand him the bill and the midterms close in.',
    body: [
      'Some people spend Labor Day at a barbecue. Trump spent it writing election law in two bullet points.',
      'Monday morning, all caps: “THE SAVE AMERICA ACT: 1. ALL VOTERS MUST SHOW PHOTO I.D. (IDENTIFICATION!). 2. ALL VOTERS MUST SHOW PROOF OF CITIZENSHIP.”',
      'That “(IDENTIFICATION!)” is doing a lot of work for anyone unsure what I.D. stands for.',
      'A quick sorting note, because the names are built to blur. This is not the DHS SAVE database, the blocked citizenship-check system the Justice Department is begging the Supreme Court to revive. That’s a separate file. This is the SAVE America Act, an actual bill: photo ID at the polls, proof of citizenship at the registration desk.',
      'The House moved it. The Senate, AP reports, has left it parked despite Trump’s demands, with no clear way past the filibuster before the November 3 election.',
      'So he did what you do when Congress won’t give you a bill. He posted it louder.',
      'The real knife is proof of citizenship. That means passports and birth certificates, and AP notes that plenty of state driver’s licenses don’t count.',
      'The Brennan Center estimates about 21.3 million voting-age citizens don’t have that paperwork readily available.',
      'Twenty-one million citizens. Two bullet points. Neither one mentions them.',
      'Same election-control stack, different weapon. The Act is the statute choke. The database is the executive purge tool. Labor Day just got the short version.',
    ],
    sources: [
      {
        label: 'Truth Social — the SAVE America Act post, 7 Sep 2026',
        url: 'https://truthsocial.com/@realDonaldTrump/117230085361299862',
      },
      {
        label: 'Trump’s Truth archive — the post',
        url: 'https://www.trumpstruth.org/statuses/41595',
      },
      {
        label: 'American Presidency Project — Truth Social posts of 7 Sep 2026',
        url: 'https://www.presidency.ucsb.edu/documents/truth-social-posts-september-7-2026',
      },
      {
        label: 'AP — the voting bill stalls in the Senate',
        url: 'https://apnews.com/article/voting-bill-citizenship-senate-thune-trump-3709f2bd02d2c841e16d501529ec9198',
      },
      {
        label: 'AP — Trump, the midterms and proof of citizenship',
        url: 'https://apnews.com/article/voting-trump-midterms-citizenship-republican-senate-d4acd3468c410a8842a0fe3e3b9cda57',
      },
      {
        label: 'AP Fact Check — what ID the SAVE Act would require',
        url: 'https://apnews.com/article/fact-check-save-act-identification-register-vote-d11d41b59f943bb72bcdca2d781293b7',
      },
      {
        label: 'Brennan Center — 21.3 million citizens without ready proof',
        url: 'https://www.brennancenter.org/our-work/analysis-opinion/213-million-american-citizens-voting-age-dont-have-ready-access',
      },
      {
        label: 'Related file — the DOJ’s Supreme Court push for the DHS SAVE database (not the Act)',
        url: 'https://thedonaldfiles.com/reports/doj-scotus-save-voter-verification/',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'truth-social-white-house-dump-ballroom',
    ogKicker: 'Ballroom watch',
    ogPunch: 'dump',
    ogStamp: 'IN WRITING',
    title:
      'He called the White House a “dump,” then sold the ballroom as a free gift again',
    category: 'REPORTS',
    date: '2026-09-14',
    dek: 'One Sunday: the people’s house is a dump, the ballroom is a gift, and the taxpayer is apparently imaginary.',
    body: [
      'First he trashes the mansion. Then he invoices you for the glow-up and calls it philanthropy.',
      'One Sunday in mid-September, Donald Trump took to Truth Social and declared the White House a “dump.” Very bad condition, he said — inside and out. Past presidents “did not take care of it.” The exterior “skin” was “practically falling off.” And somehow, under his watch, it is now “in better shape than when built in 1792.” He attached before-and-after column photos, like the people’s house had wandered onto HGTV with better security. Even Fox News carried the “dump” line.',
      'That was the evening set. The afternoon had already been a gift shop.',
      'Earlier the same day he was selling the East Wing ballroom as a patriotic freebie. The “Spectacular Ballroom,” he wrote, is a “Gift to the U.S.A. from me and other American Patriots.” “No Taxpayer Dollars will be expended in its Construction.” Hours later he was back with “First interior renderings,” plus the classic one-two: “Massively expensive, but free of charge to the American Taxpayer.” Also “On budget, and ahead of schedule.” Of course it is.',
      'Dump by nightfall. Gift receipt all afternoon. Same account. Same day. The man’s renovation pitch is basically: this place is a wreck, luckily I’m the hero, and also please ignore the receipt.',
      'Because the “no taxpayer dollars” chorus does not survive contact with the paperwork. Washington Post reporting on Clark Construction records put the project around $600 million, with roughly half tagged to taxpayer-funded accounts — Secret Service, White House Military Office, Executive Residence. The Supreme Court has temporarily let construction keep rolling while the National Trust fight grinds on. So the Truth Social version is gilt fantasy and a gift bow. The real plot is lawsuits, scaffolding, and a tab that somehow still finds its way back to you.',
      'This is the two-step. Call the people’s house a dump only you can save. Rebrand East Wing demolition as charity. Post the renderings like a wedding venue brochure. Leave the funding fight off the caption.',
      'Gift receipt optional. Half paid by you.',
    ],
    sources: [
      {
        label: 'Truth Social — “dump” post, 13 Sep 2026 9:03 PM EDT',
        url: 'https://truthsocial.com/@realDonaldTrump/117266699812092755',
      },
      {
        label: 'Trump’s Truth archive — dump post',
        url: 'https://www.trumpstruth.org/statuses/41711',
      },
      {
        label: 'Truth Social — ballroom “Gift” / no taxpayer dollars, 3:32 PM EDT',
        url: 'https://truthsocial.com/@realDonaldTrump/117265397440548141',
      },
      {
        label: 'Trump’s Truth archive — gift post',
        url: 'https://www.trumpstruth.org/statuses/41702',
      },
      {
        label: 'Truth Social — interior renderings / “free of charge,” 7:52 PM EDT',
        url: 'https://truthsocial.com/@realDonaldTrump/117266420132610360',
      },
      {
        label: 'Trump’s Truth archive — renderings post',
        url: 'https://www.trumpstruth.org/statuses/41707',
      },
      {
        label: 'Washington Post — Clark Construction ~$600M / taxpayer share, 16 Jun 2026',
        url: 'https://www.washingtonpost.com/investigations/2026/06/16/records-reveal-600m-estimate-trumps-ballroom-project-with-half-taxpayers/',
      },
      {
        label: 'Reuters — SCOTUS admin stay on ballroom, 21 Aug 2026',
        url: 'https://www.reuters.com/world/supreme-court-lets-trump-continue-work-white-house-ballroom-now-2026-08-21/',
      },
      {
        label: 'Fox News — “dump” / renovations coverage',
        url: 'https://www.foxnews.com/politics/trump-touts-white-house-renovations-says-building-very-bad-condition',
      },
    ],
    published: true,
    proseArticle: true,
  },
  {
    slug: 'truth-social-caracas-maduro-fafo',
    ogKicker: 'Venezuela watch',
    ogPunch: 'flex',
    ogStamp: 'ON TAPE',
    title:
      'On 9/11 night he dropped a Caracas flex reel: “effed around, and he found out”',
    category: 'REPORTS',
    date: '2026-09-14',
    dek: 'Months after U.S. forces hauled Nicolás Maduro out of Venezuela, Trump marked the 9/11 anniversary with a highlight reel of the raid, billed as one of the “most stunning” displays of American military might ever, and pitched it as a warning to everyone else.',
    body: [
      'Nothing says “never forget” like a highlight reel of a completely different operation.',
      'Late on the night of September 11, Trump posted a video. Not about the towers. About Caracas.',
      'According to the Trump’s Truth archive transcript, part of the clip is strictly by-the-book. U.S. forces ran an “apprehension mission in Caracas, Venezuela to bring to justice 2 indicted persons, Nicolas and Cecilia Maduro.” Very procedural. Very warrant-shaped.',
      'Then comes the locker-room part. Maduro “had his chance until he didn’t.” He “effed around, and he found out.”',
      'And the operation itself? Among the “most stunning, effective, and powerful displays of American military might and competence in American history.” Modest, as always.',
      'Small detail. This isn’t news. The raid happened on January 3. Eight months later it’s back as a rerun, dropped on the 9/11 anniversary with a midterm-season soundtrack.',
      'The message isn’t subtle. We can snatch a sitting leader, so adjust accordingly. Deterrence theater, Truth Social edition.',
      'Meanwhile the star of the reel is sitting in Brooklyn, claiming immunity and asking a U.S. judge to throw out the charges.',
      'So the case is still in court, and the walkout music is already playing. He’s selling the extraction like a UFC entrance before the judges have even scored the fight.',
    ],
    sources: [
      {
        label: 'Truth Social — the Caracas video post, 11 Sep 2026',
        url: 'https://truthsocial.com/@realDonaldTrump/117255916246451243',
      },
      {
        label: 'Trump’s Truth archive — post and transcript',
        url: 'https://www.trumpstruth.org/statuses/41697',
      },
      {
        label: 'AP — the Maduro raid in Venezuela',
        url: 'https://apnews.com/article/trump-maduro-venezuela-presidential-palace-blowtorches-7969152ae48510003fe9cbde92f3c102',
      },
      {
        label: 'Reuters — Maduro claims immunity, asks judge to toss charges, 2 Sep 2026',
        url: 'https://www.reuters.com/world/americas/venezuelas-maduro-asserts-immunity-urges-us-judge-dismiss-charges-2026-09-02/',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'truth-social-dallas-beat-nfl',
    ogKicker: 'Ratings watch',
    ogPunch: 'NFL',
    ogStamp: 'IN WRITING',
    title:
      'He declared Dallas “beat the NFL” before the ratings even existed',
    category: 'REPORTS',
    date: '2026-09-14',
    dek: 'Night one of the midterm convention was a “sold out hit” that “beat the NFL,” he announced, before Nielsen had a single number and while reporters were counting empty upper-deck seats.',
    body: [
      'The scoreboard wasn’t even switched on. He’d already called the game.',
      'Before 8 a.m. the morning after night one of the Republican midterm convention in Dallas, Trump was on Truth Social with the review. A “major, sold out hit.” “Far bigger, better, and more important than anyone thought possible.” Streaming “all over the place.” “Really big numbers.”',
      'Then the headline act. The convention had gone up against the NFL, and “the overall numbers beat the NFL.”',
      'Which numbers? Great question. Nielsen hadn’t released any. Mediaite pointed out that nobody could say what “overall numbers” even meant, because the ratings weren’t in. For scale, last year’s NFL opener drew roughly 28 million viewers.',
      'But why wait for data when you have vibes and a phone?',
      'He kept going. The arena “was really nice” and “beat its own attendance records.” “The place was packed!” Thousands of people stuck outside “who couldn’t get in.” “Screens were provided.”',
      'Meanwhile the Wall Street Journal was looking at the actual building and spotted empty seats in the upper deck. Packed, apparently, is a state of mind.',
      'He wrapped with the thesis, “I guess people LOVE TRUMP POLITICS!”, promised to be back that night “to close out the show,” and filed the whole thing under “Exciting “Stuff!”” The scare quotes on Stuff are his. We couldn’t improve on them.',
      'Declare victory first. Let the numbers catch up never. That’s not a ratings report. That’s a press release in a foam finger.',
    ],
    sources: [
      {
        label: 'Truth Social — the “beat the NFL” post, 10 Sep 2026',
        url: 'https://truthsocial.com/@realDonaldTrump/117246607022445743',
      },
      {
        label: 'Trump’s Truth archive — the post',
        url: 'https://www.trumpstruth.org/statuses/41664',
      },
      {
        label: 'American Presidency Project — Truth Social posts of 10 Sep 2026',
        url: 'https://www.presidency.ucsb.edu/documents/truth-social-posts-september-10-2026',
      },
      {
        label: 'Mediaite — Trump claims convention ratings beat the NFL',
        url: 'https://www.mediaite.com/media/news/trump-claims-midterm-convention-ratings-beat-nfl-i-guess-people-love-trump-politics/',
      },
      {
        label: 'Wall Street Journal — empty seats and NFL competition',
        url: 'https://www.wsj.com/livecoverage/trump-vance-midterm-elections-2026-rnc/card/trump-raves-about-rnc-night-one-despite-empty-seats-and-nfl-competition-IkslVQ2STUepOXNq4KUb',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'truth-social-reflecting-pool-vandalism-primer',
    ogKicker: 'Reflecting Pool watch',
    ogPunch: 'primer',
    ogStamp: 'RECEIPTS',
    title:
      'On 9/11 weekend he boosted a vandalism yarn while the contractor paperwork points at botched primer',
    category: 'REPORTS',
    date: '2026-09-14',
    dek: 'He reshared a tale of “342 feet of razor blade slashes” and “8647” graffiti. The contractor’s own paperwork blames bad primer and incompatible chemistry. Guess which one he boosted.',
    body: [
      'The Reflecting Pool is empty. The excuse tank is full.',
      'Shortly after 5 a.m. on the Sunday after the 9/11 anniversary, Trump hit reshare on an account called U.S. Interior Press. Nothing healthy has ever happened on a phone at 5 a.m.',
      'The post went after the New York Times for running a Reflecting Pool story on the 25th anniversary of 9/11, and accused the paper of continuing “to avoid doing any real reporting on all the vandalism.”',
      'Then it opened the evidence locker. 342 feet of razor blade slashes. “8647” spray-painted in massive lettering. And then the preview cut off, because even the case file couldn’t finish the sentence.',
      'It’s the house plot. Vandals did it, the media buried it, and only one man was brave enough to press reshare.',
      'The paperwork tells a less cinematic story. Reporting on the contractor’s documents says Atlantic Industrial Coatings’ own findings point at not enough primer, chemically incompatible layers, and a coating that blistered and peeled in the heat.',
      'Not exactly a heist movie.',
      'And the vandalism case? The Justice Department dropped it after acknowledging the renovation work was flawed. That’s not the media ignoring the crime. That’s the government admitting the crime scene was a paint job.',
      'So the villain isn’t a guy with a box cutter. It’s chemistry. Bad primer just doesn’t trend.',
      'He boosted the slash-and-spray version anyway. Pick your reality: forensic liner chemistry, or a pre-dawn rage reshare.',
    ],
    sources: [
      {
        label: 'Truth Social — Interior Press reshare, 13 Sep 2026',
        url: 'https://truthsocial.com/@realDonaldTrump/117262936693023151',
      },
      {
        label: 'Truth Social — companion post, 13 Sep 2026',
        url: 'https://truthsocial.com/@realDonaldTrump/117262935739176527',
      },
      {
        label: 'Trump’s Truth archive — the reshare',
        url: 'https://www.trumpstruth.org/statuses/41700',
      },
      {
        label: 'Newsweek — Trump hits back at the NYT over the Reflecting Pool',
        url: 'https://www.newsweek.com/trump-hits-back-at-new-york-times-over-reflecting-pool-story-on-9-11-12436224',
      },
      {
        label: 'WTOP — contractor says it’s the primer, not vandalism',
        url: 'https://wtop.com/dc/2026/09/report-company-that-renovated-lincoln-memorial-reflecting-pool-says-issue-is-with-primer-not-vandalism/',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'truth-social-colossus-smithsonian-washington',
    ogKicker: 'Smithsonian watch',
    ogPunch: 'Colossus',
    ogStamp: 'IN WRITING',
    title:
      'He wants a 30-foot Washington “Colossus” and a culture war at the Smithsonian',
    category: 'REPORTS',
    date: '2026-09-14',
    dek: 'On 9/11 night he skipped the reflection and went straight to museum procurement: dump the “Infinity” sculpture, raise a giant George Washington, and rebrand history’s hard chapters as a “Center for American Heroes.”',
    body: [
      'Most people spend the night of September 11 remembering. Trump spent it art-directing the Smithsonian.',
      'Late on the 25th anniversary, he posted, then reshared, a to-do list for the nation’s museum. It reads like a man who has never once been asked to fill out a loan form for a painting.',
      'Item one: a five-year George Washington exhibition at the National Museum of American History, running into 2032. Five years. For a museum show. Some marriages don’t last that long.',
      'Item two: a 30-foot “Colossus statue” outside the museum. The current “Infinity” sculpture would have to go. Infinity, it turns out, has an end date.',
      'Item three: an 11-foot Washington from something called the “Freedom 250 Grand Prix,” parked inside Flag Hall by Constitution Day. That was six days away. Museums famously love a rush job.',
      'Item four: retire the “Center for Restorative History” and “Decolonization Plan” framing and swap in a “Center for American Heroes.” Hard chapters out. Hall of fame in.',
      'Then came the grievance. He went after an exhibit that calls 1492 to 1776 the “Great Unsettling,” and claimed Washington’s crossing of the Delaware “is not even mentioned.” The man is personally offended on behalf of a boat.',
      'And the sign-off, the one that reads like a hotel front-desk receipt: “Thank you for your attention to this matter!”',
      'This isn’t a guy who loves museums. It’s a culture-war memo, dropped on the 9/11 anniversary in the run-up to the country’s 250th, written as if the Smithsonian were a rally stage that forgot to book him.',
      'Personal brand first. Institutions second. History as a loyalty test.',
      'And the statue just has to be thirty feet. Nobody’s compensating for anything.',
    ],
    sources: [
      {
        label: 'Truth Social — the Smithsonian / “Colossus” post, 11 Sep 2026',
        url: 'https://truthsocial.com/@realDonaldTrump/117255718355537976',
      },
      {
        label: 'Truth Social — companion reshare, 11 Sep 2026',
        url: 'https://truthsocial.com/@realDonaldTrump/117255720319253709',
      },
      {
        label: 'American Presidency Project — Truth Social posts of 11 Sep 2026',
        url: 'https://www.presidency.ucsb.edu/documents/truth-social-posts-september-11-2026',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'truth-social-trump-dividend-5000-double-down',
    ogKicker: 'Midterm bribe watch',
    ogPunch: 'bribe',
    ogStamp: 'IN WRITING',
    title: 'He doubled down on the $5,000 midterm bribe on his own app',
    category: 'REPORTS',
    date: '2026-09-14',
    dek: 'Two days after Dallas, Trump swore the “Trump Dividend” will happen, called the doubters “Dumocrats,” and ended with the actual ask: VOTE REPUBLICAN.',
    body: [
      'He promised it at the convention. Then, in case anyone thought it was a bit, he promised it again on his own app.',
      'Two days after Dallas, on the afternoon of September 11, Trump announced that “The $5,000 Trump Dividend, given to all Adults in the United States,” is coming, because the country is “taking in Trillions of Dollars of Economic Development, Investment, and Pure SUCCESS.”',
      'Pure SUCCESS. Capitalized. Like a line item.',
      'The critics, he said, are “Dumocrats” who hope it never happens. His answer: “But it will!”',
      'His proof was a list of other things people said couldn’t be done. “THE GREAT BIG BEAUTIFUL BILL.” The “Gift of $1776” to the military last year, which “our Military Patriots got the money, and loved it.”',
      'Then the closer: “When I say something, I mean it!” The dividend “will happen because the People of our Country deserve it.”',
      'And so nobody missed the terms of the deal: “VOTE REPUBLICAN — MAKE AMERICA GREAT AGAIN!”',
      'No mechanics. No bill text. No funding line. Just a midterm IOU in all-caps energy, aimed at the base.',
      'The wire services had already done the math. Reuters put the price north of $1 trillion and noted Congress would likely have to sign off. That’s the skepticism. His rebuttal was an exclamation point.',
      'This isn’t a policy. It’s a cash promise that depends on your vote, posted after the arena lights went down. The convention pledge, mask off.',
    ],
    sources: [
      {
        label: 'Truth Social — the “$5,000 Trump Dividend” post, 11 Sep 2026',
        url: 'https://truthsocial.com/@realDonaldTrump/117253978301857789',
      },
      {
        label: 'American Presidency Project — Truth Social posts of 11 Sep 2026',
        url: 'https://www.presidency.ucsb.edu/documents/truth-social-posts-september-11-2026',
      },
      {
        label: 'Reuters — the $5,000 payout, its cost and Congress, 10 Sep 2026',
        url: 'https://www.reuters.com/world/us/trump-touts-5000-payout-if-republicans-win-vance-waits-wings-2026-09-10/',
      },
      {
        label: 'Related file — the original Dallas $5,000 pledge',
        url: 'https://thedonaldfiles.com/reports/trump-dividend-5000-gop-congress/',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'iran-war-midterms-pickaxe-mountain',
    ogKicker: 'Iran war watch',
    ogPunch: 'Pickaxe',
    ogStamp: 'FILED',
    title:
      'Trump ties endless Iran war to the midterms, threatens Pickaxe Mountain again',
    category: 'REPORTS',
    date: '2026-09-10',
    dek: 'Six months in, Trump says the Iran war ends after November, which is to say after you’ve voted, and threatens Pickaxe Mountain again.',
    body: [
      'Six months into a war he sold as a quick hit, Trump has a new timeline for voters. The Iran fight ends after November.',
      'Conveniently, that’s right after the ballots are in.',
      'His case to reporters: Tehran “can’t hold out any longer” and is “desperate to try and affect the election.” Iran, apparently, is the one playing midterm politics here.',
      'At the GOP’s midterm convention, he also spotted “a little activity at Pickaxe,” the buried nuclear-linked site he’s been threatening since mid-July. Iran was warned not to “get cute” or it gets hit “very hard.”',
      'Nothing calms oil markets like a convention-stage threat.',
      'Meanwhile, back in reality, Reuters reports that shipping attacks are back, Brent crude is parked above $100, and the Houthis are muscling toward the Bab el-Mandeb.',
      'The war plus the gas prices have dragged Trump’s popularity to record lows. Turns out “quick hit” polls badly at month six.',
      'One more thing is floating around. A Wall Street Journal report says top aides privately fear this drags on through January 2029. Reuters says it couldn’t verify that, so it stays a rumor until someone documents it.',
      'Even the rumor comes with a receipt.',
    ],
    sources: [
      {
        label: 'Reuters — the war ends after the midterms, plus the Pickaxe threat, 10 Sep 2026',
        url: 'https://www.reuters.com/world/middle-east/trump-says-iran-war-end-after-us-midterm-elections-threatens-attack-pickaxe-2026-09-10/',
      },
      {
        label: 'Reuters — “activity” at Pickaxe Mountain, don’t “get cute,” 10 Sep 2026',
        url: 'https://www.reuters.com/world/trump-says-activity-seen-irans-pickaxe-mountain-urges-tehran-not-get-cute-2026-09-10/',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'doj-scotus-save-voter-verification',
    ogKicker: 'Supreme Court watch',
    ogPunch: 'voter-purge',
    ogStamp: 'FILED',
    title: 'DOJ begs the Supreme Court to revive its blocked voter-purge database',
    category: 'REPORTS',
    date: '2026-09-08',
    dek: 'Two months before the midterms, the Trump DOJ wants the Supreme Court to unfreeze a citizenship-check system that a federal judge already called a mess.',
    body: [
      'Two months before the midterms, the Trump Justice Department has a request for the Supreme Court. Please unfreeze the citizenship-check system a federal judge already called a mess.',
      'Nothing says “election integrity” like bulk Social Security lookups and a real risk of wrongful purges.',
      'DOJ lawyers called Judge Sparkle Sooknanan’s June block “indefensible.” Their complaint is that it stops them feeding states citizenship hits from a revamped DHS SAVE database.',
      'Their own filing admits the May 2025 upgrade added Social Security numbers and bulk search. That’s a confession filed as a brief.',
      'The D.C. Circuit refused a stay on September 4. So now it’s Supreme Court cosplay.',
      'Sooknanan’s court found the rebuild haphazard and its citizenship data unreliable. Rights groups say eligible voters, often naturalized citizens, get wrongly flagged as noncitizens and bounced off the rolls.',
      'Democracy Forward’s Skye Perryman says the courts keep rejecting an “unlawful system” that runs over both privacy and the right to vote.',
      'And in the same push, DOJ wants a blocked Postal Service mail-ballot rule revived too. You don’t need pattern recognition here, but it helps.',
    ],
    sources: [
      {
        label: 'Reuters — Trump asks the Supreme Court to allow the blocked voter database, 8 Sep 2026',
        url: 'https://www.reuters.com/legal/government/trump-asks-supreme-court-allow-voter-verification-database-blocked-by-judge-2026-09-08/',
      },
      {
        label: 'Supreme Court — the DHS v. League of Women Voters stay application (PDF), 8 Sep 2026',
        url: 'https://www.supremecourt.gov/DocketPDF/26/26A308/423264/20260908101245314_DHS%20v%20League%20of%20Women%20Voters%20Stay%20Application.pdf',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'trump-dividend-5000-gop-congress',
    ogKicker: 'Midterm watch',
    ogPunch: 'bribe',
    ogStamp: 'RECEIPTS',
    title:
      'Trump’s midterm bribe cosplay: $5,000 “Trump dividend” if the GOP keeps Congress',
    category: 'REPORTS',
    date: '2026-09-10',
    dek: 'At Dallas’s “Trumpapalooza,” Trump offered $5,000 to every adult citizen, payable only if Republicans keep the House and the Senate.',
    body: [
      'At the “Trumpapalooza” midterm convention in Dallas, the president unveiled the most expensive campaign flyer in American history.',
      'The offer: $5,000 for every adult citizen. The fine print: only if Republicans keep the House and the Senate.',
      'In his words, as AP reported it, win both chambers and “I will issue a dividend to every adult citizen in the United States of America for $5,000.”',
      'You’d have to spend it in America, he added. How it would actually work? Not a word.',
      'Reuters ran the calculator for him. About 270 million adults works out to more than $1 trillion. It would likely need Congress, and whether it’s even legal is unclear.',
      'Approval underwater. The Iran war toxic. The cost of living grinding. So sure, promise everyone a yacht voucher and call it economic genius.',
      'Some vulnerable Republicans skipped the show entirely. They had the right idea.',
      'He spent the rest of the night defending the Iran war and his tariffs. Bold strategy: make the midterms all about him while voters are trying to afford gas.',
    ],
    sources: [
      {
        label: 'AP (via WRTV) — Trump promises a $5,000 dividend in his convention speech, 9 Sep 2026',
        url: 'https://www.wrtv.com/news/politics/trump-promises-5000-dividend-to-citizens-during-midterm-convention-speech/',
      },
      {
        label: 'Reuters — the $5,000 payout if Republicans win, 10 Sep 2026',
        url: 'https://www.reuters.com/world/us/trump-touts-5000-payout-if-republicans-win-vance-waits-wings-2026-09-10/',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },

  {
    slug: 'doj-scotus-nevada-us-attorney-chattah',
    ogKicker: 'DOJ watch',
    ogPunch: 'unlawfully',
    ogStamp: 'FILED',
    title:
      'DOJ asks SCOTUS to keep Nevada’s unlawfully parked U.S. attorney',
    category: 'REPORTS',
    date: '2026-09-09',
    dek: 'Three appeals courts called it illegal. The Trump DOJ wants the Supreme Court to bless it anyway: U.S. attorneys parked in office with no Senate confirmation, starting with Nevada’s Sigal Chattah.',
    body: [
      'Three appeals courts have already called this staffing trick illegal. The Trump DOJ is asking the Supreme Court to bless it anyway.',
      'The trick is parking political allies as U.S. attorneys without bothering the Senate for confirmation. Exhibit one is Nevada’s Sigal Chattah.',
      'Solicitor General D. John Sauer argues that the Ninth Circuit’s August smackdown, plus similar losses in the Second and Third Circuits, conflicts with the Federal Vacancies Reform Act.',
      'He warns of “chaos,” and says five Ninth Circuit U.S. attorney’s offices handling more than 8,000 cases a year could be thrown into confusion.',
      'Translation: please let us keep the workaround.',
      'The appeals opinion is blunt. You can’t make someone acting U.S. attorney by calling them “first assistant” to an office that’s already empty. And you can’t invent a de facto acting U.S. attorney by piling every U.S. attorney power onto one person.',
      'It’s the legal version of “new phone, who dis.”',
      'The panel upheld Chattah’s disqualification from three prosecutions. The defendants’ bid to kill their indictments outright got bounced for lack of appellate jurisdiction.',
      'How did she get there? She came in as interim U.S. attorney in late March 2025 under a law with a 120-day clock. As the clock ran out, she was redesignated as first assistant and acting.',
      'Nevada’s federal public defenders sued. The case is United States v. Jackson, and it’s now headed to the justices.',
    ],
    sources: [
      {
        label: 'Reuters — DOJ asks the Supreme Court to keep Chattah in place, 9 Sep 2026',
        url: 'https://www.reuters.com/legal/government/doj-asks-us-supreme-court-allow-trump-ally-remain-nevadas-top-federal-prosecutor-2026-09-09/',
      },
      {
        label: 'Ninth Circuit — United States v. Jackson opinion (PDF), 17 Aug 2026',
        url: 'https://cdn.ca9.uscourts.gov/datastore/opinions/2026/08/17/25-6470.pdf',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },

  {
    slug: 'trump-west-wing-holiday-cash-gifts',
    ogKicker: 'West Wing watch',
    ogPunch: 'cash',
    ogStamp: 'RECEIPTS',
    title: 'Trump gave $45k cash “holiday” gifts to West Wing favorites',
    category: 'REPORTS',
    date: '2026-09-09',
    dek: 'Disclosures show Trump handed three close aides $45,000 each in cash “holiday gifts,” and a fourth $20,000, on top of their federal salaries.',
    body: [
      'Most offices do a Secret Santa with a $20 limit. The West Wing does $45,000 in cash.',
      'Fresh financial disclosures show Trump personally handed $45,000 “holiday gifts” to three close White House aides, and $20,000 to a fourth, on top of their federal salaries. The Washington Post spotted the filings first.',
      'The lucky three: executive assistant Natalie Harp, communications adviser Margo Martin, and Oval Office operations deputy Chamberlain Harris, at $45k each. Oval Office operations director Walt Nauta got $20k.',
      'Their own disclosure forms label the payments “Cash Gift for Holidays.” At least the paperwork is honest.',
      'Harp, Martin and Harris make $150,000 a year. Nauta makes $175,000. So for the trio, the gift is roughly a one-third raise, wrapped in tinsel.',
      'Federal employees are generally barred from taking pay beyond their government salary. Richard Painter, the former Bush White House ethics chief, put it best: “A White House staffer is not your Fifth Avenue doorman.”',
      'The White House says it’s all fine. Spokesman Davis Ingle called it Trump’s “longstanding practice” of Christmas gifts to people “in his orbit,” unrelated to “official government duties” and “entirely permissible.”',
      'His orbit, his rules, his envelope.',
      'These aren’t random staffers. Harp and Nauta are among Trump’s closest aides. Earlier Post reporting, noted by Reuters, put them in the secret Turkey-to-UK flight shuffle during the Iran threat scare.',
      'Harp helps run his Truth Social feed, and colleagues call her the “human printer.” Nauta, a former valet, was charged in the Mar-a-Lago documents case. That case was dropped after Trump returned to office.',
      'Loyalty pays. Literally, and in cash.',
    ],
    sources: [
      {
        label: 'Reuters — Trump gave $45,000 cash gifts to Harp and others, 9 Sep 2026',
        url: 'https://www.reuters.com/legal/government/trump-gave-45000-cash-gifts-close-aide-natalie-harp-others-2026-09-09/',
      },
      {
        label: 'AP (via NBC) — the holiday gifts to Harp and two other aides, 9 Sep 2026',
        url: 'https://www.nbcnews.com/politics/politics-news/trump-gave-45000-holiday-gifts-natalie-harp-two-white-house-aides-rcna596751',
      },
      {
        label: 'Natalie Harp — 2026 annual disclosure (PDF)',
        url: 'https://www.whitehouse.gov/wp-content/uploads/2026/09/Harp-Natalie-2026-Annual.pdf',
      },
      {
        label: 'Chamberlain Harris — 2026 annual disclosure (PDF)',
        url: 'https://www.whitehouse.gov/wp-content/uploads/2026/09/Harris-Chamberlain-2026-Annual.pdf',
      },
      {
        label: 'Margo Martin — 2026 annual disclosure (PDF)',
        url: 'https://www.whitehouse.gov/wp-content/uploads/2026/09/Martin-Margo-2026-Annual.pdf',
      },
      {
        label: '2026 Annual Report to Congress on White House Staff — salaries (PDF)',
        url: 'https://www.whitehouse.gov/wp-content/uploads/2026/07/2026-Annual-Report-to-Congress-on-White-House-Staff.pdf',
      },
    ],
    published: true,
    fixture: false,
    proseArticle: true,
  },
]

export function getPublishedArticles(): Article[] {
  return articles
    .filter((a) => a.published && !a.fixture)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug && a.published)
}

/** All published including engineering fixtures (static HTML / direct URL). */
export function getAllPublishedArticles(): Article[] {
  return articles
    .filter((a) => a.published)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

export function getPublishedReports(): Article[] {
  return getPublishedArticles().filter((a) => a.category === 'REPORTS')
}
