import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors,  } from '@/lib/api/response';
import { validateRequest, requireAuth,  } from '@/lib/api/middleware';
import { deleteFile, deleteMultipleFiles } from '@/lib/storage/service';
import { STORAGE_BUCKETS, type StorageBucket } from '@/lib/storage/config';

// DELETE /api/storage/delete - Delete file(s)
export async function DELETE(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const { bucket, path, paths } = body as {
      bucket: StorageBucket;
      path?: string;
      paths?: string[];
    };

    if (!bucket) {
      throw errors.badRequest('No bucket specified');
    }

    // Validate bucket
    const validBuckets = Object.values(STORAGE_BUCKETS);
    if (!validBuckets.includes(bucket)) {
      throw errors.badRequest('Invalid bucket');
    }

    // Delete single or multiple files
    if (paths && paths.length > 0) {
      await deleteMultipleFiles(bucket, paths);
      return successResponse({
        message: `${paths.length} file(s) deleted successfully`,
        count: paths.length,
      });
    } else if (path) {
      await deleteFile({ bucket, path });
      return successResponse({
        message: 'File deleted successfully',
      });
    } else {
      throw errors.badRequest('No path or paths specified');
    }
  } catch (error) {
    return handleApiError(error);
  }
}
