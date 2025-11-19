import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createdResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { hospitalityAdvancingSchema } from '@/lib/validations/advancing';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { CompvssService } from '@/lib/services/compvss/advancing/hospitality.service';
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
    const validatedData = hospitalityAdvancingSchema.parse(body);

    const advancingRequest = await new CompvssService().create({
      data: {
        userId: context.userId,
        category: 'HOSPITALITY',
        title: validatedData.title || 'Hospitality Request',
        description: validatedData.description,
        status: 'PENDING',
        priority: validatedData.priority || 'MEDIUM',
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
        metadata: validatedData.metadata as any,
        hospitalitySubmission: {
          create: {
            type: validatedData.type || 'hospitality',
            description: validatedData.description || '',
            people: validatedData.people || 1,
            dietary: validatedData.dietary || [],
            timing: validatedData.timing ? new Date(validatedData.timing) : undefined,
            location: validatedData.location,
            metadata: validatedData.submissionMetadata as any,
          },
        },
      },
      include: {
        hospitalitySubmission: true,
      },
    });

    return createdResponse(advancingRequest);
  } catch (error) {
    return handleApiError(error);
  }
}
