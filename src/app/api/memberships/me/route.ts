import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subscribeMembershipSchema, cancelMembershipSchema } from '@/lib/validations/memberships';
import { successResponse, createdResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth,  } from '@/lib/api/middleware';

// GET /api/memberships/me - Get current user's membership
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const membership = await prisma.membership.findFirst({
      where: {
        userId: context.userId,
        status: 'ACTIVE',
      },
      include: {
        tier: {
          include: {
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!membership) {
      return successResponse({
        membership: null,
        message: 'No active membership found',
      });
    }

    return successResponse(membership);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/memberships/me - Subscribe to membership
export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await parseBody(request);
    const validatedData = subscribeMembershipSchema.parse(body);

    // Check if tier exists
    const tier = await prisma.membershipTier.findUnique({
      where: { id: validatedData.tierId },
    });

    if (!tier) {
      throw errors.notFound('Membership tier');
    }


    // Check for existing active membership
    const existingMembership = await prisma.membership.findFirst({
      where: {
        userId: context.userId,
        status: 'ACTIVE',
      },
    });

    if (existingMembership) {
      throw errors.conflict('You already have an active membership');
    }

    // Calculate dates
    const startDate = new Date();
    let endDate = new Date(startDate);

    switch (tier.interval) {
      case 'month':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarter':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'year':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      case 'lifetime':
        endDate = new Date('2099-12-31');
        break;
    }

    // Create membership
    const membership = await prisma.membership.create({
      data: {
        userId: context.userId!,
        tierId: validatedData.tierId,
        status: 'ACTIVE',
        startDate,
        endDate,
        autoRenew: tier.interval !== 'lifetime',
        metadata: validatedData.metadata ? JSON.parse(JSON.stringify(validatedData.metadata)) : undefined,
      },
      include: {
        tier: {
          include: {
            organization: true,
          },
        },
      },
    });

    // Process payment with Stripe for paid memberships
    if (Number(tier.price) > 0) {
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2025-10-29.clover',
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(tier.price) * 100, // Convert to cents
        currency: 'usd',
        metadata: {
          membershipId: membership.id,
          userId: context.userId!,
          tierId: tier.id,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Update membership with payment intent
      await prisma.membership.update({
        where: { id: membership.id },
        data: {
          metadata: JSON.parse(JSON.stringify({
            ...(membership.metadata as Record<string, unknown> || {}),
            stripePaymentIntentId: paymentIntent.id,
          })),
        },
      });
    }

    // Send confirmation email
    const user = await prisma.user.findUnique({
      where: { id: context.userId! },
    });

    if (user?.email) {
      await prisma.notification.create({
        data: {
          userId: context.userId!,
          type: 'MEMBERSHIP_ACTIVATED',
          title: 'Membership Activated',
          message: `Your ${tier.name} membership has been activated successfully!`,
          metadata: {
            membershipId: membership.id,
            tierName: tier.name,
          },
        },
      });
    }

    return createdResponse(membership);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/memberships/me - Cancel membership
export async function PATCH(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await parseBody(request);
    const validatedData = cancelMembershipSchema.parse(body);

    // Find active membership
    const membership = await prisma.membership.findFirst({
      where: {
        userId: context.userId,
        status: 'ACTIVE',
      },
    });

    if (!membership) {
      throw errors.notFound('Active membership');
    }

    // Update membership
    const updatedMembership = await prisma.membership.update({
      where: { id: membership.id },
      data: {
        status: validatedData.cancelAtPeriodEnd ? 'ACTIVE' : 'CANCELLED',
        autoRenew: false,
        cancelledAt: new Date(),
        metadata: JSON.parse(JSON.stringify({
          ...(membership.metadata as Record<string, unknown> || {}),
          cancellationReason: validatedData.reason,
          cancelAtPeriodEnd: validatedData.cancelAtPeriodEnd,
        })),
      },
      include: {
        tier: true,
      },
    });

    return successResponse({
      membership: updatedMembership,
      message: validatedData.cancelAtPeriodEnd
        ? 'Membership will be cancelled at the end of the billing period'
        : 'Membership cancelled immediately',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
