import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { z } from 'zod';
import { CompvssService } from '@/lib/services/compvss/issues/id.service';



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const issue = await new CompvssService().findById({
      where: { id: id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!issue) {
      throw errors.notFound('Issue not found');
    }

    return successResponse(issue);
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
    const issue = await new CompvssService().update({
      where: { id: id },
      data: body,
    });

    return successResponse(issue);
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

    return successResponse({ message: 'Issue deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
