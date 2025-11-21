import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { AdvancingRequestService } from '@/lib/services/atlvs/advancing/AdvancingRequestService';
import { Priority } from '@prisma/client';
import { handleApiError } from '@/lib/api/response';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';


const updateRequestSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority).optional(),
  dueDate: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * GET /api/atlvs/advancing/[id]
 * Get a single advancing request by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = new AdvancingRequestService();
    const advancingRequest = await service.getById(id);

    // Check if user has access to this request
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const hasAdminAccess = user?.role === 'ADMIN' || user?.role === 'INTERNAL_TEAM';

    if (advancingRequest.userId !== session.user.id && !hasAdminAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(advancingRequest);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/atlvs/advancing/[id]
 * Update an advancing request
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = updateRequestSchema.parse(body);

    const service = new AdvancingRequestService();
    const advancingRequest = await service.update(
      id,
      session.user.id,
      {
        ...validated,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : undefined,
      }
    );

    return NextResponse.json(advancingRequest);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/atlvs/advancing/[id]
 * Delete an advancing request
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const service = new AdvancingRequestService();
    await service.delete(id, session.user.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
