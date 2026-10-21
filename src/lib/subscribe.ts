/** Browser side of newsletter signup. Server: functions/api/subscribe.js (double opt-in). */
export type SubscribePayload = {
  email: string
  website?: string // honeypot, must stay empty
  t: number // form render time (ms), used as a bot speed bump
  source?: string
}

export type SubscribeResult = { ok: boolean; message: string }

export async function submitSubscribe(p: SubscribePayload): Promise<SubscribeResult> {
  const email = p.email.trim()
  if (!email || !email.includes('@')) {
    return { ok: false, message: 'Enter a valid email address.' }
  }
  try {
    const r = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...p, email }),
    })
    const data = (await r.json().catch(() => null)) as SubscribeResult | null
    return data ?? { ok: r.ok, message: r.ok ? 'Check your inbox.' : 'Something broke. Try again.' }
  } catch {
    return { ok: false, message: 'Network error. Try again.' }
  }
}
