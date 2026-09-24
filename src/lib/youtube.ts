/** Normalize YouTube watch / share / embed URLs to privacy-friendly nocookie embeds. */

const YT_ID_RE = /^[a-zA-Z0-9_-]{11}$/

export type YoutubeInput = {
  type?: 'youtube'
  /** Raw 11-character YouTube video id */
  id?: string
  /** watch?v= / youtu.be / shorts / embed URL */
  youtubeUrl?: string
  /** Already an https embed URL (youtube.com or youtube-nocookie.com) */
  embedUrl?: string
  title?: string
  caption?: string
  /**
   * Insert after this 0-based body paragraph index on article pages.
   * Omit to place after the last body graf (before SOURCE FILES).
   */
  afterBodyIndex?: number
}

export function extractYoutubeId(raw: string): string | null {
  const s = raw.trim()
  if (YT_ID_RE.test(s)) return s

  try {
    const u = new URL(s)
    const host = u.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id && YT_ID_RE.test(id) ? id : null
    }

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      const v = u.searchParams.get('v')
      if (v && YT_ID_RE.test(v)) return v

      const parts = u.pathname.split('/').filter(Boolean)
      // /embed/ID, /shorts/ID, /live/ID, /v/ID
      if (
        parts.length >= 2 &&
        ['embed', 'shorts', 'live', 'v'].includes(parts[0])
      ) {
        const id = parts[1]
        return id && YT_ID_RE.test(id) ? id : null
      }
    }
  } catch {
    // not a URL
  }

  // Fallback: last 11-char token that looks like an id
  const m = s.match(/(?:^|[/?=])([a-zA-Z0-9_-]{11})(?:$|[?&#])/ )
  return m && YT_ID_RE.test(m[1]) ? m[1] : null
}

/**
 * Resolve a privacy-friendly embed URL.
 * Accepts id, youtubeUrl, or embedUrl; always returns youtube-nocookie.com when possible.
 */
export function toNocookieEmbedUrl(input: YoutubeInput): string | null {
  if (input.embedUrl) {
    const id = extractYoutubeId(input.embedUrl)
    if (id) return `https://www.youtube-nocookie.com/embed/${id}`
  }
  if (input.youtubeUrl) {
    const id = extractYoutubeId(input.youtubeUrl)
    if (id) return `https://www.youtube-nocookie.com/embed/${id}`
  }
  if (input.id && YT_ID_RE.test(input.id.trim())) {
    return `https://www.youtube-nocookie.com/embed/${input.id.trim()}`
  }
  return null
}

export function resolveYoutubeId(input: YoutubeInput): string | null {
  if (input.id && YT_ID_RE.test(input.id.trim())) return input.id.trim()
  if (input.youtubeUrl) return extractYoutubeId(input.youtubeUrl)
  if (input.embedUrl) return extractYoutubeId(input.embedUrl)
  return null
}
