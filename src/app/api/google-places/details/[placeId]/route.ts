import { NextRequest, NextResponse } from 'next/server';
import { googlePlacesService } from '@/lib/services/googlePlaces';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { handleApiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';



export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  const resolvedParams = await params;
  try {
    // DB: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
    const placeDetails = await googlePlacesService.getPlaceDetails(resolvedParams.placeId);
    return NextResponse.json({ result: placeDetails });
  } catch (error) {
    return handleApiError(error);
  }
}
