import { createClient } from '@supabase/supabase-js';

// Server-only client using the service-role key, which bypasses RLS.
// Never import this from a client component.
let client;

export function supabaseAdmin() {
  if (!client) {
    client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return client;
}
