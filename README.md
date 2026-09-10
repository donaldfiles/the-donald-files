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
| `/` | Home — hero, feed stubs, Telegram, Subscribe CTAs |
| `/reports` | Reports |
| `/the-record` | Timeline placeholder |
| `/about` | About |
| `/subscribe` | Subscribe / Support the Research / Buy the Report |
| `/admin` | Admin stub (not in public nav) |

## Supabase

Migration stub: `supabase/migrations/0001_init.sql` — `articles` + `subscribers`, RLS notes, Auth for `/admin`.

## Resend

`src/lib/resend.ts` is a **client stub** that does not call Resend. Wire a Supabase Edge Function that reads `RESEND_API_KEY` and sends mail; the SPA should only POST to that function.

## Language

Use: **Subscribe** / **Support the Research** / **Buy the Report**. Never “Donate”.

## Telegram

https://t.me/thedonaldfiles
