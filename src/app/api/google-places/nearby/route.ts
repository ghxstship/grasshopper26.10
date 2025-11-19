import { NextRequest, NextResponse } from 'next/server';
import { googlePlacesService, PlaceType } from '@/lib/services/googlePlaces';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { handleApiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';



export async function GET(request: NextRequest) {
  try {
    // DB: await prisma.$queryRaw`SELECT 1`;
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

    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');
    const radius = searchParams.get('radius');
    const type = searchParams.get('type') as PlaceType | null;
    const keyword = searchParams.get('keyword');

    if (!location || !radius) {
      return NextResponse.json(
        { error: 'Location and radius are required' },
        { status: 400 }
      );
    }

    const [lat, lng] = location.split(',').map(Number);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: 'Invalid location format' },
        { status: 400 }
      );
    }

    const places = await googlePlacesService.searchNearby({
      lat,
      lng,
      radius: Number(radius),
      type: type || undefined,
      keyword: keyword || undefined,
    });

    return NextResponse.json({ results: places });
  } catch (error) {
    return handleApiError(error);
  }
}
