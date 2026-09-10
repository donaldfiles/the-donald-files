import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Browser Supabase client (anon key only).
 * Existing project ref (documented): rkudbltzydukizjtjonl
 * URL and key come from env — see .env.example
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export function getSupabase() {
  if (!supabase) {
    console.warn(
      '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — client stub inactive.',
    )
  }
  return supabase
}
