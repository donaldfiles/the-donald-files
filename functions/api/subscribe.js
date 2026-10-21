import { SITE, json, rpc, sha256Hex, randomToken, unsubUrl, sendConfirmEmail } from '../_lib/newsletter.js'

const ALLOWED_ORIGINS = [SITE, 'https://www.thedonaldfiles.com']
const OK = { ok: true, message: 'Check your inbox. Click the link we just sent to confirm.' }

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin')
  if (origin && !ALLOWED_ORIGINS.includes(origin) && !/^https:\/\/[a-z0-9-]+\.the-donald-files\.pages\.dev$/.test(origin)) {
    return json({ ok: false, message: 'Forbidden.' }, 403)
  }
  let body
  try {
    const ct = request.headers.get('Content-Type') || ''
    body = ct.includes('application/json') ? await request.json() : Object.fromEntries(await request.formData())
  } catch {
    return json({ ok: false, message: 'Bad request.' }, 400)
  }
  const email = String(body.email || '').trim().toLowerCase()
  // Honeypot + minimum fill time: bots get a fake success and nothing happens.
  const elapsed = Date.now() - Number(body.t || 0)
  if (body.website || !body.t || elapsed < 2000) return json(OK)
  if (!email || email.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ ok: false, message: 'Enter a valid email address.' }, 400)
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  const ipHash = await sha256Hex(`${env.DF_UNSUB_SECRET}:ip:${ip}`)
  const token = randomToken()
  try {
    const r = await rpc(env, 'df_subscribe', {
      p_email: email,
      p_ip_hash: ipHash,
      p_confirm_hash: await sha256Hex(token),
      p_source: String(body.source || 'web').slice(0, 64),
    })
    if (r.result === 'rate_limited') return json({ ok: false, message: 'Too many tries. Give it an hour.' }, 429)
    if (r.result === 'invalid_email') return json({ ok: false, message: 'Enter a valid email address.' }, 400)
    if (r.result === 'send') {
      await sendConfirmEmail(env, email, `${SITE}/api/confirm?token=${token}`, await unsubUrl(env, r.id))
    }
    // already_confirmed / cooldown: same answer, so the form can't be used to probe who's subscribed.
    return json(OK)
  } catch (e) {
    console.error('subscribe failed', e.message)
    return json({ ok: false, message: 'Something broke on our end. Try again in a minute.' }, 502)
  }
}

export function onRequest() {
  return json({ ok: false, message: 'POST only.' }, 405)
}
