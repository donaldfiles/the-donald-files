import type { YoutubeInput } from '../lib/youtube'

/**
 * Home hybrid-ugly video exhibit rail.
 * Real FACT exhibits for shipped WH / UN reports.
 * Empty array = rail is hidden.
 */
export type HomeVideoExhibit = {
  /** Loud stamp, e.g. EXHIBIT · TRUMP TV */
  tag: string
  hed: string
  note: string
  video: YoutubeInput
  /** Optional Open Dossier link to the matching REPORT */
  reportSlug?: string
}

export const homeVideoExhibits: HomeVideoExhibit[] = [
  {
    tag: 'EXHIBIT · TRUMP TV',
    hed: 'He banned the pool, then launched Trump TV on YouTube',
    note:
      '21 Sep 2026 · official WH YouTube livestream “TRUMP TV: The Essentials Station” (CH 47) — same week CNN / MS NOW / Politico shut out of the pool.',
    video: {
      type: 'youtube',
      id: 'A4gNgHfZ-v4',
      title: 'TRUMP TV: The Essentials Station (official WH)',
      caption: 'CH 47 · Trump TV 24/7',
    },
    reportSlug: 'wh-youtube-trump-tv',
  },
  {
    tag: 'EXHIBIT · UN LAUGH',
    hed: 'UNGA’s greatest hits: the laugh track and the broken teleprompter',
    note:
      'AP 2018 — chamber laughs at Trump’s “accomplished more than almost any administration” boast. Full UN blunder file linked.',
    video: {
      type: 'youtube',
      id: '-z4y8OJxlK8',
      title: 'AP — Trump boast gets laugh at UN (2018)',
      caption: 'UNGA laugh track',
    },
    reportSlug: 'trump-un-blunders',
  },
]
