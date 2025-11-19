import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { z } from 'zod';
import { CompvssService } from '@/lib/services/compvss/advancing/id/reject.service';



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

    const advancingRequest = await new CompvssService().update({
      where: { id: id },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
      },
    });

    // Create approver record
    await new CompvssService().create({
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
