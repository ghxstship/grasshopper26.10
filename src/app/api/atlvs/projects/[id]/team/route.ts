/**
 * API Route: /api/atlvs/projects/[id]/team
 * Get project team members
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

    const team = await ProjectService.getTeam(id);

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error fetching project team:', error);
    
    if (error instanceof Error && error.message === 'Project not found') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch project team' },
      { status: 500 }
    );
  }
}
