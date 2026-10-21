#!/usr/bin/env node
// Search Console / Bing Webmaster ownership verification.
//   node scripts/add-verification.mjs google <txt-value>   → adds a TXT record on the apex of thedonaldfiles.com
//                                                            (value may be the bare code or "google-site-verification=…")
//   node scripts/add-verification.mjs bing <meta-content>  → adds <meta name="msvalidate.01" content="…"> to the home <head>
//                                                            (stored in data/site-verification.json), then deploys
// Needs CF_DNS_TOKEN_DONALDFILES in the environment for google (DNS edit on zone 16d980f023fa4d06a8bdf13b9276cabf).
// Idempotent: re-running with the same value changes nothing. Never prints the token.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

const ZONE = '16d980f023fa4d06a8bdf13b9276cabf'
const APEX = 'thedonaldfiles.com'
const root = new URL('..', import.meta.url).pathname
const [kind, raw] = process.argv.slice(2)
const die = (m) => { console.error(m); process.exit(1) }
if (!['google', 'bing'].includes(kind) || !raw?.trim()) die('usage: node scripts/add-verification.mjs google <txt-value> | bing <meta-content>')
const value = raw.trim().replace(/^["']|["']$/g, '')

if (kind === 'google') {
  // The env var may hold the bare token or Cloudflare's whole "curl … -H 'Authorization: Bearer <token>'" test snippet.
  const envTok = (process.env.CF_DNS_TOKEN_DONALDFILES || '').trim()
  const token = (/Bearer\s+([A-Za-z0-9_-]{20,})/.exec(envTok) || [, envTok])[1].replace(/^["']|["']$/g, '')
  if (!token || /\s/.test(token)) die('CF_DNS_TOKEN_DONALDFILES is not set or not a usable API token')
  const content = value.startsWith('google-site-verification=') ? value : `google-site-verification=${value}`
  if (!/^google-site-verification=[\w-]{20,}$/.test(content)) die(`that doesn't look like a Google TXT value: ${content}`)
  const api = async (path, init = {}) => {
    const r = await fetch(`https://api.cloudflare.com/client/v4/zones/${ZONE}${path}`, { ...init, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } })
    const j = await r.json()
    if (!j.success) die(`Cloudflare API ${init.method || 'GET'} ${path} failed: ${JSON.stringify(j.errors)}`)
    return j.result
  }
  const existing = await api(`/dns_records?type=TXT&name=${APEX}&per_page=100`)
  const strip = (c) => c.replace(/^"|"$/g, '')
  if (existing.some((r) => strip(r.content) === content)) console.log(`TXT already present on ${APEX}: ${content}`)
  else {
    const rec = await api('/dns_records', { method: 'POST', body: JSON.stringify({ type: 'TXT', name: APEX, content: `"${content}"`, ttl: 1, comment: 'Google Search Console verification' }) })
    console.log(`Added TXT ${rec.name} = ${content} (record ${rec.id})`)
  }
  // Check it resolves publicly (Cloudflare usually serves it within seconds).
  const dns = await (await fetch(`https://cloudflare-dns.com/dns-query?name=${APEX}&type=TXT`, { headers: { accept: 'application/dns-json' } })).json()
  const seen = (dns.Answer || []).some((a) => a.data.replace(/"/g, '') === content)
  console.log(seen ? 'Resolves publicly via 1.1.1.1. Click Verify in Search Console.' : 'Not visible on 1.1.1.1 yet; give it a minute, then click Verify in Search Console.')
  console.log('No site deploy needed for DNS verification.')
} else {
  if (!/^[A-Za-z0-9]{16,64}$/.test(value)) die(`that doesn't look like a Bing msvalidate.01 value: ${value}`)
  const p = root + 'data/site-verification.json'
  const v = existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {}
  if (v.bing === value) console.log('Bing meta already set; redeploying anyway.')
  v.bing = value
  writeFileSync(p, JSON.stringify(v, null, 2) + '\n')
  console.log(`Set msvalidate.01 = ${value} in data/site-verification.json; deploying…`)
  execSync('npm run deploy', { cwd: root, stdio: 'inherit' })
  const live = await (await fetch(`https://${APEX}/?v=${Date.now()}`)).text()
  console.log(live.includes(`name="msvalidate.01" content="${value}"`) ? 'Live: the meta tag is on the home page. Click Verify in Bing Webmaster Tools.' : 'Deployed, but the tag is not visible live yet (cache?). Re-check https://thedonaldfiles.com/ in a minute.')
  console.log('Remember to commit data/site-verification.json.')
}
