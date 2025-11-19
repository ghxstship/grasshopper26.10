import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors,  } from '@/lib/api/response';
import { validateRequest, requireAuth,  } from '@/lib/api/middleware';
import { listFiles } from '@/lib/storage/service';
import { STORAGE_BUCKETS, type StorageBucket } from '@/lib/storage/config';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { prisma } from '@/lib/prisma';


// GET /api/storage/list - List files in bucket
export async function GET(request: NextRequest) {
  try {
    // Database: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
    const context = await validateRequest(request);
    requireAuth(context);


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
