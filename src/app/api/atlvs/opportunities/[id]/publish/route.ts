import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { OpportunityService } from '@/lib/services/shared/opportunity.service';


/**
 * POST /api/atlvs/opportunities/[id]/publish
 * Publish an opportunity
 */
// Validation: z.object schema.parse validate
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // DB: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const opportunity = await OpportunityService.publish(id, session.user.id);

    return NextResponse.json(opportunity);
  } catch (error) {
    if (error instanceof Error && error.message === 'Opportunity not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error('Error publishing opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to publish opportunity' },
      { status: 500 }
    );
  }
}
