import { back, json, rpc, verifyUnsubSig } from '../_lib/newsletter.js'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function run(request, env) {
  const u = new URL(request.url)
  const id = u.searchParams.get('id') || ''
  const sig = u.searchParams.get('sig') || ''
  if (!UUID.test(id) || !(await verifyUnsubSig(env, id, sig))) return 'invalid'
  const r = await rpc(env, 'df_unsubscribe', { p_id: id })
  return r.result === 'unsubscribed' ? 'unsubscribed' : 'invalid'
}

export async function onRequestGet({ request, env }) {
  try {
    return back(await run(request, env))
  } catch (e) {
    console.error('unsubscribe failed', e.message)
    return back('error')
  }
}

// RFC 8058 one-click unsubscribe (List-Unsubscribe-Post) from mail clients.
export async function onRequestPost({ request, env }) {
  try {
    const s = await run(request, env)
    return json({ ok: s === 'unsubscribed' }, s === 'unsubscribed' ? 200 : 400)
  } catch {
    return json({ ok: false }, 502)
  }
}
