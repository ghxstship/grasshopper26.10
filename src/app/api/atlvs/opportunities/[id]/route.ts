import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { OpportunityService } from '@/lib/services/shared/opportunity.service';
import { updateOpportunitySchema } from '@/lib/validations/opportunities';
import { handleApiError } from '@/lib/api/response';
import { z } from 'zod';


/**
 * GET /api/atlvs/opportunities/[id]
 * Get a single opportunity
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeApplications = searchParams.get('includeApplications') === 'true';

    const opportunity = await OpportunityService.getById(id, includeApplications);
    return NextResponse.json(opportunity);
  } catch (error) {
    if (error instanceof Error && error.message === 'Opportunity not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return handleApiError(error);
  }
}

/**
 * PATCH /api/atlvs/opportunities/[id]
 * Update an opportunity
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = updateOpportunitySchema.parse(body);

    const opportunity = await OpportunityService.update(
      id,
      validated,
      session.user.id
    );

    return NextResponse.json(opportunity);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'Opportunity not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return handleApiError(error);
  }
}

/**
 * DELETE /api/atlvs/opportunities/[id]
 * Delete an opportunity
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await OpportunityService.delete(id, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Opportunity not found') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message.includes('Cannot delete')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return handleApiError(error);
  }
}
