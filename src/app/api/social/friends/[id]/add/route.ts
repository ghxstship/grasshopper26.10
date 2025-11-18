import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    const friendship = await prisma.friendship.create({
      data: {
        userId: session.user.id,
        friendId: id,
        status: 'PENDING',
      },
    });

    return NextResponse.json(friendship, { status: 201 });
  } catch (error) {
    console.error('Error adding friend:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
