import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TaskStatus } from '@prisma/client';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const task = await prisma.task.update({
      where: { id },
      data: {
        status: TaskStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error completing task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
