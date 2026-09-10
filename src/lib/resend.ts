/**
 * Resend email stub — SPA-safe pattern.
 *
 * RESEND_API_KEY must NEVER be exposed to the browser (no VITE_ prefix).
 * Call a server endpoint (e.g. Supabase Edge Function) that holds the key.
 *
 * Later: implement supabase/functions/subscribe that uses Resend server-side.
 */

export type SubscribePayload = {
  email: string
  source?: string
}

export type SubscribeResult =
  | { ok: true; message: string }
  | { ok: false; message: string }

/**
 * Client-side stub: posts to a future Edge Function / API route.
 * Does not touch RESEND_API_KEY in the browser.
 */
export async function submitSubscribe(
  payload: SubscribePayload,
): Promise<SubscribeResult> {
  const email = payload.email.trim()
  if (!email || !email.includes('@')) {
    return { ok: false, message: 'Enter a valid email address.' }
  }

  // Placeholder: wire to Edge Function when ready, e.g.
  // POST /functions/v1/subscribe  { email, source }
  // That function reads RESEND_API_KEY and sends via Resend.
  console.info('[resend stub] subscribe request (not sent):', {
    email,
    source: payload.source ?? 'web',
  })

  return {
    ok: true,
    message:
      'Thanks — subscription stub recorded. Wire Resend via Edge Function to send confirmations.',
  }
}

/**
 * Server-side sketch (Edge Function / Node) — DO NOT import from React.
 *
 *   const key = process.env.RESEND_API_KEY
 *   await fetch('https://api.resend.com/emails', {
 *     method: 'POST',
 *     headers: {
 *       Authorization: `Bearer ${key}`,
 *       'Content-Type': 'application/json',
 *     },
 *     body: JSON.stringify({
 *       from: process.env.RESEND_FROM_EMAIL,
 *       to: email,
 *       subject: 'Welcome to The Donald Files',
 *       html: '<p>Brutal. Factual. Documented.</p>',
 *     }),
 *   })
 */
