/**
 * React Hooks for Storage Operations
 * Provides easy-to-use hooks for file uploads and downloads
 */

'use client';

import { useState, useCallback } from 'react';
import { uploadFile, uploadMultipleFiles, downloadFile, deleteFile, deleteMultipleFiles, listFiles, getSignedUrl, type UploadResult, type DownloadResult,  } from './client';

export interface UseUploadOptions {
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export interface UseUploadReturn {
  upload: (bucketId: string, path: string, file: File) => Promise<UploadResult>;
  uploading: boolean;
  progress: number;
  result: UploadResult | null;
  error: string | null;
  reset: () => void;
}

/**
 * Hook for uploading files
 */
export function useUpload(options?: UseUploadOptions): UseUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (bucketId: string, path: string, file: File): Promise<UploadResult> => {
      setUploading(true);
      setProgress(0);
      setError(null);

      try {
        // Simulate progress (Supabase doesn't provide upload progress)
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        const uploadResult = await uploadFile(bucketId, path, file);

        clearInterval(progressInterval);
        setProgress(100);
        setResult(uploadResult);

        if (uploadResult.success) {
          options?.onSuccess?.(uploadResult);
        } else {
          setError(uploadResult.error || 'Upload failed');
          options?.onError?.(uploadResult.error || 'Upload failed');
        }

        return uploadResult;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
        options?.onError?.(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setUploading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setResult(null);
    setError(null);
  }, []);

  return { upload, uploading, progress, result, error, reset };
}

/**
 * Hook for uploading multiple files
 */
export function useMultipleUpload(options?: UseUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (
      bucketId: string,
      files: Array<{ path: string; file: File }>
    ): Promise<UploadResult[]> => {
      setUploading(true);
      setProgress(0);
      setError(null);

      try {
        const uploadResults = await uploadMultipleFiles(bucketId, files);
        setProgress(100);
        setResults(uploadResults);

        const failedUploads = uploadResults.filter((r) => !r.success);
        if (failedUploads.length > 0) {
          const errorMessage = `${failedUploads.length} upload(s) failed`;
          setError(errorMessage);
          options?.onError?.(errorMessage);
        }

        return uploadResults;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
        options?.onError?.(errorMessage);
        return [];
      } finally {
        setUploading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setResults([]);
    setError(null);
  }, []);

  return { upload, uploading, progress, results, error, reset };
}

/**
 * Hook for downloading files
 */
export function useDownload() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = useCallback(
    async (bucketId: string, path: string, filename?: string): Promise<DownloadResult> => {
      setDownloading(true);
      setError(null);

      try {
        const result = await downloadFile(bucketId, path);

        if (result.success && result.data) {
          // Create download link
          const url = URL.createObjectURL(result.data);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename || path.split('/').pop() || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          setError(result.error || 'Download failed');
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Download failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setDownloading(false);
      }
    },
    []
  );

  return { download, downloading, error };
}

/**
 * Hook for deleting files
 */
export function useDelete() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteOne = useCallback(async (bucketId: string, path: string) => {
    setDeleting(true);
    setError(null);

    try {
      const result = await deleteFile(bucketId, path);
      if (!result.success) {
        setError(result.error || 'Delete failed');
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setDeleting(false);
    }
  }, []);

  const deleteMany = useCallback(async (bucketId: string, paths: string[]) => {
    setDeleting(true);
    setError(null);

    try {
      const result = await deleteMultipleFiles(bucketId, paths);
      if (!result.success) {
        setError(result.error || 'Delete failed');
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setDeleting(false);
    }
  }, []);

  return { deleteOne, deleteMany, deleting, error };
}

/**
 * Hook for listing files
 */
export interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, unknown>;
}

export function useListFiles(bucketId: string, path?: string) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await listFiles(bucketId, path);
      if (result.success && result.data) {
        setFiles(result.data);
      } else {
        setError(result.error || 'Failed to list files');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list files';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [bucketId, path]);

  return { files, loading, error, load };
}

/**
 * Hook for getting signed URLs
 */
export function useSignedUrl() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getUrl = useCallback(
    async (bucketId: string, path: string, expiresIn?: number) => {
      setLoading(true);
      setError(null);

      try {
        const result = await getSignedUrl(bucketId, path, expiresIn);
        if (result.success && result.url) {
          setUrl(result.url);
        } else {
          setError(result.error || 'Failed to get signed URL');
        }
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get signed URL';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { url, loading, error, getUrl };
}
