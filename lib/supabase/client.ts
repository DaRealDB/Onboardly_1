import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Switch from localStorage (persistent) to sessionStorage (temporary)
        storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
        persistSession: true, 
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  )
}