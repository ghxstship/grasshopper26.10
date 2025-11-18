/**
 * API Route: /api/atlvs/projects/[id]/timeline
 * Get project timeline with phases, milestones, and tasks
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

    const timeline = await ProjectService.getTimeline(id);

    return NextResponse.json(timeline);
  } catch (error) {
    console.error('Error fetching project timeline:', error);
    
    if (error instanceof Error && error.message === 'Project not found') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch project timeline' },
      { status: 500 }
    );
  }
}
