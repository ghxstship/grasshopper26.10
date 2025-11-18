import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params: _params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const item = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        eventId: body.eventId,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error adding wishlist item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
