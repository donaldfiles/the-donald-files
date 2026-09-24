import {
  toNocookieEmbedUrl,
  type YoutubeInput,
} from '../lib/youtube'

export type VideoEmbedProps = YoutubeInput & {
  /** Loud home exhibit label (e.g. EXHIBIT D · MOCK SMOKE) */
  exhibitLabel?: string
  /** Visual chrome: dossier (quiet) vs home (loud) */
  variant?: 'dossier' | 'home'
  className?: string
}

/**
 * Responsive 16:9 YouTube iframe via youtube-nocookie.com.
 * YouTube-only allow attrs; fullscreen + lazy load.
 */
export function VideoEmbed({
  type = 'youtube',
  id,
  youtubeUrl,
  embedUrl,
  title,
  caption,
  exhibitLabel,
  variant = 'dossier',
  className,
}: VideoEmbedProps) {
  if (type !== 'youtube') return null

  const src = toNocookieEmbedUrl({ id, youtubeUrl, embedUrl })
  if (!src) return null

  const iframeTitle = title?.trim() || 'YouTube video exhibit'

  return (
    <figure
      className={`video-embed video-embed--${variant}${className ? ` ${className}` : ''}`}
    >
      {exhibitLabel ? (
        <div className="video-embed-label">{exhibitLabel}</div>
      ) : null}
      <div className="video-embed-frame">
        <iframe
          src={src}
          title={iframeTitle}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      {(title || caption) && (
        <figcaption className="video-embed-cap">
          {title ? <span className="video-embed-title">{title}</span> : null}
          {title && caption ? <span className="video-embed-sep"> · </span> : null}
          {caption ? <span className="video-embed-caption">{caption}</span> : null}
        </figcaption>
      )}
    </figure>
  )
}
