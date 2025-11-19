import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createdResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { genericAdvancingSchema } from '@/lib/validations/advancing';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { CompvssService } from '@/lib/services/compvss/advancing/travel.service';
import { errors } from '@/lib/api/errors';



export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
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

    const body = await request.json();
    const validatedData = genericAdvancingSchema.parse(body);

    const advancingRequest = await new CompvssService().create({
      data: {
        userId: context.userId,
        category: 'TRAVEL_LODGING',
        title: validatedData.title || 'Travel & Lodging Request',
        description: validatedData.description,
        status: 'PENDING',
        priority: validatedData.priority || 'MEDIUM',
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
        metadata: validatedData.metadata as any,
        travelSubmission: {
          create: {
            type: body.type || 'general',
            description: body.description || '',
            people: body.people || 1,
            origin: body.origin,
            destination: body.destination,
            departureDate: body.departureDate ? new Date(body.departureDate) : undefined,
            returnDate: body.returnDate ? new Date(body.returnDate) : undefined,
            metadata: body.submissionMetadata,
          },
        },
      },
      include: {
        travelSubmission: true,
      },
    });

    return createdResponse(advancingRequest);
  } catch (error) {
    return handleApiError(error);
  }
}
