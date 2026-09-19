import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://zxwdmijvblrbgrdvcxnp.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_xF84w4Ew_zyAraGDkPHTSA_qiczylOR';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Supabase client instance (always connected to Supabase PostgreSQL DB)
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Helper to check if Supabase is connected
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
