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

    const event = await prisma.event.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error cancelling event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
