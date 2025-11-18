import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const friends = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId: session.user.id, status: 'ACCEPTED' },
          { friendId: session.user.id, status: 'ACCEPTED' },
        ],
      },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        friend: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    return NextResponse.json({ friends });
  } catch (error) {
    console.error('Error getting friends:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
