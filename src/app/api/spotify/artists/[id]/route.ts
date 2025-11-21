import { NextRequest, NextResponse } from 'next/server';
import { spotifyService } from '@/lib/services/spotify';
import { rateLimit, validateRequest, requireAuth } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { handleApiError, errors } from '@/lib/api/response';
import { z } from 'zod';

const artistIdSchema = z.object({
  id: z.string().min(1),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // DB: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.READ_OPERATIONS.limit,
        RATE_LIMITS.READ_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const resolvedParams = await params;
    const validated = artistIdSchema.parse(resolvedParams);
    const artist = await spotifyService.getArtist(validated.id);
    return NextResponse.json(artist);
  } catch (error) {
    return handleApiError(error);
  }
}
