/**
 * Storage module exports
 */

// Primary exports - new implementation
export * from './buckets';
export * from './client';
export * from './hooks';

// Legacy exports - existing implementation
export { STORAGE_BUCKETS, BUCKET_CONFIGS, type StorageBucket } from './config';
export type { BucketConfig as LegacyBucketConfig } from './config';
export * from './types';
export * from './errors';
