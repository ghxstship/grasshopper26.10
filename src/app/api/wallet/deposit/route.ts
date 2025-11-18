import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount } = body;

    const wallet = await prisma.wallet.update({
      where: { userId: session.user.id },
      data: { balance: { increment: amount } },
    });

    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'DEPOSIT',
        amount,
        status: 'COMPLETED',
      },
    });

    return NextResponse.json({ balance: wallet.balance });
  } catch (error) {
    console.error('Error depositing funds:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
