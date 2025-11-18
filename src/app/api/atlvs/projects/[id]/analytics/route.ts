/**
 * API Route: /api/atlvs/projects/[id]/analytics
 * Get project analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ProjectService } from '@/lib/services/atlvs/project.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const analytics = await ProjectService.getAnalytics(id);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching project analytics:', error);
    
    if (error instanceof Error && error.message === 'Project not found') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch project analytics' },
      { status: 500 }
    );
  }
}
