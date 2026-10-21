import { back, rpc, sha256Hex } from '../_lib/newsletter.js'

export async function onRequestGet({ request, env }) {
  const token = new URL(request.url).searchParams.get('token') || ''
  if (!/^[A-Za-z0-9_-]{40,64}$/.test(token)) return back('invalid')
  try {
    const r = await rpc(env, 'df_confirm', { p_token_hash: await sha256Hex(token) })
    return back(r.result) // confirmed | already | expired | invalid
  } catch (e) {
    console.error('confirm failed', e.message)
    return back('error')
  }
}
