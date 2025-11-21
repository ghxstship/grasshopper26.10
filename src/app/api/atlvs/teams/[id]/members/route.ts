import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const addMemberSchema = z.object({
  userId: z.string(),
  role: z.string().default('member'),
});

export async function GET(
  _request: NextRequest,
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

    const members = await prisma.teamMember.findMany({
      where: { teamId: id },
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

    return NextResponse.json({
      success: true,
      data: { members },
    });
  } catch (error) {
    console.error('Team members fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch members' } },
      { status: 500 }
    );
  }
}

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
    const data = addMemberSchema.parse(body);

    const existing = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: id,
          userId: data.userId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFLICT', message: 'User is already a team member' } },
        { status: 409 }
      );
    }

    const member = await prisma.teamMember.create({
      data: {
        teamId: id,
        userId: data.userId,
        role: data.role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    await prisma.notification.create({
      data: {
        userId: data.userId,
        type: 'TEAM_ADDED',
        title: 'Added to Team',
        message: `You have been added to a team`,
        read: false,
      },
    });

    return NextResponse.json({ success: true, data: { member } }, { status: 201 });
  } catch (error) {
    console.error('Add team member error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to add member' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'userId is required' } },
        { status: 400 }
      );
    }

    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId: id,
          userId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Member removed successfully' },
    });
  } catch (error) {
    console.error('Remove team member error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to remove member' } },
      { status: 500 }
    );
  }
}
