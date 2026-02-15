import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Validate environment variables
if (!supabaseUrl) {
  console.error("❌ Missing VITE_SUPABASE_URL environment variable");
  throw new Error("Supabase URL is not configured. Please check your .env file.");
}

if (!supabaseAnonKey) {
  console.error("❌ Missing VITE_SUPABASE_ANON_KEY environment variable");
  throw new Error(
    "Supabase Anon Key is not configured. Please check your .env file."
  );
}

// Validate URL format
if (!supabaseUrl.startsWith("https://")) {
  console.error("❌ Invalid VITE_SUPABASE_URL - must start with https://");
  throw new Error("Supabase URL must be a valid HTTPS URL.");
}

// Create Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
supabase.auth
  .getSession()
  .then(({ error }) => {
    if (error) {
      console.warn("⚠️ Supabase connection issue:", error.message);
    } else {
      console.log("✅ Supabase client initialized successfully");
    }
  })
  .catch((error) => {
    console.error("❌ Failed to initialize Supabase:", error.message);
  });

export default supabase;
