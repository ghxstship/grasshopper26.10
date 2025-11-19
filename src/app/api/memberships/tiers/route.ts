import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createMembershipTierSchema } from '@/lib/validations/memberships';
import { successResponse, createdResponse, handleApiError,  } from '@/lib/api/response';
import { parseBody, getPaginationParams, validateRequest, requireAuth,  } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { MembershipsService } from '@/lib/services/memberships/tiers.service';



// GET /api/memberships/tiers - List membership tiers
export async function GET(request: NextRequest) {
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
    const tiers = await new MembershipsService().findAll({
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

    const body = await parseBody(request);
    const validatedData = createMembershipTierSchema.parse(body);

    // Create tier
    const tier = await new MembershipsService().create({
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
