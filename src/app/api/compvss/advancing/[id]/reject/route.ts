import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const { comments } = body;

    const advancingRequest = await prisma.advancingRequest.update({
      where: { id: id },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
      },
    });

    // Create approver record
    await prisma.advancingApprover.create({
      data: {
        requestId: id,
        userId: context.userId!,
        role: 'approver',
        approved: false,
        comments,
        reviewedAt: new Date(),
      },
    });

    return successResponse(advancingRequest);
  } catch (error) {
    return handleApiError(error);
  }
}
