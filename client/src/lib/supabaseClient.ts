import { createClient } from '@supabase/supabase-js'
import type { Database } from '@shared/database.types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://drfgolabfqynwkoatcim.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZmdvbGFiZnF5bndrb2F0Y2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTk5MDAsImV4cCI6MjA2NjQzNTkwMH0.JLwOPIVxR46KTTPG77m91PtcJhabBLiXEg7e2qXKZHo'

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)