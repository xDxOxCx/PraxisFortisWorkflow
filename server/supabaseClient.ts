import { createClient } from '@supabase/supabase-js'
import type { Database } from '@shared/database.types'

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable')
}

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export const supabaseServiceRole = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)