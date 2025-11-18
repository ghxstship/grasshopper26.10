/**
 * File Service
 * Handles file uploads and management via Supabase Storage
 */

import { createClient } from '@supabase/supabase-js';
import { BaseService, ServiceResult } from '../base/BaseService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export interface UploadFileInput {
  bucket: string;
  path: string;
  file: File | Buffer;
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
}

export interface FileMetadata {
  id: string;
  name: string;
  bucket: string;
  path: string;
  size: number;
  contentType: string;
  url: string;
  createdAt: Date;
}

export class FileService extends BaseService {
  /**
   * Upload a file to Supabase Storage
   */
  async upload(input: UploadFileInput): Promise<ServiceResult<FileMetadata>> {
    return this.execute(async () => {
      const { data, error } = await supabase.storage
        .from(input.bucket)
        .upload(input.path, input.file, {
          contentType: input.contentType,
          cacheControl: input.cacheControl || '3600',
          upsert: input.upsert || false,
        });

      if (error) {
        throw {
          name: 'StorageError',
          message: error.message,
          details: error,
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(input.bucket)
        .getPublicUrl(data.path);

      const metadata: FileMetadata = {
        id: data.id || this.generateId(),
        name: input.path.split('/').pop() || input.path,
        bucket: input.bucket,
        path: data.path,
        size: 0, // Size not returned by Supabase
        contentType: input.contentType || 'application/octet-stream',
        url: urlData.publicUrl,
        createdAt: new Date(),
      };

      return metadata;
    }, 'upload');
  }

  /**
   * Upload multiple files
   */
  async uploadMultiple(files: UploadFileInput[]): Promise<ServiceResult<FileMetadata[]>> {
    return this.execute(async () => {
      const results = await Promise.all(
        files.map(file => this.upload(file))
      );

      const successful = results
        .filter(r => r.success)
        .map(r => r.data as FileMetadata);

      const failed = results.filter(r => !r.success);
      if (failed.length > 0) {
        console.warn(`[FileService] ${failed.length} uploads failed`);
      }

      return successful;
    }, 'uploadMultiple');
  }

  /**
   * Delete a file
   */
  async delete(bucket: string, path: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw {
          name: 'StorageError',
          message: error.message,
          details: error,
        };
      }
    }, 'delete');
  }

  /**
   * Delete multiple files
   */
  async deleteMultiple(bucket: string, paths: string[]): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const { error } = await supabase.storage
        .from(bucket)
        .remove(paths);

      if (error) {
        throw {
          name: 'StorageError',
          message: error.message,
          details: error,
        };
      }
    }, 'deleteMultiple');
  }

  /**
   * Get signed URL for private file
   */
  async getSignedUrl(
    bucket: string,
    path: string,
    expiresIn = 3600
  ): Promise<ServiceResult<string>> {
    return this.execute(async () => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) {
        throw {
          name: 'StorageError',
          message: error.message,
          details: error,
        };
      }

      return data.signedUrl;
    }, 'getSignedUrl');
  }

  /**
   * List files in a bucket path
   */
  async list(bucket: string, path = ''): Promise<ServiceResult<FileMetadata[]>> {
    return this.execute(async () => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path);

      if (error) {
        throw {
          name: 'StorageError',
          message: error.message,
          details: error,
        };
      }

      const files: FileMetadata[] = data.map(file => ({
        id: file.id || this.generateId(),
        name: file.name,
        bucket,
        path: `${path}/${file.name}`.replace(/^\//, ''),
        size: 0,
        contentType: file.metadata?.mimetype || 'application/octet-stream',
        url: '',
        createdAt: new Date(file.created_at || Date.now()),
      }));

      return files;
    }, 'list');
  }

  /**
   * Move/rename a file
   */
  async move(
    bucket: string,
    fromPath: string,
    toPath: string
  ): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const { error } = await supabase.storage
        .from(bucket)
        .move(fromPath, toPath);

      if (error) {
        throw {
          name: 'StorageError',
          message: error.message,
          details: error,
        };
      }
    }, 'move');
  }

  /**
   * Copy a file
   */
  async copy(
    bucket: string,
    fromPath: string,
    toPath: string
  ): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const { error } = await supabase.storage
        .from(bucket)
        .copy(fromPath, toPath);

      if (error) {
        throw {
          name: 'StorageError',
          message: error.message,
          details: error,
        };
      }
    }, 'copy');
  }

  /**
   * Create a storage bucket
   */
  async createBucket(
    name: string,
    options?: { public?: boolean; fileSizeLimit?: number }
  ): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const { error } = await supabase.storage.createBucket(name, {
        public: options?.public || false,
        fileSizeLimit: options?.fileSizeLimit,
      });

      if (error) {
        throw {
          name: 'StorageError',
          message: error.message,
          details: error,
        };
      }
    }, 'createBucket');
  }

  /**
   * Get bucket details
   */
  async getBucket(name: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const { data, error } = await supabase.storage.getBucket(name);

      if (error) {
        throw {
          name: 'StorageError',
          message: error.message,
          details: error,
        };
      }

      return data;
    }, 'getBucket');
  }
}
