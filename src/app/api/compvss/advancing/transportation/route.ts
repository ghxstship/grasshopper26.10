import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createdResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { transportationAdvancingSchema } from '@/lib/validations/advancing';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { CompvssService } from '@/lib/services/compvss/advancing/transportation.service';
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
    const validatedData = transportationAdvancingSchema.parse(body);

    const advancingRequest = await new CompvssService().create({
      data: {
        userId: context.userId,
        category: 'SITE_VEHICLES',
        title: validatedData.title || 'Transportation Request',
        description: validatedData.description,
        status: 'PENDING',
        priority: validatedData.priority || 'MEDIUM',
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
        metadata: validatedData.metadata as any,
        vehicleSubmission: {
          create: {
            type: body.type || 'transport',
            description: body.description || '',
            quantity: body.quantity || 1,
            needed: body.needed ? new Date(body.needed) : undefined,
            duration: body.duration,
            driver: body.driver || false,
            metadata: body.submissionMetadata,
          },
        },
      },
      include: {
        vehicleSubmission: true,
      },
    });

    return createdResponse(advancingRequest);
  } catch (error) {
    return handleApiError(error);
  }
}
