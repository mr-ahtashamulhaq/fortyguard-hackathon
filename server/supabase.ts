import { createClient } from "@supabase/supabase-js";

// The schema lives in the external Supabase project. Runtime services use this
// boundary until generated database types are added in the next API pass.
let supabaseAdmin: any = null;

export function getSupabaseAdmin() {
  if (supabaseAdmin) return supabaseAdmin;
  const configuredUrl = process.env.VITE_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!configuredUrl || !secretKey) return null;
  const url = configuredUrl.replace(/\/?rest\/v1\/?$/, "");
  supabaseAdmin = createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
  return supabaseAdmin;
}
