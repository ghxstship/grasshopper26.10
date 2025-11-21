import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createMembershipSchema = z.object({
  tierId: z.string(),
  autoRenew: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createMembershipSchema.parse(body);

    // Check if user already has an active membership
    const existingMembership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFLICT',
            message: 'You already have an active membership',
          },
        },
        { status: 409 }
      );
    }

    // Get tier details
    const tier = await prisma.membershipTier.findUnique({
      where: { id: validatedData.tierId },
    });

    if (!tier || !tier.active) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Membership tier not found or inactive',
          },
        },
        { status: 404 }
      );
    }

    // Calculate end date based on billing period
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    switch (tier.billingPeriod) {
      case 'MONTHLY':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'QUARTERLY':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'YEARLY':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      case 'LIFETIME':
        endDate.setFullYear(endDate.getFullYear() + 100);
        break;
    }

    // Create membership
    const membership = await prisma.membership.create({
      data: {
        userId: session.user.id,
        tierId: validatedData.tierId,
        status: 'ACTIVE',
        startDate,
        endDate: tier.billingPeriod === 'LIFETIME' ? null : endDate,
        price: parseFloat(tier.price.toString()),
        autoRenew: validatedData.autoRenew,
      },
      include: {
        tier: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          membership,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }

    console.error('Membership creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create membership',
        },
      },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    const membership = await prisma.membership.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
      include: {
        tier: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        membership,
      },
    });
  } catch (error) {
    console.error('Membership fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch membership',
        },
      },
      { status: 500 }
    );
  }
}
