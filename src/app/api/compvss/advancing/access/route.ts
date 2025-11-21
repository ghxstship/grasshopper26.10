import { NextRequest } from 'next/server';
import { createdResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { accessAdvancingSchema } from '@/lib/validations/advancing';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { CompvssService } from '@/lib/services/compvss/advancing/access.service';
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
    const validatedData = accessAdvancingSchema.parse(body);

    const advancingRequest = await new CompvssService().create({
      data: {
        userId: context.userId,
        category: 'ACCESS_CREDENTIALS',
        title: validatedData.title || 'Access Credentials Request',
        description: validatedData.description,
        status: 'PENDING',
        priority: validatedData.priority || 'MEDIUM',
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
        metadata: validatedData.metadata as any,
        accessSubmission: {
          create: {
            passType: body.passType,
            quantity: body.quantity,
            names: body.names || [],
            dates: body.dates,
            areas: body.areas || [],
            parking: body.parking || false,
            metadata: body.submissionMetadata,
          },
        },
      },
      include: {
        accessSubmission: true,
      },
    });

    return createdResponse(advancingRequest);
  } catch (error) {
    return handleApiError(error);
  }
}
