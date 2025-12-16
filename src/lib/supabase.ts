import { createClient } from '@supabase/supabase-js'

// Use demo values for build time if env vars not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo_key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo_service_key'

// Only create client if URL is valid
export const supabase = supabaseUrl.startsWith('http') 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any

// Server-side client with service role
export const supabaseAdmin = supabaseUrl.startsWith('http')
  ? createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null as any
