import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createdResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { genericAdvancingSchema } from '@/lib/validations/advancing';

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const validatedData = genericAdvancingSchema.parse(body);

    const advancingRequest = await prisma.advancingRequest.create({
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
