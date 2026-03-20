import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
 
dotenv.config();
 
const supabaseUrl     = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY; // no VITE_ prefix in backend
 
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase credentials in supabase.js!");
  console.error("SUPABASE_URL:", supabaseUrl ? "✅" : "❌ Missing");
  console.error("SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅" : "❌ Missing");
  throw new Error("Missing required Supabase environment variables");
}
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey);