/**
 * API Route: /api/atlvs/assets/calendar
 * Get asset booking calendar
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AssetService } from '@/lib/services/atlvs/asset.service';
import { rateLimit, getClientIdentifier, validateRequest, requireAuth } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { handleApiError, errors } from '@/lib/api/response';



export async function GET(request: NextRequest) {
  try {
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

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const equipmentId = searchParams.get('equipmentId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    const calendar = await AssetService.getCalendar({
      equipmentId: equipmentId || undefined,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    return NextResponse.json(calendar);
  } catch (error) {
    return handleApiError(error);
  }
}
