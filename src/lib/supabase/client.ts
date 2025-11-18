/**
 * Supabase Client
 * Centralized Supabase client initialization
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

/**
 * Validate Supabase URL format
 */
function isValidSupabaseUrl(url: string | undefined): boolean {
  if (!url) return false;
  // Check if URL contains placeholder or is malformed
  if (url.includes('[YOUR-PROJECT-REF]') || url.includes('[') || url.includes(']')) {
    return false;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.includes('supabase.co');
  } catch {
    return false;
  }
}

/**
 * Get or create Supabase client
 */
export function createClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build time, use dummy values if config is missing/invalid
  if (!isValidSupabaseUrl(supabaseUrl) || !supabaseAnonKey || supabaseAnonKey.includes('[YOUR-')) {
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      throw new Error('Missing or invalid Supabase environment variables');
    }
    // Return a mock client for build time
    const dummyUrl = 'https://placeholder.supabase.co';
    const dummyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';
    supabaseClient = createSupabaseClient(dummyUrl, dummyKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    return supabaseClient;
  }

  supabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return supabaseClient;
}

/**
 * Get admin client (server-side only)
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // During build time, use dummy values if config is missing/invalid
  if (!isValidSupabaseUrl(supabaseUrl) || !supabaseServiceKey || supabaseServiceKey.includes('[YOUR-')) {
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      throw new Error('Missing or invalid Supabase admin credentials');
    }
    // Return a mock client for build time
    const dummyUrl = 'https://placeholder.supabase.co';
    const dummyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0NTE5MjgwMCwiZXhwIjoxOTYwNzY4ODAwfQ.placeholder';
    return createSupabaseClient(dummyUrl, dummyKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
