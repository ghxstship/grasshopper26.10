import { NextRequest, NextResponse } from 'next/server';
import getServerSession from 'next-auth';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const redeemSchema = z.object({
  rewardId: z.string(),
  points: z.number().int().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = redeemSchema.parse(body);

    const loyalty = await prisma.loyaltyAccount.findUnique({
      where: { userId: session.user.id },
    });

    if (!loyalty || loyalty.points < data.points) {
      return NextResponse.json(
        { success: false, error: { code: 'INSUFFICIENT_POINTS', message: 'Not enough points' } },
        { status: 400 }
      );
    }

    // Deduct points and create transaction
    const [updatedLoyalty, transaction] = await prisma.$transaction([
      prisma.loyaltyAccount.update({
        where: { userId: session.user.id },
        data: {
          points: { decrement: data.points },
        },
      }),
      prisma.loyaltyTransaction.create({
        data: {
          accountId: loyalty.id,
          type: 'REDEMPTION',
          points: -data.points,
          description: `Redeemed ${data.points} points for reward`,
          metadata: { rewardId: data.rewardId },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        loyalty: updatedLoyalty,
        transaction,
      },
    });
  } catch (error) {
    console.error('Points redemption error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Redemption failed' } },
      { status: 500 }
    );
  }
}
