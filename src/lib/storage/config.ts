/**
 * Storage configuration and bucket definitions
 */

export const STORAGE_BUCKETS = {
  // GVTEWAY buckets
  GVTEWAY_AVATARS: 'gvteway-avatars',
  GVTEWAY_DOCUMENTS: 'gvteway-documents',
  GVTEWAY_ATTACHMENTS: 'gvteway-attachments',
  
  // COMPVSS buckets
  COMPVSS_ADVANCING: 'compvss-advancing',
  COMPVSS_CREDENTIALS: 'compvss-credentials',
  COMPVSS_CONTRACTS: 'compvss-contracts',
  
  // ATLVS buckets
  ATLVS_ADVANCING: 'atlvs-advancing',
  ATLVS_ASSETS: 'atlvs-assets',
  ATLVS_PROJECTS: 'atlvs-projects',
} as const;

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];

export interface BucketConfig {
  name: string;
  maxSize: number; // in bytes
  allowedTypes: string[];
  public: boolean;
  description: string;
}

export const BUCKET_CONFIGS: Record<StorageBucket, BucketConfig> = {
  [STORAGE_BUCKETS.GVTEWAY_AVATARS]: {
    name: 'GVTEWAY Avatars',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    public: true,
    description: 'User profile avatars',
  },
  [STORAGE_BUCKETS.GVTEWAY_DOCUMENTS]: {
    name: 'GVTEWAY Documents',
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    public: false,
    description: 'User documents and files',
  },
  [STORAGE_BUCKETS.GVTEWAY_ATTACHMENTS]: {
    name: 'GVTEWAY Attachments',
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
    ],
    public: false,
    description: 'General file attachments',
  },
  [STORAGE_BUCKETS.COMPVSS_ADVANCING]: {
    name: 'COMPVSS Advancing',
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    public: false,
    description: 'COMPVSS advancing request files',
  },
  [STORAGE_BUCKETS.COMPVSS_CREDENTIALS]: {
    name: 'COMPVSS Credentials',
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    public: false,
    description: 'User credentials and certifications',
  },
  [STORAGE_BUCKETS.COMPVSS_CONTRACTS]: {
    name: 'COMPVSS Contracts',
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    public: false,
    description: 'Contract documents',
  },
  [STORAGE_BUCKETS.ATLVS_ADVANCING]: {
    name: 'ATLVS Advancing',
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    public: false,
    description: 'ATLVS advancing request files',
  },
  [STORAGE_BUCKETS.ATLVS_ASSETS]: {
    name: 'ATLVS Assets',
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/pdf',
    ],
    public: false,
    description: 'Asset images and documentation',
  },
  [STORAGE_BUCKETS.ATLVS_PROJECTS]: {
    name: 'ATLVS Projects',
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    public: false,
    description: 'Project files and documentation',
  },
};

/**
 * Get bucket configuration
 */
export function getBucketConfig(bucket: StorageBucket): BucketConfig {
  return BUCKET_CONFIGS[bucket];
}

/**
 * Validate file against bucket configuration
 */
export function validateFileForBucket(
  file: File,
  bucket: StorageBucket
): { valid: boolean; error?: string } {
  const config = getBucketConfig(bucket);

  // Check file size
  if (file.size > config.maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${formatBytes(config.maxSize)}`,
    };
  }

  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${config.allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Generate storage path for user file
 */
export function generateStoragePath(
  userId: string,
  filename: string,
  folder?: string
): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  if (folder) {
    return `${userId}/${folder}/${timestamp}-${sanitizedFilename}`;
  }
  
  return `${userId}/${timestamp}-${sanitizedFilename}`;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Check if file is an image
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Check if file is a document
 */
export function isDocumentFile(mimeType: string): boolean {
  return (
    mimeType === 'application/pdf' ||
    mimeType === 'application/msword' ||
    mimeType.includes('officedocument')
  );
}
