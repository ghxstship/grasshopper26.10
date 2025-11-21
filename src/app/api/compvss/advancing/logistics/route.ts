import { NextRequest } from 'next/server';
import { successResponse, createdResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const logisticsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['equipment', 'shipping', 'freight', 'courier']),
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  requestedDate: z.string().datetime(),
  deliveryDate: z.string().datetime().optional(),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  quantity: z.number().optional(),
  specialHandling: z.string().optional(),
  insuranceRequired: z.boolean().optional(),
  trackingRequired: z.boolean().optional(),
  budget: z.number().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// GET /api/compvss/advancing/logistics
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
      category: 'LOGISTICS',
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
        requestNumber: `LOG-${req.id.slice(-8).toUpperCase()}`,
        type: metadata.type || 'equipment',
        description: req.description,
        status: req.status,
        origin: metadata.origin || 'Unknown',
        destination: metadata.destination || 'Unknown',
        weight: metadata.weight,
        dimensions: metadata.dimensions,
        quantity: metadata.quantity,
        requestedDate: metadata.requestedDate || req.createdAt.toISOString(),
        deliveryDate: metadata.deliveryDate || req.dueDate?.toISOString(),
        specialHandling: metadata.specialHandling,
        insuranceRequired: metadata.insuranceRequired,
        trackingRequired: metadata.trackingRequired,
        budget: metadata.budget,
      };
    });

    return successResponse({ requests: transformedRequests });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/compvss/advancing/logistics
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
    const validatedData = logisticsSchema.parse(body);

    const advancingRequest = await prisma.advancingRequest.create({
      data: {
        userId: context.userId,
        category: 'LOGISTICS',
        title: validatedData.title,
        description: validatedData.description,
        status: 'PENDING',
        priority: validatedData.priority,
        dueDate: validatedData.deliveryDate ? new Date(validatedData.deliveryDate) : undefined,
        metadata: {
          type: validatedData.type,
          origin: validatedData.origin,
          destination: validatedData.destination,
          requestedDate: validatedData.requestedDate,
          deliveryDate: validatedData.deliveryDate,
          weight: validatedData.weight,
          dimensions: validatedData.dimensions,
          quantity: validatedData.quantity,
          specialHandling: validatedData.specialHandling,
          insuranceRequired: validatedData.insuranceRequired,
          trackingRequired: validatedData.trackingRequired,
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
          origin: validatedData.origin,
          destination: validatedData.destination,
        },
      },
    });

    return createdResponse({
      id: advancingRequest.id,
      requestNumber: `LOG-${advancingRequest.id.slice(-8).toUpperCase()}`,
      ...advancingRequest,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
