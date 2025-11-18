import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ApplicationStatus } from '@prisma/client';
import { ApplicationService } from '@/lib/services/shared/application.service';

/**
 * GET /api/compvss/applications
 * Get current user's applications
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      userId: session.user.id,
      status: searchParams.get('status') as ApplicationStatus | undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    };

    const result = await ApplicationService.getAll(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
