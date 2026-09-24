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
}

export const articles: Article[] = [
  {
    slug: 'wh-youtube-trump-tv',
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
    ]
,
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
    ]
,
    published: true,
    fixture: false,
    proseArticle: true,
  },
  {
    slug: 'trump-un-blunders',
    title:
      'UNGA’s greatest hits: the laugh track, the broken teleprompter, and seven wars that weren’t',
    category: 'REPORTS',
    date: '2026-09-24',
    dek: 'From the chamber laughing at his 2018 boast to a 2025 speech that opened with “whoever’s operating this teleprompter is in big trouble,” Trump’s UN podium still delivers — and the fact-checkers bring receipts.',
    body: [
      'FACT — What happened: On 25 September 2018 at the UN General Assembly, Trump said his administration had “accomplished more than almost any administration in the history of our country.” Delegates laughed. Trump: “I didn’t expect that reaction, but that’s OK.” (Guardian contemporaneous; AP video.)',
      'FACT — On 19 September 2017 at UNGA, Trump vowed the U.S. would “totally destroy” North Korea if forced to defend itself and called Kim Jong Un “Rocket Man.” (Reuters; State Dept full address.)',
      'FACT — On 23 September 2025, Trump opened his UNGA speech saying the teleprompter wasn’t working and that “whoever’s operating this teleprompter is in big trouble” (laughter). He later joked the UN gave him “a bad escalator and a bad teleprompter.” (PBS; NBC; BBC) Full speech on UN Web TV: https://webtv.un.org/en/asset/k19/k1952w5l08 — also ABC and State Dept YouTube mirrors. NBC teleprompter open clip: https://www.nbcnews.com/video/trump-s-teleprompter-malfunctions-during-united-nations-speech-248154181727',
      'FACT — Same day — escalator: Trump and Melania were aboard when a UN HQ escalator stopped. BBC (24 Sep 2025): UN said a safety mechanism triggered; spokesperson Stéphane Dujarric said a U.S.-delegation videographer filming backward “may have inadvertently triggered the safety function.” BBC also reports a UN official said the White House was operating the teleprompter (own laptops plugged into the UN system).',
      'FACT — Same speech — “I have ended seven unendable wars”: Trump listed Cambodia–Thailand, Kosovo–Serbia, DRC–Rwanda, Pakistan–India, Israel–Iran, Egypt–Ethiopia, Armenia–Azerbaijan. PolitiFact rates Mostly False (23 Sep 2025): some ceasefires with U.S. role; Egypt–Ethiopia not a war; Kosovo–Serbia thinly evidenced; Congo–Rwanda violence continued; India disputes mediation credit. CNN’s Daniel Dale and AP Fact Focus similarly flag the claim.',
      'FACT — PBS also notes other on-camera lines from the same speech: countries with uncontrolled migration are “going to hell”; climate as “the greatest con job ever perpetrated on the world.”',
      'ANALYSIS (labeled opinion / editorial context) — Why it matters: The 2018 laugh track still needs no overlay — the room fact-checked him live. 2025 upgrades the slapstick: blame the UN for a teleprompter the White House may have been running, then sell “seven unendable wars” to the one chamber that keeps the casualty counts. “Bad escalator + bad teleprompter” is grievance presidency as stagecraft — even the architecture is the deep state. Cut the AP 2018 laugh → smash to “teleprompter operator is in big trouble” → smash to the UN saying the videographer tripped the escalator. Three beats. Zero invented dialogue. The wars claim isn’t a vibe — it’s Mostly False with named conflicts and named fact-checkers.',
    ],
    sources: [
      {
        label: 'AP — Trump boast gets laugh at UN (2018 YouTube)',
        url: 'https://www.youtube.com/watch?v=-z4y8OJxlK8',
      },
      {
        label: 'UN Web TV — 2025 full UNGA speech (57:18) — NOT YouTube',
        url: 'https://webtv.un.org/en/asset/k19/k1952w5l08',
      },
      {
        label: 'ABC — 2025 full UNGA speech (YouTube)',
        url: 'https://www.youtube.com/watch?v=RLoxCqc3Tro',
      },
      {
        label: 'State Dept — 2025 UNGA remarks (YouTube)',
        url: 'https://www.youtube.com/watch?v=lw9foqNRpyE',
      },
      {
        label: 'NBC — teleprompter malfunction clip (NOT YouTube)',
        url: 'https://www.nbcnews.com/video/trump-s-teleprompter-malfunctions-during-united-nations-speech-248154181727',
      },
      {
        label: 'State Dept — 2017 Rocket Man UNGA address (YouTube)',
        url: 'https://www.youtube.com/watch?v=AyttM9EnObc',
      },
      {
        label: 'White House — President Trump delivers remarks to the UN General Assembly (2025)',
        url: 'https://www.whitehouse.gov/videos/president-trump-delivers-remarks-to-the-united-nations-general-assembly/',
      },
      {
        label: 'BBC — escalator + teleprompter context',
        url: 'https://www.bbc.com/news/articles/cn76kyxp6epo',
      },
      {
        label: 'Guardian — 2018 UNGA speech contemporaneous',
        url: 'https://www.theguardian.com/us-news/2018/sep/25/trump-united-nations-general-assembly-speech-globalism-america',
      },
      {
        label: 'UN AV Library — 2018 package',
        url: 'https://media.un.org/avlibrary/en/asset/d224/d2243857',
      },
      {
        label: 'Reuters — 2017 “totally destroy” North Korea / Rocket Man',
        url: 'https://www.reuters.com/article/world/if-threatened-us-will-totally-destroy-north-korea-trump-vows-idUSKCN1BU0B3/',
      },
      {
        label: 'PBS — 7 key moments from Trump’s U.N. speech (2025)',
        url: 'https://www.pbs.org/newshour/politics/7-key-moments-from-trumps-u-n-speech',
      },
      {
        label: 'CNN — Daniel Dale fact check, UN speech claims',
        url: 'https://www.cnn.com/2025/09/23/politics/fact-check-un-speech-claims-trump',
      },
      {
        label: 'PolitiFact — “ended seven wars” Mostly False',
        url: 'https://www.politifact.com/factchecks/2025/sep/23/donald-trump/trump-ended-seven-wars-un-general-assembly/',
      },
      {
        label: 'PolitiFact — UN speech article',
        url: 'https://www.politifact.com/article/2025/sep/23/trump-un-general-assembly-speech/',
      },
      {
        label: 'AP Fact Focus — seven wars claim',
        url: 'https://apnews.com/article/trump-peace-wars-claim-fact-check-10128b26232e1d1eb9e68c5617320cf3',
      },
    ],
    embeds: [
      {
        type: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=-z4y8OJxlK8',
        title: 'AP — Trump boast gets laugh at UN (2018)',
        caption: 'FACT · PRIMARY · chamber laugh track',
        afterBodyIndex: 0,
      },
      {
        type: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=AyttM9EnObc',
        title: 'State Dept — full 2017 UNGA address (Rocket Man)',
        caption: 'FACT · official State Dept YouTube',
        afterBodyIndex: 1,
      },
      {
        type: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=RLoxCqc3Tro',
        title: 'ABC — full 2025 UNGA speech',
        caption: 'FACT · full speech mirror (teleprompter open)',
        afterBodyIndex: 2,
      },
      {
        type: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=lw9foqNRpyE',
        title: 'State Dept — 2025 UNGA remarks',
        caption: 'FACT · official State Dept YouTube',
        afterBodyIndex: 2,
      },
    ],
    published: true,
    fixture: false,
  },
  {
    slug: 'truth-social-save-america-act-photo-id',
    title:
      'Two lines, one midterm choke: photo ID + proof of citizenship',
    category: 'REPORTS',
    date: '2026-09-14',
    dek: 'Labor Day morning, Trump boiled the SAVE America Act down to an all-caps checklist — every voter shows photo ID, every voter shows proof of citizenship — while the Senate still won’t give him the bill and midterms loom.',
    body: [
      'FACT — What he posted: On 7 September 2026 at 9:52 AM EDT, @realDonaldTrump posted: “THE SAVE AMERICA ACT: 1. ALL VOTERS MUST SHOW PHOTO I.D. (IDENTIFICATION!). 2. ALL VOTERS MUST SHOW PROOF OF CITIZENSHIP.” Permalink: https://truthsocial.com/@realDonaldTrump/117230085361299862',
      'Timestamp and two-bullet text also archived by Trumpstruth.org (status 41595) and the American Presidency Project (UCSB) for 7 September 2026.',
      'ANALYSIS (labeled opinion / editorial context) — Why it matters: Two-bullet rage bait for the midterm base. LOUD distinction — this is NOT the DHS SAVE database (the blocked citizenship-check system DOJ is begging SCOTUS to revive; that is a separate live REPORT). This is the SAVE America Act — legislation: photo ID + proof of citizenship at the voter / registration gate. House moved the Act; AP: stalled in Senate despite Trump’s demands, no clear filibuster path before Nov. 3. Proof-of-citizenship registration is the knife (passport / birth-certificate territory; many state licenses don’t cut it per AP). Brennan Center: ~21.3M voting-age citizens lack that paperwork “readily available.” Same election-control stack, different weapon: Act = statute choke; DHS SAVE database = executive purge tool.',
      'SATIRE (desk-made — NOT a fact): “VOTER ACCESS, SIMPLIFIED: bring a passport or don’t bother.”',
      'Related file: /reports/doj-scotus-save-voter-verification/',
    ],
    sources: [
      {
        label: 'Primary — Truth Social permalink (@realDonaldTrump, 7 Sep 2026)',
        url: 'https://truthsocial.com/@realDonaldTrump/117230085361299862',
      },
      {
        label: 'Archive — Trumpstruth.org status 41595',
        url: 'https://www.trumpstruth.org/statuses/41595',
      },
      {
        label:
          'Archive — American Presidency Project (UCSB), Truth Social Posts of 7 Sep 2026',
        url: 'https://www.presidency.ucsb.edu/documents/truth-social-posts-september-7-2026',
      },
      {
        label:
          'Context — AP, voting bill / citizenship / Senate / Thune / Trump',
        url: 'https://apnews.com/article/voting-bill-citizenship-senate-thune-trump-3709f2bd02d2c841e16d501529ec9198',
      },
      {
        label:
          'Context — AP, voting / Trump midterms / citizenship / Republican Senate',
        url: 'https://apnews.com/article/voting-trump-midterms-citizenship-republican-senate-d4acd3468c410a8842a0fe3e3b9cda57',
      },
      {
        label:
          'Context — AP fact check, SAVE Act identification / register to vote',
        url: 'https://apnews.com/article/fact-check-save-act-identification-register-vote-d11d41b59f943bb72bcdca2d781293b7',
      },
      {
        label:
          'Context — Brennan Center, 21.3M voting-age citizens lack ready paperwork',
        url: 'https://www.brennancenter.org/our-work/analysis-opinion/213-million-american-citizens-voting-age-dont-have-ready-access',
      },
      {
        label:
          'Related live REPORT — DOJ/SCOTUS + blocked DHS SAVE voter-verification database (NOT the Act)',
        url: 'https://the-donald-files.pages.dev/reports/doj-scotus-save-voter-verification/',
      },
    ],
    published: true,
  },
  {
    slug: 'truth-social-white-house-dump-ballroom',
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
    ]
