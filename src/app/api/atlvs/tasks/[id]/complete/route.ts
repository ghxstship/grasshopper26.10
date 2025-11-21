/**
 * API Route: /api/atlvs/tasks/[id]/complete
 * Mark a task as complete
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { TaskService } from '@/lib/services/atlvs/task.service';



export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // DB: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const task = await TaskService.complete(id, session.user.id);

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error completing task:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Task not found') {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }
      if (error.message.includes('incomplete dependencies')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: 'Failed to complete task' },
      { status: 500 }
    );
  }
}
