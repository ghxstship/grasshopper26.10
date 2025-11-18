import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { successResponse, createdResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, getPaginationParams, parseBody, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import type { Prisma, ProjectStatus } from '@prisma/client';

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  organizationId: z.string().cuid(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  budget: z.number().nonnegative().optional(),
  status: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const projectFiltersSchema = z.object({
  status: z.string().optional(),
  organizationId: z.string().cuid().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.READ_OPERATIONS.limit,
      RATE_LIMITS.READ_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);
    
    // Parse and validate filters
    const filters = projectFiltersSchema.parse(Object.fromEntries(searchParams));
    
    const where: Prisma.ProjectWhereInput = {};
    if (filters.status) where.status = filters.status as ProjectStatus;
    if (filters.organizationId) where.organizationId = filters.organizationId;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          organization: { select: { id: true, name: true } },
          creator: { select: { id: true, name: true } },
          _count: { select: { tasks: true, milestones: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return successResponse(projects, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.WRITE_OPERATIONS.limit,
      RATE_LIMITS.WRITE_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const body = await parseBody(request);
    const validatedData = createProjectSchema.parse(body);
    
    // Generate slug if not provided
    const slug: string = validatedData.slug ?? 
      validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    
    const project = await prisma.project.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
        organizationId: validatedData.organizationId,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        budget: validatedData.budget,
        status: (validatedData.status as 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED') || 'PLANNING',
        metadata: validatedData.metadata ? JSON.parse(JSON.stringify(validatedData.metadata)) : undefined,
        createdBy: context.userId,
      },
      include: {
        organization: true,
        creator: { select: { id: true, name: true } },
      },
    });

    return createdResponse(project);
  } catch (error) {
    return handleApiError(error);
  }
}
