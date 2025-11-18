/**
 * Supabase Storage Client
 * Provides type-safe storage operations for all buckets
 */

import { createClient } from '@supabase/supabase-js';
import { getBucketConfig, validateFileForBucket } from './buckets';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const storageClient = createClient(supabaseUrl, supabaseAnonKey);

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface DownloadResult {
  success: boolean;
  data?: Blob;
  error?: string;
}

/**
 * Upload file to storage bucket
 */
export async function uploadFile(
  bucketId: string,
  path: string,
  file: File,
  options?: {
    cacheControl?: string;
    upsert?: boolean;
  }
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFileForBucket(file, bucketId);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Upload to Supabase Storage
    const { data, error } = await storageClient.storage
      .from(bucketId)
      .upload(path, file, {
        cacheControl: options?.cacheControl || '3600',
        upsert: options?.upsert || false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Get public URL
    const config = getBucketConfig(bucketId);
    let url: string;

    if (config?.public) {
      const { data: publicData } = storageClient.storage
        .from(bucketId)
        .getPublicUrl(path);
      url = publicData.publicUrl;
    } else {
      const { data: signedData, error: signedError } = await storageClient.storage
        .from(bucketId)
        .createSignedUrl(path, 3600); // 1 hour expiry
      
      if (signedError) {
        return { success: false, error: signedError.message };
      }
      url = signedData.signedUrl;
    }

    return {
      success: true,
      url,
      path: data.path,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Upload multiple files to storage bucket
 */
export async function uploadMultipleFiles(
  bucketId: string,
  files: Array<{ path: string; file: File }>,
  options?: {
    cacheControl?: string;
    upsert?: boolean;
  }
): Promise<UploadResult[]> {
  return Promise.all(
    files.map(({ path, file }) => uploadFile(bucketId, path, file, options))
  );
}

/**
 * Download file from storage bucket
 */
export async function downloadFile(
  bucketId: string,
  path: string
): Promise<DownloadResult> {
  try {
    const { data, error } = await storageClient.storage
      .from(bucketId)
      .download(path);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Download failed',
    };
  }
}

/**
 * Delete file from storage bucket
 */
export async function deleteFile(
  bucketId: string,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await storageClient.storage
      .from(bucketId)
      .remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
}

/**
 * Delete multiple files from storage bucket
 */
export async function deleteMultipleFiles(
  bucketId: string,
  paths: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await storageClient.storage
      .from(bucketId)
      .remove(paths);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
}

/**
 * List files in storage bucket
 */
export async function listFiles(
  bucketId: string,
  path?: string,
  options?: {
    limit?: number;
    offset?: number;
    sortBy?: { column: string; order: 'asc' | 'desc' };
  }
) {
  try {
    const { data, error } = await storageClient.storage
      .from(bucketId)
      .list(path, options);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'List failed',
    };
  }
}

/**
 * Get signed URL for private file
 */
export async function getSignedUrl(
  bucketId: string,
  path: string,
  expiresIn: number = 3600
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { data, error } = await storageClient.storage
      .from(bucketId)
      .createSignedUrl(path, expiresIn);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, url: data.signedUrl };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get signed URL',
    };
  }
}

/**
 * Get public URL for public file
 */
export function getPublicUrl(bucketId: string, path: string): string {
  const { data } = storageClient.storage.from(bucketId).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Move file within bucket
 */
export async function moveFile(
  bucketId: string,
  fromPath: string,
  toPath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await storageClient.storage
      .from(bucketId)
      .move(fromPath, toPath);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Move failed',
    };
  }
}

/**
 * Copy file within bucket
 */
export async function copyFile(
  bucketId: string,
  fromPath: string,
  toPath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await storageClient.storage
      .from(bucketId)
      .copy(fromPath, toPath);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Copy failed',
    };
  }
}
