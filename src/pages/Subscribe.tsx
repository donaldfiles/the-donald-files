import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { submitSubscribe } from '../lib/subscribe'

const STATUS_COPY: Record<string, string> = {
  confirmed: 'You’re in. New files land in your inbox when they drop.',
  already: 'You’re already confirmed. Nothing else to do.',
  expired: 'That link expired. Sign up again below and we’ll send a fresh one.',
  invalid: 'That link didn’t work. Sign up again below and we’ll send a fresh one.',
  unsubscribed: 'You’re unsubscribed. No more emails from us.',
  error: 'Something broke on our end. Try the link again in a minute.',
}

export function Subscribe() {
  const [params] = useSearchParams()
  const linkStatus = params.get('status')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const renderedAt = useRef(0)

  useEffect(() => {
    renderedAt.current = Date.now()
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setStatus(null)
    const result = await submitSubscribe({
      email,
      website,
      t: renderedAt.current,
      source: 'subscribe-page',
    })
    setStatus(result.message)
    setBusy(false)
    if (result.ok) setEmail('')
  }

  return (
    <div className="page">
      <header className="page-header">
        <div className="file-label">
          FILE // <span>SUBSCRIBE</span>
        </div>
        <h1>Subscribe</h1>
        <p className="dek">
          Get new files by email when they drop. We’ll send one email to
          confirm, and every email has a one-click unsubscribe.
        </p>
      </header>

      {linkStatus && STATUS_COPY[linkStatus] ? (
        <p className="form-status form-status-banner" role="status">
          {STATUS_COPY[linkStatus]}
        </p>
      ) : null}

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
        />
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="website">Leave this empty</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <button className="btn btn-stamp" type="submit" disabled={busy}>
          {busy ? 'Sending…' : 'Subscribe'}
        </button>
        {status && (
          <p className="form-status" role="status">
            {status}
          </p>
        )}
      </form>
    </div>
  )
}
