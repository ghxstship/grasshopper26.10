import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { OpportunityService } from '@/lib/services/shared/opportunity.service';
import { opportunityFiltersSchema } from '@/lib/validations/opportunities';
import { handleApiError } from '@/lib/api/response';


/**
 * GET /api/compvss/opportunities
 * Browse published opportunities (public-facing)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      category: searchParams.get('category') || undefined,
      locationType: searchParams.get('locationType') || undefined,
      compensationType: searchParams.get('compensationType') || undefined,
      search: searchParams.get('search') || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      status: 'PUBLISHED', // Only show published opportunities
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    };

    const validated = opportunityFiltersSchema.parse(filters);
    const result = await OpportunityService.getAll({
      ...validated,
      page: filters.page,
      limit: filters.limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
