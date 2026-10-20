# The Donald Files

Brutal. Factual. Documented.

Vite + React + TypeScript broadsheet site for reports, analysis, timeline, and subscriptions.

## Stack

- Vite, React 19, TypeScript
- React Router
- Supabase JS client (anon key via env)
- Resend email via **server-side** Edge Function (stub in SPA — key never in browser)

## Existing Supabase project

Documented project ref: **`rkudbltzydukizjtjonl`**

URL is supplied only via `VITE_SUPABASE_URL` (see `.env.example`). Do not hardcode secrets.

## Setup

```bash
npm install
cp .env.example .env
# Fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

Build:

```bash
npm run build
```

## Environment

| Variable | Where | Notes |
|----------|--------|--------|
| `VITE_SUPABASE_URL` | Client | e.g. `https://rkudbltzydukizjtjonl.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Client | Anon/public key only |
| `RESEND_API_KEY` | Server / Edge Function only | **Never** use `VITE_` prefix |
| `RESEND_FROM_EMAIL` | Server / Edge Function only | Verified sender |

## Routes

| Path | Page |
|------|------|
| `/` | Home — featured report + latest feed, Telegram, Subscribe CTAs |
| `/reports` | Reports listing |
| `/reports/:slug` | Individual REPORT article + SOURCE FILES |
| `/the-record` | Timeline placeholder |
| `/about` | About |
| `/subscribe` | Subscribe / Support the Research / Buy the Report |
| `/admin` | Admin stub (not in public nav) |

## Content (v1)

Published articles live in `src/content/articles.ts` (static module). Category labels use REPORTS / ANALYSIS / TIMELINE / OPINION. Each report renders a **SOURCE FILES** section with outbound links.

## Supabase

Migration stub: `supabase/migrations/0001_init.sql` — `articles` + `subscribers`, RLS notes, Auth for `/admin`.

## Resend

`src/lib/resend.ts` is a **client stub** that does not call Resend. Wire a Supabase Edge Function that reads `RESEND_API_KEY` and sends mail; the SPA should only POST to that function.

## Language

Use: **Subscribe** / **Support the Research** / **Buy the Report**. Never “Donate”.

## Telegram

https://t.me/thedonaldfiles

## SEO, share cards & feeds (build step)

`npm run build` runs `scripts/generate-static.mjs` (article + /reports HTML with canonical, OG, Twitter and NewsArticle JSON-LD tags) and then `scripts/generate-seo.mjs`, which writes:

- `dist/og/<slug>.png`: a 1200x630 share card per article, using Vex's share card v1 (`scripts/share-card/template.html` plus `SHARE-CARD-SPEC.md`). Headless Chrome screenshots it through `playwright-core` (system `/usr/bin/google-chrome`, override with `CHROME_PATH`) using the box's system fonts: Antonio and IBM Plex Mono, Serif and Sans. Any card that fails or overflows falls back to `dist/og/default.png`.
  - Per-article fields in `articles.ts`, all optional:
    - `ogKicker`: topic tape. Defaults to "Truth Social watch" for `truth-social-*` slugs, otherwise empty.
    - `ogPunch`: an exact word or phrase from the hed to highlight. Defaults to no highlight.
    - `ogStamp`: FILED, RECEIPTS, ON TAPE or IN WRITING. Defaults to FILED. FACT, REPORT, ANALYSIS and SATIRE are rejected.
    - `ogFile`: dossier number. Defaults to the chronological order, with the oldest article as 001.
  - The dek only goes on the card when it fits on one line, as the spec requires.
  - Bump `OG_VERSION` in `scripts/lib/seo.mjs` after a design change so X re-fetches the cards.
- Home share tags injected into `dist/index.html`.
- `dist/sitemap.xml`, `dist/robots.txt`, `dist/rss.xml` and `dist/feed.json` (JSON Feed 1.1), newest first.

## X posting queue (prep, no keys yet)

`node scripts/post-queue.mjs` does a dry run. It prints draft posts of 280 chars or fewer for articles that are not yet in `data/x-post-state.json`.
`--write-drafts` saves them to `data/x-drafts.json`. `--post` calls the stubbed `postToX()`, which does nothing unless `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN` and `X_ACCESS_TOKEN_SECRET` are set, and is still unimplemented even when they are. `--mark-posted <slug>` records a manual post.
