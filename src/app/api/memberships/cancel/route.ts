import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { cancelSubscription } from '@/lib/integrations/stripe/checkout';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { MembershipsService } from '@/lib/services/memberships/cancel.service';



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
    const { membershipId } = body;

    const membership = await new MembershipsService().findById({
      where: { id: membershipId },
    });

    if (!membership) {
      throw errors.notFound('Membership not found');
    }

    if (membership.userId !== context.userId) {
      throw errors.forbidden('Not authorized');
    }

    // Cancel Stripe subscription
    const metadata = membership.metadata as { stripeSubscriptionId?: string } | null;
    const stripeSubscriptionId = metadata?.stripeSubscriptionId;
    if (stripeSubscriptionId) {
      await cancelSubscription(stripeSubscriptionId);
    }

    // Update membership
    const updated = await new MembershipsService().update({
      where: { id: membershipId },
      data: {
        status: 'CANCELLED',
        autoRenew: false,
      },
    });

    return successResponse(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
