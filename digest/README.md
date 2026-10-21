# Daily digest

Cloudflare Worker `donaldfiles-digest` (account donaldfiles). Crons `0 11 * * *` and `0 12 * * *` (UTC); it only sends on
the run where it is 07:00 in America/New_York, so it lands at 7am New York year-round (11:00 UTC in EDT, 12:00 UTC in EST).

- Content: https://thedonaldfiles.com/feed.json, posts published in the 24h before the run, clips first, max 5. None → no send.
- Recipients: `newsletter_subscribers` with status confirmed (rows with source `test` are excluded from real runs).
- Sending: Resend batch API, 100 per call, deterministic Idempotency-Key per date+recipient chunk; per-email
  List-Unsubscribe + List-Unsubscribe-Post (one-click → POST /api/unsubscribe on the Pages project).
- Log: `digest_sends` (one row per subscriber per date; already-sent rows are skipped on a retry).
- Intro: `digest_intros`, set by Ink with `node /workspace/donald-files/digest/set-intro.mjs "One line."` (uses the New York date).
- DB access: public key + shared digest secret checked by SECURITY DEFINER RPCs (supabase/migrations/0003_digest.sql).
- Secrets (wrangler secret put): RESEND_API_KEY (Resend key df-digest-worker, sending-only, thedonaldfiles.com),
  SUPABASE_ANON_KEY, DIGEST_SECRET, UNSUB_SECRET (= Pages DF_UNSUB_SECRET_2). Box copies: /home/box/.config/donaldfiles/ (mode 600).

Test (sends only to rows with source = 'test'; re-confirm the bot inbox row first):
    curl -X POST -H "Authorization: Bearer $(cat /home/box/.config/donaldfiles/digest-secret)" https://donaldfiles-digest.donaldfiles.workers.dev/run-test
Preview HTML: GET /preview (same auth), `?text` for the plain-text part.
Deploy: `cd digest && npx wrangler deploy`
