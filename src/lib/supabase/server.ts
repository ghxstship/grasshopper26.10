import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

export async function createClient() {
  const cookieStore = await cookies();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build time, use dummy values if config is missing/invalid
  if (!isValidSupabaseUrl(supabaseUrl) || !supabaseAnonKey || supabaseAnonKey.includes('[YOUR-')) {
    // Return a mock client for build time
    const dummyUrl = 'https://placeholder.supabase.co';
    const dummyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder';
    return createServerClient(dummyUrl, dummyKey, {
      cookies: {
        get() { return undefined; },
        set() {},
        remove() {},
      },
    });
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Handle cookie setting errors
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Handle cookie removal errors
          }
        },
      },
    }
  );
}
