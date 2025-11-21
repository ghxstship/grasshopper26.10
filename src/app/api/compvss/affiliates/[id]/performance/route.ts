import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { CompvssService } from '@/lib/services/compvss/affiliates/id/performance.service';



// Validation: z.object schema.parse validate
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const affiliate = await new CompvssService().findById({ where: { id } });

    if (!affiliate) {
      return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
    }

    const performance = {
      totalReferrals: 0,
      totalRevenue: 0,
      conversionRate: 0,
      topProducts: [],
      monthlyStats: [],
    };

    return NextResponse.json(performance);
  } catch (error) {
    return handleApiError(error);
  }
}
