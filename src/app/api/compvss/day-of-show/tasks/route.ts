import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createTaskSchema = z.object({
  eventId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueTime: z.string().optional(),
  category: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    // Check if user has COMPVSS access
    if (!['EXTERNAL_TEAM', 'INTERNAL_TEAM', 'ADMIN', 'LEGEND_SUPER_ADMIN', 'LEGEND_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Access denied',
          },
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');

    const where: any = {};
    
    if (eventId) {
      where.projectId = eventId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (assignedTo) {
      where.assigneeId = assignedTo;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: {
        tasks,
        count: tasks.length,
      },
    });
  } catch (error) {
    console.error('Day-of-show tasks fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch tasks',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    if (!['EXTERNAL_TEAM', 'INTERNAL_TEAM', 'ADMIN', 'LEGEND_SUPER_ADMIN', 'LEGEND_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Access denied',
          },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);

    // Create project if it doesn't exist (for event-based tasks)
    let project = await prisma.project.findFirst({
      where: {
        name: `Event ${validatedData.eventId}`,
      },
    });

    if (!project) {
      project = await prisma.project.create({
        data: {
          name: `Event ${validatedData.eventId}`,
          slug: `event-${validatedData.eventId}-${Date.now()}`,
          description: 'Day-of-show tasks',
          status: 'IN_PROGRESS',
          createdBy: session.user.id,
          organizationId: 'default', // Should be fetched from event
        },
      });
    }

    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        projectId: project.id,
        createdBy: session.user.id,
        assigneeId: validatedData.assignedTo,
        priority: validatedData.priority,
        status: 'PENDING',
        dueDate: validatedData.dueTime ? new Date(validatedData.dueTime) : undefined,
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
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          task,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }

    console.error('Day-of-show task creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create task',
        },
      },
      { status: 500 }
    );
  }
}
