import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors,  } from '@/lib/api/response';
import { validateRequest, requireAuth,  } from '@/lib/api/middleware';
import { listFiles } from '@/lib/storage/service';
import { STORAGE_BUCKETS, type StorageBucket } from '@/lib/storage/config';

// GET /api/storage/list - List files in bucket
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const { searchParams } = new URL(request.url);
    const bucket = searchParams.get('bucket') as StorageBucket;
    const folder = searchParams.get('folder') || undefined;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!bucket) {
      throw errors.badRequest('No bucket specified');
    }

    // Validate bucket
    const validBuckets = Object.values(STORAGE_BUCKETS);
    if (!validBuckets.includes(bucket)) {
      throw errors.badRequest('Invalid bucket');
    }

    const files = await listFiles({
      bucket,
      folder,
      limit,
      offset,
    });

    return successResponse({
      files,
      count: files.length,
      bucket,
      folder,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
