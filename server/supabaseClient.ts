import { createClient } from '@supabase/supabase-js'
import type { Database } from '@shared/database.types'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://drfgolabfqynwkoatcim.supabase.co'
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZmdvbGFiZnF5bndrb2F0Y2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTk5MDAsImV4cCI6MjA2NjQzNTkwMH0.JLwOPIVxR46KTTPG77m91PtcJhabBLiXEg7e2qXKZHo'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZmdvbGFiZnF5bndrb2F0Y2ltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDg1OTkwMCwiZXhwIjoyMDY2NDM1OTAwfQ.a7uQ7EF5pGqeJqy35JUW4X2FwEYwuGNN5rWPPtS9JDo'

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)

export const supabaseServiceRole = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
)