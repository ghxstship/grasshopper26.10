import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { cancelSubscription } from '@/lib/integrations/stripe/checkout';

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const { membershipId } = body;

    const membership = await prisma.membership.findUnique({
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
    const updated = await prisma.membership.update({
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
