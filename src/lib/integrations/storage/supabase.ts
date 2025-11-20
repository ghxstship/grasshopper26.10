/**
 * Supabase Storage integration
 */

import { createClient } from '@supabase/supabase-js';
import { validateEnvVars, createSuccessResponse, createErrorResponse, sanitizeFilename } from '../utils';
import type { IntegrationResponse } from '../types';
import type { StorageUploadOptions, StorageDownloadOptions } from '../types';

let supabaseClient: ReturnType<typeof createClient> | null = null;

/**
 * Get Supabase client
 */
export function getSupabaseClient() {
  if (!supabaseClient) {
    validateEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });

    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return supabaseClient;
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  _options: StorageUploadOptions
): Promise<IntegrationResponse<{ path: string; url: string }>> {
  try {
    const supabase = getSupabaseClient();
    const sanitizedPath = sanitizeFilename(_options.path);

    const { data, error } = await supabase.storage
      .from(_options.bucket)
      .upload(sanitizedPath, _options.file, {
        contentType: _options.contentType,
        cacheControl: _options.cacheControl || '3600',
        upsert: _options.upsert || false,
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from(_options.bucket)
      .getPublicUrl(data.path);

    return createSuccessResponse({
      path: data.path,
      url: urlData.publicUrl,
    });
  } catch (error) {
    return createErrorResponse(
      'SUPABASE_UPLOAD_ERROR',
      error instanceof Error ? error.message : 'Failed to upload file',
      error
    );
  }
}

/**
 * Download file from Supabase Storage
 */
export async function downloadFile(
  _options: StorageDownloadOptions
): Promise<IntegrationResponse<Blob>> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.storage
      .from(_options.bucket)
      .download(_options.path);

    if (error) {
      throw error;
    }

    return createSuccessResponse( data);
  } catch (error) {
    return createErrorResponse(
      'SUPABASE_DOWNLOAD_ERROR',
      error instanceof Error ? error.message : 'Failed to download file',
      error
    );
  }
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: string, path: string): string {
  const supabase = getSupabaseClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Get signed URL for a private file
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<IntegrationResponse<{ url: string; expiresAt: number }>> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw error;
    }

    return createSuccessResponse({
      url: data.signedUrl,
      expiresAt: Date.now() + expiresIn * 1000,
    });
  } catch (error) {
    return createErrorResponse(
      'SUPABASE_SIGNED_URL_ERROR',
      error instanceof Error ? error.message : 'Failed to create signed URL',
      error
    );
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<IntegrationResponse<void>> {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw error;
    }

    return createSuccessResponse(undefined);
  } catch (error) {
    return createErrorResponse(
      'SUPABASE_DELETE_ERROR',
      error instanceof Error ? error.message : 'Failed to delete file',
      error
    );
  }
}

/**
 * List files in a bucket
 */
export async function listFiles(
  bucket: string,
  path?: string,
  _options?: {
    limit?: number;
    offset?: number;
    sortBy?: { column: string; order: 'asc' | 'desc' };
  }
): Promise<IntegrationResponse<Array<{ name: string; id: string; metadata: unknown }>>> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path, _options);

    if (error) {
      throw error;
    }

    return createSuccessResponse( data);
  } catch (error) {
    return createErrorResponse(
      'SUPABASE_LIST_ERROR',
      error instanceof Error ? error.message : 'Failed to list files',
      error
    );
  }
}

/**
 * Move file within storage
 */
export async function moveFile(
  bucket: string,
  fromPath: string,
  toPath: string
): Promise<IntegrationResponse<{ path: string }>> {
  try {
    const supabase = getSupabaseClient();

    const { data: data, error } = await supabase.storage
      .from(bucket)
      .move(fromPath, toPath);

    if (error) {
      throw error;
    }

    return createSuccessResponse({ path: toPath });
  } catch (error) {
    return createErrorResponse(
      'SUPABASE_MOVE_ERROR',
      error instanceof Error ? error.message : 'Failed to move file',
      error
    );
  }
}

/**
 * Copy file within storage
 */
export async function copyFile(
  bucket: string,
  fromPath: string,
  toPath: string
): Promise<IntegrationResponse<{ path: string }>> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.storage
      .from(bucket)
      .copy(fromPath, toPath);

    if (error) {
      throw error;
    }

    return createSuccessResponse({ path: data.path });
  } catch (error) {
    return createErrorResponse(
      'SUPABASE_COPY_ERROR',
      error instanceof Error ? error.message : 'Failed to copy file',
      error
    );
  }
}

/**
 * Create bucket
 */
export async function createBucket(
  bucketName: string,
  _options?: {
    public?: boolean;
    fileSizeLimit?: number;
    allowedMimeTypes?: string[];
  }
): Promise<IntegrationResponse<{ name: string }>> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: _options?.public || false,
      fileSizeLimit: _options?.fileSizeLimit,
      allowedMimeTypes: _options?.allowedMimeTypes,
    });

    if (error) {
      throw error;
    }

    return createSuccessResponse({ name: data.name });
  } catch (error) {
    return createErrorResponse(
      'SUPABASE_CREATE_BUCKET_ERROR',
      error instanceof Error ? error.message : 'Failed to create bucket',
      error
    );
  }
}

/**
 * Upload image with transformation
 */
export async function uploadImage(
  bucket: string,
  path: string,
  file: File | Buffer,
  _options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
): Promise<IntegrationResponse<{ path: string; url: string }>> {
  return uploadFile({
    bucket,
    path,
    file,
    contentType: 'image/jpeg',
    cacheControl: '31536000', // 1 year
  });
}
