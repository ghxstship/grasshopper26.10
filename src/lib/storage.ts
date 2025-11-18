import { createClient } from '@supabase/supabase-js';

/**
 * Validate Supabase URL format
 */
function isValidSupabaseUrl(url: string | undefined): boolean {
  if (!url) return false;
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
 * Get Supabase client (lazy initialization)
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // During build time, use dummy values if config is missing/invalid
  if (!isValidSupabaseUrl(supabaseUrl) || !supabaseServiceKey || supabaseServiceKey.includes('[YOUR-')) {
    const dummyUrl = 'https://placeholder.supabase.co';
    const dummyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0NTE5MjgwMCwiZXhwIjoxOTYwNzY4ODAwfQ.placeholder';
    return createClient(dummyUrl, dummyKey);
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function uploadToSupabase(file: File, path: string): Promise<string> {
  const supabase = getSupabaseClient();
  const buffer = await file.arrayBuffer();
  const fileName = `${path}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('uploads')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function deleteFromSupabase(fileUrl: string): Promise<void> {
  const supabase = getSupabaseClient();
  // Extract path from URL
  const url = new URL(fileUrl);
  const pathParts = url.pathname.split('/');
  const bucket = pathParts[pathParts.length - 2];
  const fileName = pathParts[pathParts.length - 1];

  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

export async function getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.storage
    .from('uploads')
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`);
  }

  return data.signedUrl;
}