,
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
    title:
      'On 9/11 night he dropped a Caracas flex reel: “effed around, and he found out”',
    category: 'REPORTS',
    date: '2026-09-14',
    dek: 'Months after U.S. forces yanked Nicolás Maduro out of Venezuela, Trump posted a highlight reel calling the raid one of the “most stunning… displays of American military might” in U.S. history — and framed it as a warning to everyone else.',
    body: [
      'FACT — What he posted: On 11 September 2026 at 11:21 PM EDT, @realDonaldTrump posted a video. Per the Trump’s Truth archive transcript, the clip includes lines that U.S. forces conducted an “apprehension mission in Caracas, Venezuela to bring to justice 2 indicted persons, Nicolas and Cecilia Maduro,” plus the taunt that Maduro “had his chance until he didn’t” / “effed around, and he found out,” and praise for the operation as among the “most stunning, effective, and powerful displays of American military might and competence in American history.” Permalink: https://truthsocial.com/@realDonaldTrump/117255916246451243',
      'ANALYSIS (labeled opinion / editorial context) — Why it matters: This isn’t breaking news — the raid was 3 January 2026 (AP/Reuters). It’s a victory lap on the anniversary of 9/11, recycled as midterm-season intimidation porn: we can snatch a sitting leader; adjust accordingly. Maduro is in Brooklyn fighting the case on immunity grounds (Reuters, 2 Sep 2026). Trump’s still selling the extraction like a UFC walkout. Deterrence theater, truth-app edition.',
    ],
    sources: [
      {
        label: 'Primary — Truth Social permalink (@realDonaldTrump, 11 Sep 2026)',
        url: 'https://truthsocial.com/@realDonaldTrump/117255916246451243',
      },
      {
        label: 'Archive — Trumpstruth.org status 41697',
        url: 'https://www.trumpstruth.org/statuses/41697',
      },
      {
        label:
          'Context — AP, Trump / Maduro Venezuela raid (3 Jan 2026 attributed)',
        url: 'https://apnews.com/article/trump-maduro-venezuela-presidential-palace-blowtorches-7969152ae48510003fe9cbde92f3c102',
      },
      {
        label:
          'Context — Reuters, Maduro asserts immunity (2 Sep 2026)',
        url: 'https://www.reuters.com/world/americas/venezuelas-maduro-asserts-immunity-urges-us-judge-dismiss-charges-2026-09-02/',
      },
    ],
    published: true,
  },
  {
    slug: 'truth-social-dallas-beat-nfl',
    title:
      'He declared Dallas “beat the NFL” before the ratings even existed',
    category: 'REPORTS',
    date: '2026-09-14',
    dek: 'Morning-after Truth Social: Trump called the midterm convention a “sold out hit” that “beat the NFL” — while reporters noted empty upper-deck seats and no Nielsen numbers out yet.',
    body: [
      'FACT — What he posted: On 10 September 2026 at 7:54 AM ET (4:54 AM PT), @realDonaldTrump posted: "The Republican Midterm Convention last night, in Dallas, was a major, sold out hit, far bigger, better, and more important than anyone thought possible. It was really something, streaming all over the place, and really big numbers, despite going up against the NFL. The overall numbers beat the NFL. The Arena, which was really nice, beat its own attendance records. The place was packed! There were thousands of people outside who couldn’t get in. Screens were provided. I guess people LOVE TRUMP POLITICS! I’ll be there again tonight to close out the show. Exciting “Stuff!” MAKE AMERICA GREAT AGAIN!!!" Permalink: https://truthsocial.com/@realDonaldTrump/117246607022445743',
      'Timestamp and full text also archived by Trumpstruth.org (status 41664) and the American Presidency Project (UCSB) for 10 September 2026.',
      'ANALYSIS (labeled opinion / editorial context) — Why it matters: Classic move: declare victory in the absence of data. Mediaite noted unclear “overall numbers” — ratings weren’t in; last year’s NFL opener drew roughly 28 million. The Wall Street Journal flagged empty upper-deck seats; Nielsen hadn’t released ratings. He still typed “beat the NFL.”',
    ],
    sources: [
      {
        label: 'Primary — Truth Social permalink (@realDonaldTrump, 10 Sep 2026)',
        url: 'https://truthsocial.com/@realDonaldTrump/117246607022445743',
      },
      {
        label: 'Archive — Trumpstruth.org status 41664',
        url: 'https://www.trumpstruth.org/statuses/41664',
      },
      {
        label:
          'Archive — American Presidency Project (UCSB), Truth Social Posts of 10 Sep 2026',
        url: 'https://www.presidency.ucsb.edu/documents/truth-social-posts-september-10-2026',
      },
      {
        label:
          'Context — Mediaite, Trump claims midterm convention ratings beat NFL',
        url: 'https://www.mediaite.com/media/news/trump-claims-midterm-convention-ratings-beat-nfl-i-guess-people-love-trump-politics/',
      },
      {
        label:
          'Context — WSJ live coverage, empty seats and NFL competition',
        url: 'https://www.wsj.com/livecoverage/trump-vance-midterm-elections-2026-rnc/card/trump-raves-about-rnc-night-one-despite-empty-seats-and-nfl-competition-IkslVQ2STUepOXNq4KUb',
      },
    ],
    published: true,
  },
  {
    slug: 'truth-social-reflecting-pool-vandalism-primer',
    title:
      'On 9/11 weekend he boosted a vandalism yarn while the contractor paperwork points at botched primer',
    category: 'REPORTS',
    date: '2026-09-14',
    dek: 'Trump RTed Interior Press on Truth Social blaming “342 feet of razor blade slashes” and “8647” graffiti for the drained Reflecting Pool — as reporting on contractor docs says the liner failed from bad primer and incompatible chemistry.',
    body: [
      'FACT — What he posted: On 13 September 2026 at 5:06 AM EDT, @realDonaldTrump reshared U.S. Interior Press (@interiorpress47) attacking the New York Times for covering the Reflecting Pool on the 25th anniversary of 9/11 and claiming the paper “continue[s] to avoid doing any real reporting on all the vandalism,” listing: 342 feet of razor blade slashes; “8647” spray-painted in massive lettering; (post truncated in the reshare preview). Permalink: https://truthsocial.com/@realDonaldTrump/117262936693023151 Companion: https://truthsocial.com/@realDonaldTrump/117262935739176527',
      'ANALYSIS (labeled opinion / editorial context) — Why it matters: This is the administration’s preferred plot: vandals did it, media ignored it, Trump’s the truth-teller. Wire and local reporting on contractor documents tell a colder story — Atlantic Industrial Coatings’ own findings cite insufficient primer, chemically incompatible layers, blistering/peeling under heat; DOJ dropped a vandalism case after acknowledging flawed renovation work (Newsweek/WTOP summarizing the NYT docs). He still hit boost on the slash-and-spray narrative. Choose your reality: forensic liner chemistry, or a Truth Social rage RT.',
    ],
    sources: [
      {
        label: 'Primary — Truth Social permalink (@realDonaldTrump, 13 Sep 2026)',
        url: 'https://truthsocial.com/@realDonaldTrump/117262936693023151',
      },
      {
        label: 'Primary — companion Truth Social (@realDonaldTrump, 13 Sep 2026)',
        url: 'https://truthsocial.com/@realDonaldTrump/117262935739176527',
      },
      {
        label: 'Archive — Trumpstruth.org status 41700',
        url: 'https://www.trumpstruth.org/statuses/41700',
      },
      {
        label:
          'Context — Newsweek, Reflecting Pool / NYT / vandalism claims',
        url: 'https://www.newsweek.com/trump-hits-back-at-new-york-times-over-reflecting-pool-story-on-9-11-12436224',
      },
      {
        label:
          'Context — WTOP, contractor docs point to primer not vandalism',
        url: 'https://wtop.com/dc/2026/09/report-company-that-renovated-lincoln-memorial-reflecting-pool-says-issue-is-with-primer-not-vandalism/',
      },
    ],
    published: true,
  },
  {
    slug: 'truth-social-colossus-smithsonian-washington',
    title:
      'He wants a 30-foot Washington “Colossus” and a culture war at the Smithsonian',
    category: 'REPORTS',
    date: '2026-09-14',
    dek: 'On 9/11 night, Trump posted a taxpayer-museum manifesto: dump the “Infinity” sculpture, build a giant George Washington statue, and replace “restorative history” with a “Center for American Heroes.” Here’s the post.',
    body: [
      'FACT — What he posted: On 11 September 2026 at 10:31 PM ET (7:31 PM PT), @realDonaldTrump posted (and reshared) a call on the Smithsonian Institution to: Mount a five-year George Washington exhibition at the National Museum of American History through 22 February 2032; Erect a 30-foot “Colossus statue” outside the museum to replace the “Infinity” sculpture; Install an 11-foot Washington statue from a “Freedom 250 Grand Prix” into Flag Hall by Constitution Day, 17 September 2026; Swap a “Center for Restorative History” / “Decolonization Plan” framing for a “Center for American Heroes.” He attacked an exhibit describing 1492–1776 as the “Great Unsettling,” claimed Washington’s Delaware crossing “is not even mentioned,” and closed: “Thank you for your attention to this matter! President DONALD J. TRUMP” Permalink: https://truthsocial.com/@realDonaldTrump/117255718355537976 Related RT: https://truthsocial.com/@realDonaldTrump/117255720319253709',
      'Timestamp and full text also archived by the American Presidency Project (UCSB) for 11 September 2026.',
      'ANALYSIS (labeled opinion / editorial context) — Why it matters: This isn’t museum enthusiasm — it’s a presidential culture-war memo timed to the 9/11 anniversary and the nation’s 250th, drafted as if the Smithsonian were a campaign prop. Demanding a “Colossus,” scrubbing “restorative history,” and rewriting the exhibit brief from the Truth Social app is the same move every time: personal brand first, institutions second, history as a loyalty test.',
    ],
    sources: [
      {
        label: 'Primary — Truth Social permalink (@realDonaldTrump, 11 Sep 2026)',
        url: 'https://truthsocial.com/@realDonaldTrump/117255718355537976',
      },
      {
        label: 'Primary — companion RT (@realDonaldTrump, 11 Sep 2026)',
        url: 'https://truthsocial.com/@realDonaldTrump/117255720319253709',
      },
      {
        label:
          'Archive — American Presidency Project (UCSB), Truth Social Posts of 11 Sep 2026',
        url: 'https://www.presidency.ucsb.edu/documents/truth-social-posts-september-11-2026',
      },
    ],
    published: true,
  },
  {
    slug: 'truth-social-trump-dividend-5000-double-down',
    title: 'He doubled down on the $5,000 midterm bribe on his own app',
    category: 'REPORTS',
    date: '2026-09-14',
    dek: 'Two days after Dallas, Trump posted that the “Trump Dividend” will happen — and told America to VOTE REPUBLICAN. Here’s the post. Full stop.',
    body: [
      'FACT — What he posted: On 11 September 2026 at 3:08 PM ET, @realDonaldTrump posted: “The $5,000 Trump Dividend, given to all Adults in the United States due to the fact that our Country is taking in Trillions of Dollars of Economic Development, Investment, and Pure SUCCESS, is being criticized by “Dumocrats” who are hoping that it never happens — But it will! As an example, the Dumocrats said THE GREAT BIG BEAUTIFUL BILL, one of the largest ever approved by Congress, or signed into Law by a President happened, despite the Dumocrats saying it would be impossible to get approved — Or the Gift of $1776 that I gave last year to our Military, was an almost guaranteed Non Starter, everyone said it could not be done, but it was, our Military Patriots got the money, and loved it. When I say something, I mean it! The $5,000 Dividend will happen because the People of our Country deserve it. VOTE REPUBLICAN — MAKE AMERICA GREAT AGAIN! President DONALD J. TRUMP” Permalink: https://truthsocial.com/@realDonaldTrump/117253978301857789',
      'No mechanics. No bill text. No funding line. Just a midterm demand note typed in all-caps energy and aimed at the base. Timestamp and full text also archived by the American Presidency Project (UCSB) for 11 September 2026.',
      'ANALYSIS (labeled opinion / editorial context) — Why it matters: This is the convention pledge with the mask off: not a policy white paper — a vote-contingent cash promise blasted on his private network after the arena lights went down. Wire reporting already put the sticker price north of $1 trillion and noted Congress would likely have to bless it. He answered the skepticism the only way he knows: yell “But it will!” and stamp VOTE REPUBLICAN on the end.',
      'Related file: /reports/trump-dividend-5000-gop-congress/',
    ],
    sources: [
      {
        label: 'Primary — Truth Social permalink (@realDonaldTrump, 11 Sep 2026)',
        url: 'https://truthsocial.com/@realDonaldTrump/117253978301857789',
      },
      {
        label:
          'Archive — American Presidency Project (UCSB), Truth Social Posts of 11 Sep 2026',
        url: 'https://www.presidency.ucsb.edu/documents/truth-social-posts-september-11-2026',
      },
      {
        label: 'Context — Reuters, 10 Sep 2026 (cost / Congress / legality)',
        url: 'https://www.reuters.com/world/us/trump-touts-5000-payout-if-republicans-win-vance-waits-wings-2026-09-10/',
      },
    ],
    published: true,
  },
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

  {
    slug: 'embed-path-smoke-test',
    title: 'Embed path smoke test (Ink: replace / remove)',
    category: 'REPORTS',
    date: '2026-09-24',
    dek: 'Engineering fixture — proves youtube-nocookie iframe on Open Dossier pages. Not a dossier claim. Ink: delete this file or replace the embed with a real WH / UN URL.',
    body: [
      'FACT — Path proof only: this page exists so Cloudflare Pages + CSP + the VideoEmbed component can be verified live. No political claim is attached to the placeholder clip.',
      'ANALYSIS (labeled opinion / editorial context) — Why it matters for the desk: Reed/Ink can pass embeds as { type: youtube, id } or youtubeUrl / embedUrl; the site normalizes to https://www.youtube-nocookie.com/embed/ID and renders a quiet 16:9 frame in the charcoal/manila dossier body.',
      'SATIRE (desk-made — NOT a fact): “EXHIBIT STAMP: this is a smoke test, not a gotcha.”',
    ],
    sources: [
      {
        label: 'Placeholder — White House YouTube channel (smoke ID only)',
        url: 'https://www.youtube.com/watch?v=WWDtyRXsGoI',
      },
    ],
    embeds: [
      {
        type: 'youtube',
        id: 'WWDtyRXsGoI',
        title: 'White House channel (smoke-test placeholder)',
        caption: 'MOCK EXHIBIT · SMOKE TEST · Ink replace with real URL',
        afterBodyIndex: 0,
      },
    ],
    fixture: true,
    published: true,
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
