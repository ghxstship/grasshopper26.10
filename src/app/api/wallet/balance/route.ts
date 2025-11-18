import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ balance: wallet?.balance || 0 });
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
