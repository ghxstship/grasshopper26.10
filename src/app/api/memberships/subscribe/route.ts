import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { createSubscription } from '@/lib/integrations/stripe/checkout';

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const { tierId, stripeCustomerId, stripePriceId } = body;

    // Create Stripe subscription
    const subscription = await createSubscription(stripeCustomerId, stripePriceId);

    // Create membership record
    const membership = await prisma.membership.create({
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
