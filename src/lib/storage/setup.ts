/**
 * Storage Bucket Setup Script
 * Initializes all 10 storage buckets with proper configurations
 */

import { createClient } from '@supabase/supabase-js';
import { ALL_BUCKETS, type BucketConfig } from './buckets';

interface SetupResult {
  success: boolean;
  bucket: string;
  message: string;
  error?: string;
}

/**
 * Get Supabase admin client
 */
function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Create a single bucket
 */
async function createBucket(
  supabase: any,
  config: BucketConfig
): Promise<SetupResult> {
  try {
    // Check if bucket exists
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      throw new Error(`Failed to list buckets: ${listError.message}`);
    }

    const bucketExists = existingBuckets?.some((b) => b.id === config.id);

    if (bucketExists) {
      // Update existing bucket
      const { error: updateError } = await supabase.storage.updateBucket(config.id, {
        public: config.public,
        fileSizeLimit: config.fileSizeLimit,
        allowedMimeTypes: config.allowedMimeTypes,
      });

      if (updateError) {
        throw new Error(`Failed to update bucket: ${updateError.message}`);
      }

      return {
        success: true,
        bucket: config.id,
        message: `Updated existing bucket: ${config.name}`,
      };
    }

    // Create new bucket
    const { error: createError } = await supabase.storage.createBucket(config.id, {
      public: config.public,
      fileSizeLimit: config.fileSizeLimit,
      allowedMimeTypes: config.allowedMimeTypes,
    });

    if (createError) {
      throw new Error(`Failed to create bucket: ${createError.message}`);
    }

    return {
      success: true,
      bucket: config.id,
      message: `Created new bucket: ${config.name}`,
    };
  } catch (error) {
    return {
      success: false,
      bucket: config.id,
      message: `Failed to setup bucket: ${config.name}`,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Setup all storage buckets
 */
export async function setupAllBuckets(): Promise<{
  total: number;
  successful: number;
  failed: number;
  results: SetupResult[];
}> {
  console.log('🚀 Starting storage bucket setup...\n');

  const supabase = getAdminClient();
  const results: SetupResult[] = [];

  // Process each bucket
  for (const config of Object.values(ALL_BUCKETS)) {
    console.log(`Processing: ${config.name}...`);
    const result = await createBucket(supabase, config);
    results.push(result);

    if (result.success) {
      console.log(`✅ ${result.message}`);
    } else {
      console.error(`❌ ${result.message}`);
      if (result.error) {
        console.error(`   Error: ${result.error}`);
      }
    }
  }

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log('\n📊 Setup Summary:');
  console.log(`   Total buckets: ${results.length}`);
  console.log(`   ✅ Successful: ${successful}`);
  console.log(`   ❌ Failed: ${failed}`);

  return {
    total: results.length,
    successful,
    failed,
    results,
  };
}

/**
 * Verify all buckets exist
 */
export async function verifyBuckets(): Promise<{
  allExist: boolean;
  missing: string[];
  existing: string[];
}> {
  const supabase = getAdminClient();
  const { data: existingBuckets, error } = await supabase.storage.listBuckets();

  if (error) {
    throw new Error(`Failed to list buckets: ${error.message}`);
  }

  const existingIds = new Set(existingBuckets?.map((b) => b.id) || []);
  const requiredIds = Object.values(ALL_BUCKETS).map((b) => b.id);

  const existing = requiredIds.filter((id) => existingIds.has(id));
  const missing = requiredIds.filter((id) => !existingIds.has(id));

  return {
    allExist: missing.length === 0,
    missing,
    existing,
  };
}

/**
 * Get bucket statistics
 */
export async function getBucketStats(): Promise<
  Array<{
    bucket: string;
    fileCount: number;
    totalSize: number;
  }>
> {
  const supabase = getAdminClient();
  const stats: Array<{ bucket: string; fileCount: number; totalSize: number }> = [];

  for (const config of Object.values(ALL_BUCKETS)) {
    try {
      const { data: files, error } = await supabase.storage.from(config.id).list();

      if (error) {
        console.error(`Failed to list files in ${config.id}:`, error.message);
        continue;
      }

      const fileCount = files?.length || 0;
      const totalSize = files?.reduce((sum, file) => sum + (file.metadata?.size || 0), 0) || 0;

      stats.push({
        bucket: config.id,
        fileCount,
        totalSize,
      });
    } catch (error) {
      console.error(`Error getting stats for ${config.id}:`, error);
    }
  }

  return stats;
}

/**
 * Delete all files in a bucket (DANGEROUS - use with caution)
 */
export async function clearBucket(bucketId: string): Promise<{
  success: boolean;
  deletedCount: number;
  error?: string;
}> {
  try {
    const supabase = getAdminClient();

    // List all files
    const { data: files, error: listError } = await supabase.storage.from(bucketId).list();

    if (listError) {
      throw new Error(`Failed to list files: ${listError.message}`);
    }

    if (!files || files.length === 0) {
      return {
        success: true,
        deletedCount: 0,
      };
    }

    // Delete all files
    const filePaths = files.map((f) => f.name);
    const { error: deleteError } = await supabase.storage.from(bucketId).remove(filePaths);

    if (deleteError) {
      throw new Error(`Failed to delete files: ${deleteError.message}`);
    }

    return {
      success: true,
      deletedCount: files.length,
    };
  } catch (error) {
    return {
      success: false,
      deletedCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * CLI runner
 */
if (require.main === module) {
  (async () => {
    try {
      const result = await setupAllBuckets();

      if (result.failed > 0) {
        process.exit(1);
      }

      console.log('\n✨ All buckets setup successfully!');
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Setup failed:', error);
      process.exit(1);
    }
  })();
}
