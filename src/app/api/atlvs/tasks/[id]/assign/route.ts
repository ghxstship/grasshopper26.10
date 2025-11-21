import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const assignSchema = z.object({
  assigneeId: z.string(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = assignSchema.parse(body);

    const task = await prisma.task.update({
      where: { id: id },
      data: {
        assigneeId: data.assigneeId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        project: true,
      },
    });

    // Create notification for assignee
    await prisma.notification.create({
      data: {
        userId: data.assigneeId,
        type: 'TASK_ASSIGNED',
        title: 'New Task Assigned',
        message: `You have been assigned to task: ${task.title}`,
        actionUrl: `/atlvs/tasks/${task.id}`,
        read: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: { task },
    });
  } catch (error) {
    console.error('Task assignment error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to assign task' } },
      { status: 500 }
    );
  }
}
