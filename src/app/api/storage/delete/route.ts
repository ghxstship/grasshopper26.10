import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors,  } from '@/lib/api/response';
import { validateRequest, requireAuth,  } from '@/lib/api/middleware';
import { deleteFile, deleteMultipleFiles } from '@/lib/storage/service';
import { STORAGE_BUCKETS, type StorageBucket } from '@/lib/storage/config';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { z } from 'zod';
import { prisma } from '@/lib/prisma';


// DELETE /api/storage/delete - Delete file(s)
export async function DELETE(request: NextRequest) {
  try {
    // Database: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.WRITE_OPERATIONS.limit,
        RATE_LIMITS.WRITE_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

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
