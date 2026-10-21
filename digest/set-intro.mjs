#!/usr/bin/env node
// Set the one-line intro for today's Donald Files digest (today = New York date, the date the 7am send uses).
//   node /workspace/donald-files/digest/set-intro.mjs "Your one-liner here."
//   node /workspace/donald-files/digest/set-intro.mjs --date 2026-10-23 "Line for a specific day"
//   node /workspace/donald-files/digest/set-intro.mjs --clear          (remove today's intro)
// Reads the shared digest secret from /home/box/.config/donaldfiles/ (owner-only files). Never prints it.
import { readFileSync, statSync } from 'node:fs'

const DIR = '/home/box/.config/donaldfiles'
const args = process.argv.slice(2)
let date = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
const di = args.indexOf('--date')
if (di >= 0) { date = args[di + 1]; args.splice(di, 2) }
const clear = args.includes('--clear')
const text = clear ? '' : args.filter((a) => a !== '--clear').join(' ').trim()
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { console.error('Bad --date, use YYYY-MM-DD'); process.exit(2) }
if (!clear && !text) { console.error('Usage: node set-intro.mjs "one-line intro"   (or --clear)'); process.exit(2) }
if (text.length > 280) { console.error(`Too long (${text.length} chars, max 280). Keep it to one line.`); process.exit(2) }

for (const f of ['digest-secret', 'digest.json']) {
  if ((statSync(`${DIR}/${f}`).mode & 0o077) !== 0) { console.error(`${DIR}/${f} must be mode 600`); process.exit(3) }
}
const secret = readFileSync(`${DIR}/digest-secret`, 'utf8').trim()
const { supabaseUrl, anonKey } = JSON.parse(readFileSync(`${DIR}/digest.json`, 'utf8'))
const r = await fetch(`${supabaseUrl}/rest/v1/rpc/df_digest_set_intro`, {
  method: 'POST',
  headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ p_secret: secret, p_date: date, p_intro: text }),
})
if (!r.ok) { console.error(`Failed: HTTP ${r.status}`); process.exit(1) }
const j = await r.json()
console.log(j.result === 'cleared' ? `Cleared the intro for ${date}.` : `Saved the intro for ${date} (New York date): ${text}`)
