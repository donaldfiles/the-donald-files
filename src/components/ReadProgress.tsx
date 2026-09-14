import { useEffect, useState } from 'react'

type Props = {
  targetSelector?: string
}

export function ReadProgress({ targetSelector = '.article-body' }: Props) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    function update() {
      const el = document.querySelector(targetSelector)
      if (!el) {
        const h = document.documentElement
        const max = h.scrollHeight - h.clientHeight
        setPct(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0)
        return
      }
      const rect = el.getBoundingClientRect()
      const start = window.scrollY + rect.top - window.innerHeight * 0.15
      const end = start + el.scrollHeight - window.innerHeight * 0.35
      const range = Math.max(1, end - start)
      const raw = ((window.scrollY - start) / range) * 100
      setPct(Math.min(100, Math.max(0, raw)))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [targetSelector])

  return (
    <div className="read-progress" aria-hidden="true">
      <div className="read-progress-bar" style={{ width: `${pct}%` }} />
    </div>
  )
}
