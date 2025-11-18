import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const members = await prisma.teamMember.findMany({
      where: { teamId: id },
      select: {
        id: true,
        userId: true,
        teamId: true,
        role: true,
        joinedAt: true,
      },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Error getting team members:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
