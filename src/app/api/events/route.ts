import { NextRequest } from 'next/server';
import { createEventSchema, eventFiltersSchema } from '@/lib/validations/events';
import { successResponse, createdResponse, handleApiError, errors } from '@/lib/api/response';
import { parseBody, getPaginationParams, getSortParams, validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { EventsService } from '@/lib/services/events.service';
import { prisma } from '@/lib/prisma';
import { getClientIdentifier } from '@/lib/api/middleware';


// GET /api/events - List events with filters
export async function GET(request: NextRequest) {
  try {
    // Rate limiting - public endpoint
    const identifier = getClientIdentifier(request);
    if (!rateLimit(
      RateLimitIdentifiers.byIP(identifier),
      RATE_LIMITS.PUBLIC_ENDPOINT.limit,
      RATE_LIMITS.PUBLIC_ENDPOINT.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);
    const { sortBy, sortOrder } = getSortParams(request, 'startDate');

    // Parse filters
    const filters = eventFiltersSchema.parse(Object.fromEntries(searchParams));

    // Build where clause
    const where: Record<string, unknown> = {};

    if (filters.organizationId) where.organizationId = filters.organizationId;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.venueId) where.venueId = filters.venueId;
    if (filters.status) where.status = filters.status;
    if (filters.visibility) where.visibility = filters.visibility;
    if (filters.featured !== undefined) where.featured = filters.featured;

    if (filters.startDateFrom || filters.startDateTo) {
      where.startDate = {};
      if (filters.startDateFrom) {
        (where.startDate as Record<string, unknown>).gte = filters.startDateFrom;
      }
      if (filters.startDateTo) {
        (where.startDate as Record<string, unknown>).lte = filters.startDateTo;
      }
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.event.count({ where });

    // Get events
    const events = await new EventsService().findAll({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            color: true,
          },
        },
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            state: true,
            country: true,
          },
        },
        artists: {
          include: {
            artist: {
              select: {
                id: true,
                name: true,
                slug: true,
                imageUrl: true,
                genre: true,
                verified: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            tickets: true,
            orders: true,
          },
        },
      },
    });

    return successResponse(events, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.WRITE_OPERATIONS.limit,
      RATE_LIMITS.WRITE_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const body = await parseBody(request);
    const validatedData = createEventSchema.parse(body);

    // Generate slug if not provided
    const slug =
      validatedData.slug ||
      validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    // Check if slug is unique
    const existingEvent = await new EventsService().findById({
      where: { slug },
    });

    if (existingEvent) {
      throw errors.conflict('Event with this slug already exists');
    }

    // Create event
    const event = await new EventsService().create({
      data: {
        organizationId: validatedData.organizationId,
        name: validatedData.name,
        slug,
        description: validatedData.description,
        shortDescription: validatedData.shortDescription,
        imageUrl: validatedData.imageUrl,
        bannerUrl: validatedData.bannerUrl,
        categoryId: validatedData.categoryId,
        venueId: validatedData.venueId,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        timezone: validatedData.timezone,
        status: validatedData.status,
        visibility: validatedData.visibility,
        capacity: validatedData.capacity,
        featured: validatedData.featured,
        metadata: validatedData.metadata ? JSON.parse(JSON.stringify(validatedData.metadata)) : undefined,
      },
      include: {
        organization: true,
        category: true,
        venue: true,
      },
    });

    return createdResponse(event);
  } catch (error) {
    return handleApiError(error);
  }
}
