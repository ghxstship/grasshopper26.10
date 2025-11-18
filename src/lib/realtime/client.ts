/**
 * Supabase Realtime Client
 * Shared client instance for all realtime channels
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const realtimeClient = createClient(supabaseUrl, supabaseAnonKey);
