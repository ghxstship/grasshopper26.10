import { useState, useCallback } from 'react';
import type { StorageBucket } from '@/lib/storage/config';
import { validateFileForBucket } from '@/lib/storage/config';

export interface UseFileUploadOptions {
  bucket: StorageBucket;
  folder?: string;
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
}

export interface UploadResult {
  path: string;
  url: string;
  bucket: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export function useUpload(options: UseFileUploadOptions) {
  return useFileUpload(options);
}

export function useFileUpload(options: UseFileUploadOptions) {
  const { bucket, folder, onSuccess, onError } = options;
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const upload = useCallback(async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Validate file
      const validation = validateFileForBucket(file, bucket);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      // Upload to API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      setProgress(100);
      
      if (onSuccess) {
        onSuccess(result.data);
      }
      
      return result.data;
    } catch (err) {
      const uploadError = err as Error;
      setError(uploadError);
      if (onError) {
        onError(uploadError);
      }
      throw uploadError;
    } finally {
      setIsUploading(false);
    }
  }, [bucket, folder, onSuccess, onError]);

  const uploadMultiple = useCallback(async (files: File[]): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      const result = await upload(file);
      results.push(result);
    }
    
    return results;
  }, [upload]);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    upload,
    uploadMultiple,
    reset,
    isUploading,
    progress,
    error,
  };
}
