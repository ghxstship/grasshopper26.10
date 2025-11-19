import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createArtistSchema } from '@/lib/validations/events';
import { successResponse, createdResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, getPaginationParams, getSortParams, validateRequest, requireAuth,  } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { ArtistsService } from '@/lib/services/artists.service';



// GET /api/artists - List artists
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byIP(getClientIdentifier(request)),
        RATE_LIMITS.PUBLIC_ENDPOINT.limit,
        RATE_LIMITS.PUBLIC_ENDPOINT.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);
    const { sortBy, sortOrder } = getSortParams(request, 'name');

    // Build where clause
    const where: Record<string, unknown> = {};

    const genre = searchParams.get('genre');
    const verified = searchParams.get('verified');
    const search = searchParams.get('search');

    if (genre) where.genre = genre;
    if (verified !== null) where.verified = verified === 'true';

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { genre: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.artist.count({ where });

    // Get artists
    const artists = await new ArtistsService().findAll({
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

    return successResponse(artists, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/artists - Create artist
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byIP(getClientIdentifier(request)),
        RATE_LIMITS.PUBLIC_ENDPOINT.limit,
        RATE_LIMITS.PUBLIC_ENDPOINT.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const context = await validateRequest(request);
    requireAuth(context);

    const body = await parseBody(request);
    const validatedData = createArtistSchema.parse(body);

    // Generate slug if not provided
    const slug =
      validatedData.slug ||
      validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    // Check if slug is unique
    const existingArtist = await new ArtistsService().findById({
      where: { slug },
    });

    if (existingArtist) {
      throw errors.conflict('Artist with this slug already exists');
    }

    // Create artist
    const artist = await new ArtistsService().create({
      data: {
        ...validatedData,
        slug,
      },
    });

    return createdResponse(artist);
  } catch (error) {
    return handleApiError(error);
  }
}
