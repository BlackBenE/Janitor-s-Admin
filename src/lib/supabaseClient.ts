import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // Fixed variable name
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY; // Service role for admin operations

// Debug environment variables in development
if (import.meta.env.DEV) {
  console.log("Supabase Config:", {
    url: supabaseUrl ? "✅ Set" : "❌ Missing",
    key: supabaseAnonKey ? "✅ Set" : "❌ Missing",
    serviceKey: supabaseServiceKey ? "✅ Set" : "❌ Missing",
    urlValue: supabaseUrl,
    keyPreview: supabaseAnonKey
      ? `${supabaseAnonKey.substring(0, 20)}...`
      : "undefined",
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

// Standard client for regular operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role (bypasses RLS)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
