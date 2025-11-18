import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createMembershipTierSchema } from '@/lib/validations/memberships';
import { successResponse, createdResponse, handleApiError,  } from '@/lib/api/response';
import { parseBody, getPaginationParams, validateRequest, requireAuth,  } from '@/lib/api/middleware';

// GET /api/memberships/tiers - List membership tiers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);

    // Build where clause
    const where: Record<string, unknown> = {
      active: true,
    };

    const organizationId = searchParams.get('organizationId');
    const level = searchParams.get('level');

    if (organizationId) where.organizationId = organizationId;
    if (level) where.level = level;

    // Get total count
    const total = await prisma.membershipTier.count({ where });

    // Get tiers
    const tiers = await prisma.membershipTier.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(tiers, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/memberships/tiers - Create membership tier
export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await parseBody(request);
    const validatedData = createMembershipTierSchema.parse(body);

    // Create tier
    const tier = await prisma.membershipTier.create({
      data: {
        organization: { connect: { id: validatedData.organizationId } },
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        currency: validatedData.currency,
        interval: validatedData.interval,
        billingPeriod: validatedData.billingPeriod,
        benefits: validatedData.benefits || {},
        color: validatedData.color,
        featured: validatedData.featured,
        active: validatedData.active,
        priority: validatedData.priority,
      },
    });

    return createdResponse(tier);
  } catch (error) {
    return handleApiError(error);
  }
}
