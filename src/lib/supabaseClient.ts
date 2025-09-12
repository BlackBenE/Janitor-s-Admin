import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // Fixed variable name

// Debug environment variables in development
if (import.meta.env.DEV) {
  console.log("Supabase Config:", {
    url: supabaseUrl ? "✅ Set" : "❌ Missing",
    key: supabaseAnonKey ? "✅ Set" : "❌ Missing",
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

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
