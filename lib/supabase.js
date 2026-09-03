import { createClient } from '@supabase/supabase-js';

// SUPABASE_SERVICE_KEY is the "service_role" secret key (Project Settings > API).
// It bypasses row-level security, so it must ONLY ever be used server-side
// (inside pages/api/*, scripts/*, never in client-facing code).
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
