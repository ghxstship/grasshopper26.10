import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const loyalty = await prisma.loyaltyPoints.findUnique({
      where: { userId: session.user.id },
    });

    if (!loyalty) {
      // Create loyalty account if doesn't exist
      const newLoyalty = await prisma.loyaltyPoints.create({
        data: {
          userId: session.user.id,
          points: 0,
          lifetime: 0,
          tier: 'BRONZE',
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
