import { NextRequest } from 'next/server';
import { handleApiError, errors,  } from '@/lib/api/response';
import { validateRequest, requireAuth,  } from '@/lib/api/middleware';
import { downloadFile } from '@/lib/storage/service';
import { STORAGE_BUCKETS, type StorageBucket } from '@/lib/storage/config';

// GET /api/storage/download - Download file
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const { searchParams } = new URL(request.url);
    const bucket = searchParams.get('bucket') as StorageBucket;
    const path = searchParams.get('path');

    if (!bucket) {
      throw errors.badRequest('No bucket specified');
    }

    if (!path) {
      throw errors.badRequest('No path specified');
    }

    // Validate bucket
    const validBuckets = Object.values(STORAGE_BUCKETS);
    if (!validBuckets.includes(bucket)) {
      throw errors.badRequest('Invalid bucket');
    }

    const blob = await downloadFile({ bucket, path });

    // Return file as response
    return new Response(blob, {
      headers: {
        'Content-Type': blob.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${path.split('/').pop()}"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
