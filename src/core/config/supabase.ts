import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // Fixed variable name
// ATTENTION: la Service Role Key ne doit jamais être utilisée côté navigateur.
// On la lit éventuellement pour debug local mais on n'initialise aucun client avec.
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string | undefined; // Service role (IGNORED client-side)

// Debug environment variables in development
if (import.meta.env.DEV) {

}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Standard client for regular operations
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role (bypasses RLS)
// Ne PAS exposer de client admin côté client
export const supabaseAdmin = null;

// Export type for reuse
export type { SupabaseClient };
