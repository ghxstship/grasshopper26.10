import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { OpportunityService } from '@/lib/services/shared/opportunity.service';

/**
 * GET /api/compvss/opportunities/[id]
 * Get a single opportunity (public view)
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
    const opportunity = await OpportunityService.getById(id, false);

    // Only show published opportunities to COMPVSS users
    if (opportunity.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Opportunity not available' },
        { status: 404 }
      );
    }

    return NextResponse.json(opportunity);
  } catch (error) {
    if (error instanceof Error && error.message === 'Opportunity not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}
