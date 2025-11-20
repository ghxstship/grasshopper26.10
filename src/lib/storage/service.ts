/**
 * Storage service layer for file operations
 */

import { createClient } from '@supabase/supabase-js';
import type { StorageBucket } from './config';
import { validateFileForBucket, generateStoragePath, getBucketConfig } from './config';

// Initialize Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing');
  }

  return createClient(supabaseUrl, supabaseKey);
}

export interface UploadOptions {
  bucket: StorageBucket;
  userId: string;
  file: File;
  folder?: string;
  onProgress?: (progress: number) => void;
}

export interface UploadResult {
  path: string;
  url: string;
  bucket: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface DownloadOptions {
  bucket: StorageBucket;
  path: string;
}

export interface DeleteOptions {
  bucket: StorageBucket;
  path: string;
}

export interface ListOptions {
  bucket: StorageBucket;
  folder?: string;
  limit?: number;
  offset?: number;
}

export interface StorageFile {
  name: string;
  id: string;
  size: number;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
  url: string;
}

/**
 * Upload file to storage
 */
export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const { bucket, userId, file, folder, onProgress: onProgress } = options;

  // Validate file
  const validation = validateFileForBucket(file, bucket);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Generate storage path
  const path = generateStoragePath(userId, file.name, folder);

  // Get Supabase client
  const supabase = getSupabaseClient();

  // Upload file
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const config = getBucketConfig(bucket);
  let url: string;

  if (config.public) {
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    url = urlData.publicUrl;
  } else {
    // For private buckets, generate signed URL (valid for 1 hour)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(data.path, 3600);

    if (urlError) {
      throw new Error(`Failed to generate URL: ${urlError.message}`);
    }

    url = urlData.signedUrl;
  }

  return {
    path: data.path,
    url,
    bucket,
    size: file.size,
    mimeType: file.type,
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  options: Omit<UploadOptions, 'file'> & { files: File[] }
): Promise<UploadResult[]> {
  const { files, ...baseOptions } = options;
  const results: UploadResult[] = [];

  for (const file of files) {
    const result = await uploadFile({ ...baseOptions, file });
    results.push(result);
  }

  return results;
}

/**
 * Download file from storage
 */
export async function downloadFile(options: DownloadOptions): Promise<Blob> {
  const { bucket, path } = options;

  const supabase = getSupabaseClient();

  const { data, error } = await supabase.storage.from(bucket).download(path);

  if (error) {
    throw new Error(`Download failed: ${error.message}`);
  }

  return data;
}

/**
 * Delete file from storage
 */
export async function deleteFile(options: DeleteOptions): Promise<void> {
  const { bucket, path } = options;

  const supabase = getSupabaseClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Delete multiple files
 */
export async function deleteMultipleFiles(
  bucket: StorageBucket,
  paths: string[]
): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.storage.from(bucket).remove(paths);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * List files in a bucket folder
 */
export async function listFiles(options: ListOptions): Promise<StorageFile[]> {
  const { bucket, folder, limit = 100, offset = 0 } = options;

  const supabase = getSupabaseClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder, {
      limit,
      offset,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    throw new Error(`List failed: ${error.message}`);
  }

  // Get URLs for each file
  const config = getBucketConfig(bucket);
  const files: StorageFile[] = [];

  for (const item of data) {
    const filePath = folder ? `${folder}/${item.name}` : item.name;
    let url: string;

    if (config.public) {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      url = urlData.publicUrl;
    } else {
      const { data: urlData, error: urlError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 3600);

      if (urlError) {
        console.error(`Failed to generate URL for ${filePath}:`, urlError);
        continue;
      }

      url = urlData.signedUrl;
    }

    files.push({
      name: item.name,
      id: item.id,
      size: item.metadata?.size || 0,
      mimeType: item.metadata?.mimetype || 'application/octet-stream',
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      url,
    });
  }

  return files;
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const supabase = getSupabaseClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Get signed URL for a private file
 */
export async function getSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * Move file within storage
 */
export async function moveFile(
  bucket: StorageBucket,
  fromPath: string,
  toPath: string
): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.storage.from(bucket).move(fromPath, toPath);

  if (error) {
    throw new Error(`Move failed: ${error.message}`);
  }
}

/**
 * Copy file within storage
 */
export async function copyFile(
  bucket: StorageBucket,
  fromPath: string,
  toPath: string
): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.storage.from(bucket).copy(fromPath, toPath);

  if (error) {
    throw new Error(`Copy failed: ${error.message}`);
  }
}

/**
 * Check if file exists
 */
export async function fileExists(bucket: StorageBucket, path: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.storage.from(bucket).list(path);
    return !error && data.length > 0;
  } catch {
    return false;
  }
}

/**
 * Get file metadata
 */
export async function getFileMetadata(
  bucket: StorageBucket,
  path: string
): Promise<{ size: number; mimeType: string; lastModified: string } | null> {
  try {
    const supabase = getSupabaseClient();
    const folder = path.substring(0, path.lastIndexOf('/'));
    const filename = path.substring(path.lastIndexOf('/') + 1);

    const { data, error } = await supabase.storage.from(bucket).list(folder);

    if (error || !data) {
      return null;
    }

    const file = data.find((f) => f.name === filename);

    if (!file) {
      return null;
    }

    return {
      size: file.metadata?.size || 0,
      mimeType: file.metadata?.mimetype || 'application/octet-stream',
      lastModified: file.updated_at,
    };
  } catch {
    return null;
  }
}
