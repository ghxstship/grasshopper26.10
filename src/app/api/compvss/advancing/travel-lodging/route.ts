import { NextRequest } from 'next/server';
import { successResponse, createdResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const travelLodgingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['flight', 'hotel', 'rental-car', 'ground-transport']),
  destination: z.string().min(1, 'Destination is required'),
  origin: z.string().optional(),
  travelers: z.number().min(1, 'At least 1 traveler required'),
  departureDate: z.string().datetime(),
  returnDate: z.string().datetime().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  hotelName: z.string().optional(),
  accommodationType: z.string().optional(),
  flightClass: z.string().optional(),
  specialRequirements: z.string().optional(),
  budget: z.number().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// GET /api/compvss/advancing/travel-lodging
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.PUBLIC_ENDPOINT.limit,
      RATE_LIMITS.PUBLIC_ENDPOINT.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {
      category: 'TRAVEL_LODGING',
      userId: context.userId,
    };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.metadata = {
        path: ['type'],
        equals: type,
      };
    }

    const requests = await prisma.advancingRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        category: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
        dueDate: true,
      },
    });

    // Transform the data to match the frontend interface
    const transformedRequests = requests.map((req) => {
      const metadata = req.metadata as any || {};
      return {
        id: req.id,
        requestNumber: `TL-${req.id.slice(-8).toUpperCase()}`,
        type: metadata.type || 'flight',
        destination: metadata.destination || 'Unknown',
        origin: metadata.origin,
        status: req.status,
        travelers: metadata.travelers || 1,
        departureDate: metadata.departureDate || req.createdAt.toISOString(),
        returnDate: metadata.returnDate,
        hotelName: metadata.hotelName,
        accommodationType: metadata.accommodationType,
        flightClass: metadata.flightClass,
        specialRequirements: metadata.specialRequirements,
        budget: metadata.budget,
      };
    });

    return successResponse({ requests: transformedRequests });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/compvss/advancing/travel-lodging
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

    const body = await request.json();
    const validatedData = travelLodgingSchema.parse(body);

    const advancingRequest = await prisma.advancingRequest.create({
      data: {
        userId: context.userId,
        category: 'TRAVEL_LODGING',
        title: validatedData.title,
        description: validatedData.description,
        status: 'PENDING',
        priority: validatedData.priority,
        dueDate: validatedData.returnDate ? new Date(validatedData.returnDate) : undefined,
        metadata: {
          type: validatedData.type,
          destination: validatedData.destination,
          origin: validatedData.origin,
          travelers: validatedData.travelers,
          departureDate: validatedData.departureDate,
          returnDate: validatedData.returnDate,
          hotelName: validatedData.hotelName,
          accommodationType: validatedData.accommodationType,
          flightClass: validatedData.flightClass,
          specialRequirements: validatedData.specialRequirements,
          budget: validatedData.budget,
          ...validatedData.metadata,
        },
      },
    });

    // Create history entry
    await prisma.advancingHistory.create({
      data: {
        requestId: advancingRequest.id,
        userId: context.userId,
        action: 'created',
        toValue: 'PENDING',
        metadata: {
          type: validatedData.type,
          destination: validatedData.destination,
        },
      },
    });

    return createdResponse({
      id: advancingRequest.id,
      requestNumber: `TL-${advancingRequest.id.slice(-8).toUpperCase()}`,
      ...advancingRequest,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
