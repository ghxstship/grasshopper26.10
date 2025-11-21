import { NextRequest, NextResponse } from 'next/server';
import getServerSession from 'next-auth';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const loyalty = await prisma.loyaltyAccount.findUnique({
      where: { userId: session.user.id },
      include: {
        tier: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!loyalty) {
      // Create loyalty account if doesn't exist
      const newLoyalty = await prisma.loyaltyAccount.create({
        data: {
          userId: session.user.id,
          points: 0,
          lifetimePoints: 0,
          tierId: 'bronze', // Default tier
        },
        include: {
          tier: true,
          transactions: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: { loyalty: newLoyalty },
      });
    }

    return NextResponse.json({
      success: true,
      data: { loyalty },
    });
  } catch (error) {
    console.error('Loyalty points error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch points' } },
      { status: 500 }
    );
  }
}
