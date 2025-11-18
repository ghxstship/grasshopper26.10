/**
 * Storage types and interfaces
 */

import type { StorageBucket } from './config';

export interface StorageErrorInfo {
  code: string;
  message: string;
  details?: unknown;
}

export interface StorageUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface StorageMetadata {
  size: number;
  mimeType: string;
  lastModified: string;
  customMetadata?: Record<string, string>;
}

export interface StorageFileInfo {
  name: string;
  path: string;
  bucket: StorageBucket;
  size: number;
  mimeType: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface StorageUploadResponse {
  success: boolean;
  data?: {
    path: string;
    url: string;
    bucket: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
  };
  error?: StorageErrorInfo;
}

export interface StorageDeleteResponse {
  success: boolean;
  message?: string;
  error?: StorageErrorInfo;
}

export interface StorageListResponse {
  success: boolean;
  data?: {
    files: StorageFileInfo[];
    count: number;
    bucket: string;
    folder?: string;
  };
  error?: StorageErrorInfo;
}

export interface StorageDownloadResponse {
  success: boolean;
  data?: Blob;
  error?: StorageErrorInfo;
}

/**
 * Storage operation result type
 */
export type StorageResult<T> =
  | { success: true; data: T }
  | { success: false; error: StorageErrorInfo };

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * Bucket statistics
 */
export interface BucketStats {
  bucket: StorageBucket;
  totalFiles: number;
  totalSize: number;
  lastModified: string;
}

/**
 * Storage quota information
 */
export interface StorageQuota {
  used: number;
  limit: number;
  percentage: number;
  available: number;
}
