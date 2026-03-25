import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load .env here so it works regardless of import order
dotenv.config();

export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("❌ Missing Supabase credentials!");
    console.error("SUPABASE_URL:", url ? "✅ Set" : "❌ Missing");
    console.error("SUPABASE_SERVICE_ROLE_KEY:", key ? "✅ Set" : "❌ Missing");
    throw new Error("Missing required Supabase environment variables");
  }

  return createClient(url, key);
}