import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { handleApiError } from '@/lib/api/response';
import { MarketplaceService } from '@/lib/services/marketplace.service';
import { errors } from '@/lib/api/errors';




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

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');

    const where: any = type ? { type } : {};

    const items = await new MarketplaceService().findAll({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ products: items });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    const item = await new MarketplaceService().create({
      data: body,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
