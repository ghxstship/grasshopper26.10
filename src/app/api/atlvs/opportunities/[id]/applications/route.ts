import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ApplicationService } from '@/lib/services/shared/application.service';
import { ApplicationStatus } from '@prisma/client';

/**
 * GET /api/atlvs/opportunities/[id]/applications
 * Get all applications for an opportunity
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
    
    const filters = {
      status: searchParams.get('status') as ApplicationStatus | undefined,
      rating: searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : undefined,
    };

    const applications = await ApplicationService.getByOpportunity(id, filters);
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
