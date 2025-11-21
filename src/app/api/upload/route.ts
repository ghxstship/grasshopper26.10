import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { uploadFile } from '@/lib/storage/service';
import { STORAGE_BUCKETS, type StorageBucket } from '@/lib/storage/config';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";


// POST /api/upload - Upload file
export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as StorageBucket;
    const folder = formData.get('folder') as string | undefined;

    if (!file) {
      throw errors.badRequest('No file provided');
    }

    if (!bucket) {
      throw errors.badRequest('No bucket specified');
    }

    // Validate bucket
    const validBuckets = Object.values(STORAGE_BUCKETS);
    if (!validBuckets.includes(bucket)) {
      throw errors.badRequest('Invalid bucket');
    }

    // Upload file using storage service
    const result = await uploadFile({
      bucket,
      userId: context.userId,
      file,
      folder,
    });

    return successResponse({
      path: result.path,
      url: result.url,
      bucket: result.bucket,
      filename: file.name,
      mimeType: result.mimeType,
      size: result.size,
      uploadedAt: result.uploadedAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
