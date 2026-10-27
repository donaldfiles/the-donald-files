// Shared helpers for /api/subscribe, /api/confirm, /api/unsubscribe (Cloudflare Pages Functions).
// Secrets (wrangler pages secret): SUPABASE_URL, SUPABASE_ANON_KEY, DF_RPC_SECRET,
// DF_UNSUB_SECRET, DF_UNSUB_SECRET_2 (digest Worker links), RESEND_API_KEY, MAIL_FROM.
export const SITE = 'https://thedonaldfiles.com'

const enc = new TextEncoder()
const b64url = (buf) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')

export async function sha256Hex(s) {
  return hex(await crypto.subtle.digest('SHA-256', enc.encode(s)))
}
export function randomToken() {
  return b64url(crypto.getRandomValues(new Uint8Array(32)))
}
async function hmacKey(secret) {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
}
async function sigWith(secret, id) {
  return b64url(await crypto.subtle.sign('HMAC', await hmacKey(secret), enc.encode(`unsub:${id}`)))
}
export async function unsubSig(env, id) {
  return sigWith(env.DF_UNSUB_SECRET, id)
}
const same = (a, b) => {
  if (!a || !b || a.length !== b.length) return false
  let d = 0
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return d === 0
}
// DF_UNSUB_SECRET signs links in confirm emails; DF_UNSUB_SECRET_2 is shared with the digest Worker.
export async function verifyUnsubSig(env, id, sig) {
  for (const secret of [env.DF_UNSUB_SECRET, env.DF_UNSUB_SECRET_2]) {
    if (secret && same(await sigWith(secret, id), sig)) return true
  }
  return false
}
export async function unsubUrl(env, id) {
  return `${SITE}/api/unsubscribe?id=${encodeURIComponent(id)}&sig=${await unsubSig(env, id)}`
}

export async function rpc(env, fn, args) {
  const r = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_secret: env.DF_RPC_SECRET, ...args }),
  })
  if (!r.ok) throw new Error(`rpc ${fn} → ${r.status}`)
  return r.json()
}

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}
export function back(status) {
  return new Response(null, { status: 303, headers: { Location: `${SITE}/subscribe?status=${status}`, 'Cache-Control': 'no-store' } })
}

export async function sendConfirmEmail(env, to, confirmUrl, unsubscribeUrl) {
  // v5 light, matching the digest Worker palette (digest/worker.js C).
  const C = { paper: '#FAF7F2', card: '#FFFFFF', line: '#E7E1D6', text: '#16213A', muted: '#5A6378', blue: '#2450FF', hl: '#FFE14D' }
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:${C.paper}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">One click and you're on the list.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px">
<tr><td style="padding:0 4px 14px;font:800 24px/1 Arial,Helvetica,sans-serif;color:${C.text};letter-spacing:-.02em">The <span style="background:${C.hl};padding:0 5px;border-radius:5px">Donald</span> Files</td></tr>
<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.card};border:1px solid ${C.line};border-radius:16px;border-collapse:separate">
<tr><td style="padding:24px 24px 0;font:17px/1.5 Georgia,'Times New Roman',serif;color:${C.text}">One click and you're on the list. Confirm your email to get new files when they drop.</td></tr>
<tr><td style="padding:20px 24px 24px"><a href="${confirmUrl}" target="_blank" style="display:inline-block;background:${C.blue};color:#FFFFFF;font:700 16px/1 Arial,Helvetica,sans-serif;text-decoration:none;padding:15px 24px;border-radius:999px">Confirm my email</a></td></tr>
</table></td></tr>
<tr><td style="padding:22px 4px 0;font:13px/1.6 Arial,Helvetica,sans-serif;color:${C.muted}">Didn't sign up? Ignore this email and you won't hear from us. The link expires in 7 days.<br><br>
<a href="${unsubscribeUrl}" style="color:${C.muted};text-decoration:underline">Unsubscribe</a> · <a href="${SITE}/" style="color:${C.blue}">thedonaldfiles.com</a></td></tr>
</table></td></tr></table></body></html>`
  const text = `THE DONALD FILES\n\nConfirm your email to get new files when they drop:\n${confirmUrl}\n\nDidn't sign up? Ignore this email. The link expires in 7 days.\nUnsubscribe: ${unsubscribeUrl}\n`
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.MAIL_FROM || 'The Donald Files <files@thedonaldfiles.com>',
      to: [to],
      subject: 'Confirm your subscription to The Donald Files',
      html,
      text,
      headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
    }),
  })
  if (!r.ok) throw new Error(`resend → ${r.status}`)
  return (await r.json()).id
}
