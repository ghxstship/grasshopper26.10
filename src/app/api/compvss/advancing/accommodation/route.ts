import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createdResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { hospitalityAdvancingSchema } from '@/lib/validations/advancing';

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const validatedData = hospitalityAdvancingSchema.parse(body);

    const advancingRequest = await prisma.advancingRequest.create({
      data: {
        userId: context.userId,
        category: 'HOSPITALITY',
        title: validatedData.title || 'Accommodation Request',
        description: validatedData.description,
        status: 'PENDING',
        priority: validatedData.priority || 'MEDIUM',
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
        metadata: validatedData.metadata as any,
        hospitalitySubmission: {
          create: {
            type: 'accommodation',
            description: body.description || '',
            people: body.people || 1,
            dietary: body.dietary || [],
            timing: body.timing ? new Date(body.timing) : undefined,
            location: body.location,
            metadata: body.submissionMetadata,
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
