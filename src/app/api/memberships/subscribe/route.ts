import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { createSubscription } from '@/lib/integrations/stripe/checkout';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { z } from 'zod';
import { MembershipsService } from '@/lib/services/memberships/subscribe.service';



export async function POST(request: NextRequest) {
  try {
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
    const { tierId, stripeCustomerId, stripePriceId } = body;

    // Create Stripe subscription
    const subscription = await createSubscription(stripeCustomerId, stripePriceId);

    // Create membership record
    const membership = await new MembershipsService().create({
      data: {
        userId: context.userId!,
        tierId,
        status: 'ACTIVE',
        autoRenew: true,
        metadata: {
          stripeSubscriptionId: subscription.id,
        },
      },
      include: {
        tier: true,
      },
    });

    return successResponse(membership);
  } catch (error) {
    return handleApiError(error);
  }
}
