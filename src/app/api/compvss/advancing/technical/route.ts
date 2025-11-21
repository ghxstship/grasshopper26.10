import { NextRequest } from 'next/server';
import { createdResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { genericAdvancingSchema } from '@/lib/validations/advancing';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { CompvssService } from '@/lib/services/compvss/advancing/technical.service';
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
        category: 'TECHNICAL_PRODUCTION',
        title: validatedData.title || 'Technical Production Request',
        description: validatedData.description,
        status: 'PENDING',
        priority: validatedData.priority || 'MEDIUM',
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
        metadata: validatedData.metadata as any,
        technicalSubmission: {
          create: {
            type: body.type || 'general',
            description: body.description || '',
            equipment: body.equipment || [],
            crew: body.crew,
            setup: body.setup ? new Date(body.setup) : undefined,
            soundcheck: body.soundcheck ? new Date(body.soundcheck) : undefined,
            metadata: body.submissionMetadata,
          },
        },
      },
      include: {
        technicalSubmission: true,
      },
    });

    return createdResponse(advancingRequest);
  } catch (error) {
    return handleApiError(error);
  }
}
