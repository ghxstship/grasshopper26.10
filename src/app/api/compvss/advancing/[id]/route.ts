import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { z } from 'zod';
import { CompvssService } from '@/lib/services/compvss/advancing/id.service';



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const advancingRequest = await new CompvssService().findById({
      where: { id: id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        approvers: true,
        result: true,
        accessSubmission: true,
        infrastructureSubmission: true,
        assetSubmission: true,
        utilitySubmission: true,
        vehicleSubmission: true,
        equipmentSubmission: true,
        technicalSubmission: true,
        hospitalitySubmission: true,
        travelSubmission: true,
      },
    });

    if (!advancingRequest) {
      throw errors.notFound('Advancing request not found');
    }

    return successResponse(advancingRequest);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const advancingRequest = await new CompvssService().update({
      where: { id: id },
      data: body,
    });

    return successResponse(advancingRequest);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    await new CompvssService().delete({
      where: { id: id },
    });

    return successResponse({ message: 'Request deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
