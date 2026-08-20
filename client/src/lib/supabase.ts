import { createClient } from "@supabase/supabase-js";

const configuredUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const projectUrl = configuredUrl?.replace(/\/?rest\/v1\/?$/, "");

/**
 * Browser-safe Supabase client. It has no service-role access and is reserved
 * for future public read-only capabilities; the current demo uses tRPC so all
 * monitoring writes remain on the server.
 */
export const supabaseBrowser = projectUrl && publishableKey
  ? createClient(projectUrl, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;
