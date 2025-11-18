import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ApplicationService } from '@/lib/services/shared/application.service';
import { updateApplicationStatusSchema } from '@/lib/validations/opportunities';
import { z } from 'zod';

/**
 * PATCH /api/atlvs/opportunities/[id]/applications/[appId]
 * Update application status (review, approve, reject, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; appId: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { appId } = await params;
    const body = await request.json();
    const validated = updateApplicationStatusSchema.parse({
      ...body,
      reviewedBy: session.user.id,
    });

    const application = await ApplicationService.updateStatus(appId, validated);
    return NextResponse.json(application);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'Application not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}
