/**
 * Storage Bucket Configuration
 * Defines all Supabase storage buckets with their policies and configurations
 */

export interface BucketConfig {
  id: string;
  name: string;
  public: boolean;
  fileSizeLimit: number;
  allowedMimeTypes: string[];
  description: string;
}

/**
 * GVTEWAY Storage Buckets
 */
export const GVTEWAY_BUCKETS: Record<string, BucketConfig> = {
  AVATARS: {
    id: 'gvteway-avatars',
    name: 'gvteway-avatars',
    public: true,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ],
    description: 'User profile avatars',
  },
  DOCUMENTS: {
    id: 'gvteway-documents',
    name: 'gvteway-documents',
    public: false,
    fileSizeLimit: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    description: 'User documents and files',
  },
  ATTACHMENTS: {
    id: 'gvteway-attachments',
    name: 'gvteway-attachments',
    public: false,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
    ],
    description: 'General attachments',
  },
};

/**
 * COMPVSS Storage Buckets
 */
export const COMPVSS_BUCKETS: Record<string, BucketConfig> = {
  ADVANCING: {
    id: 'compvss-advancing',
    name: 'compvss-advancing',
    public: false,
    fileSizeLimit: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    description: 'Advancing request documents',
  },
  CREDENTIALS: {
    id: 'compvss-credentials',
    name: 'compvss-credentials',
    public: false,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ],
    description: 'User credentials and certifications',
  },
  CONTRACTS: {
    id: 'compvss-contracts',
    name: 'compvss-contracts',
    public: false,
    fileSizeLimit: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    description: 'Contract documents',
  },
};

/**
 * ATLVS Storage Buckets
 */
export const ATLVS_BUCKETS: Record<string, BucketConfig> = {
  ADVANCING: {
    id: 'atlvs-advancing',
    name: 'atlvs-advancing',
    public: false,
    fileSizeLimit: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    description: 'ATLVS advancing request documents',
  },
  ASSETS: {
    id: 'atlvs-assets',
    name: 'atlvs-assets',
    public: false,
    fileSizeLimit: 100 * 1024 * 1024, // 100MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/pdf',
    ],
    description: 'Asset photos and specifications',
  },
  PROJECTS: {
    id: 'atlvs-projects',
    name: 'atlvs-projects',
    public: false,
    fileSizeLimit: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    description: 'Project files and reports',
  },
  BUDGETS: {
    id: 'atlvs-budgets',
    name: 'atlvs-budgets',
    public: false,
    fileSizeLimit: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ],
    description: 'Budget spreadsheets and invoices',
  },
};

/**
 * All buckets combined
 */
export const ALL_BUCKETS: Record<string, BucketConfig> = {
  ...GVTEWAY_BUCKETS,
  ...COMPVSS_BUCKETS,
  ...ATLVS_BUCKETS,
};

/**
 * Get bucket configuration by ID
 */
export function getBucketConfig(bucketId: string): BucketConfig | undefined {
  return ALL_BUCKETS[Object.keys(ALL_BUCKETS).find(
    key => ALL_BUCKETS[key].id === bucketId
  ) || ''];
}

/**
 * Validate file against bucket configuration
 */
export function validateFileForBucket(
  file: File,
  bucketId: string
): { valid: boolean; error?: string } {
  const config = getBucketConfig(bucketId);
  
  if (!config) {
    return { valid: false, error: 'Invalid bucket ID' };
  }

  if (file.size > config.fileSizeLimit) {
    return {
      valid: false,
      error: `File size exceeds ${config.fileSizeLimit / 1024 / 1024}MB limit`,
    };
  }

  if (!config.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} not allowed for this bucket`,
    };
  }

  return { valid: true };
}
