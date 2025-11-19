import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createVenueSchema } from '@/lib/validations/events';
import { successResponse, createdResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, getPaginationParams, getSortParams, validateRequest, requireAuth,  } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { VenuesService } from '@/lib/services/venues.service';



// GET /api/venues - List venues
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    
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
    const { sortBy, sortOrder } = getSortParams(request, 'name');

    // Build where clause
    const where: Record<string, unknown> = {};

    const city = searchParams.get('city');
    const country = searchParams.get('country');
    const search = searchParams.get('search');

    if (city) where.city = city;
    if (country) where.country = country;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.venue.count({ where });

    // Get venues
    const venues = await new VenuesService().findAll({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        _count: {
          select: {
            events: true,
          },
        },
      },
    });

    return successResponse(venues, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/venues - Create venue
export async function POST(request: NextRequest) {
  try {const context = await validateRequest(request);
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

    const body = await parseBody(request);
    const validatedData = createVenueSchema.parse(body);

    // Generate slug if not provided
    const slug =
      validatedData.slug ||
      validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    // Check if slug is unique
    const existingVenue = await new VenuesService().findById({
      where: { slug },
    });

    if (existingVenue) {
      throw errors.conflict('Venue with this slug already exists');
    }

    // Create venue
    const venue = await new VenuesService().create({
      data: {
        name: validatedData.name,
        slug,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        country: validatedData.country,
        postalCode: validatedData.postalCode,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        capacity: validatedData.capacity,
        description: validatedData.description,
        imageUrl: validatedData.imageUrl,
        metadata: validatedData.metadata ? JSON.parse(JSON.stringify(validatedData.metadata)) : undefined,
      },
    });

    return createdResponse(venue);
  } catch (error) {
    return handleApiError(error);
  }
}
