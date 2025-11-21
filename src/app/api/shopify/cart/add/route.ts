import { NextRequest, NextResponse } from 'next/server';
import { shopifyService } from '@/lib/services/shopify';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { handleApiError } from '@/lib/api/response';
import { errors } from '@/lib/api/errors';



export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { userId, variantId, quantity } = body;

    if (!userId || !variantId || !quantity) {
      return NextResponse.json(
        { error: 'userId, variantId, and quantity are required' },
        { status: 400 }
      );
    }

    const cart = await shopifyService.addToCart(userId, variantId, quantity);
    return NextResponse.json(cart);
  } catch (error) {
    return handleApiError(error);
  }
}
