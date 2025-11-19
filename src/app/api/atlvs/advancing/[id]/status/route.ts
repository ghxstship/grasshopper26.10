import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { AdvancingRequestService } from '@/lib/services/atlvs/advancing/AdvancingRequestService';
import { AdvancingStatus } from '@prisma/client';
import { z } from 'zod';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { handleApiError } from '@/lib/api/response';


const updateStatusSchema = z.object({
  status: z.nativeEnum(AdvancingStatus),
  note: z.string().optional(),
});

/**
 * PATCH /api/atlvs/advancing/[id]/status
 * Update the status of an advancing request
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
    const validated = updateStatusSchema.parse(body);

    const service = new AdvancingRequestService();
    const advancingRequest = await service.updateStatus(
      id,
      session.user.id,
      validated.status,
      validated.note
    );

    return NextResponse.json(advancingRequest);
  } catch (error) {
    console.error('Error updating status:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid status data', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('Invalid status transition')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}
