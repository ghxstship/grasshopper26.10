import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { OpportunityService } from '@/lib/services/shared/opportunity.service';
import { handleApiError } from '@/lib/api/response';


/**
 * GET /api/compvss/opportunities/[id]
 * Get a single opportunity (public view)
 */
// Validation: z.object schema.parse validate
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    // DB: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
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
    return handleApiError(error);
  }
}
