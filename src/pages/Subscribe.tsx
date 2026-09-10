import { useState } from 'react'
import type { FormEvent } from 'react'
import { submitSubscribe } from '../lib/resend'

export function Subscribe() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setStatus(null)
    const result = await submitSubscribe({ email, source: 'subscribe-page' })
    setStatus(result.message)
    setBusy(false)
    if (result.ok) setEmail('')
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Subscribe</h1>
        <p className="dek">
          Support the Research. Buy the Report when available. Get updates when
          files drop.
        </p>
      </header>

      <form className="subscribe-form" onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <button className="btn btn-accent" type="submit" disabled={busy}>
          {busy ? 'Submitting…' : 'Subscribe'}
        </button>
        {status && <p className="form-status" role="status">{status}</p>}
      </form>

      <section className="support-block">
        <h2>Support the Research</h2>
        <p>
          Paid report access and research support will plug in here. No “Donate”
          framing — Subscribe / Support the Research / Buy the Report only.
        </p>
        <button type="button" className="btn btn-secondary" disabled>
          Buy the Report — coming soon
        </button>
      </section>
    </div>
  )
}
