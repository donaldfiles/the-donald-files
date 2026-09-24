import type { YoutubeInput } from '../lib/youtube'

/**
 * Home hybrid-ugly video exhibit rail.
 * Reed/Ink: push real WH propaganda / UN blunder clips here.
 * Empty array = rail shows “awaiting URLs” shell (still wired).
 *
 * SMOKE: one MOCK EXHIBIT with a real public White House channel video ID
 * so Pages CSP + iframe path can be verified. Ink: replace or clear.
 */
export type HomeVideoExhibit = {
  /** Loud stamp, e.g. EXHIBIT D · MOCK SMOKE */
  tag: string
  hed: string
  note: string
  video: YoutubeInput
}

/** Official White House YouTube channel clip — path proof only, not dossier evidence. */
export const SMOKE_YT_ID = 'WWDtyRXsGoI'

export const homeVideoExhibits: HomeVideoExhibit[] = [
  {
    tag: 'EXHIBIT · MOCK SMOKE',
    hed: 'Path proof — White House channel placeholder',
    note:
      'SMOKE TEST · official @WhiteHouse YouTube ID only. Not a desk claim. Ink: replace with real WH propaganda / UN blunder URLs (or clear this slot).',
    video: {
      type: 'youtube',
      id: SMOKE_YT_ID,
      title: 'White House channel (smoke-test placeholder)',
      caption: 'MOCK EXHIBIT — Ink replace',
    },
  },
]
