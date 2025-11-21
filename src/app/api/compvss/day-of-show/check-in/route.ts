import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const checkInSchema = z.object({
  eventId: z.string(),
  userId: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

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
    const validatedData = checkInSchema.parse(body);

    const checkIn = await prisma.checkIn.create({
      data: {
        userId: validatedData.userId || session.user.id,
        type: 'event',
        targetId: validatedData.eventId,
        location: validatedData.location,
        checkInTime: new Date(),
        metadata: validatedData.notes ? { notes: validatedData.notes } : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
    });

    // Create notification for check-in
    await prisma.notification.create({
      data: {
        userId: validatedData.userId || session.user.id,
        type: 'CHECK_IN',
        title: 'Check-in Successful',
        message: `You have checked in at ${validatedData.location || 'the event'}`,
        read: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          checkIn,
          message: 'Check-in successful',
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

    console.error('Check-in error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to check in',
        },
      },
      { status: 500 }
    );
  }
}

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
    const userId = searchParams.get('userId');

    const where: any = {};
    
    if (eventId) {
      where.eventId = eventId;
    }
    
    if (userId) {
      where.userId = userId;
    }

    const checkIns = await prisma.checkIn.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
      orderBy: {
        checkInTime: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        checkIns,
        count: checkIns.length,
      },
    });
  } catch (error) {
    console.error('Check-ins fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch check-ins',
        },
      },
      { status: 500 }
    );
  }
}
