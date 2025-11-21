import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';

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

    const links = await prisma.referralLink.findMany({
      where: { userId: session.user.id },
      include: {
        uses: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    const totalConversions = links.reduce((sum, link) => sum + link.conversions, 0);
    const totalRevenue = links.reduce((sum, link) => sum + parseFloat(link.revenue.toString()), 0);

    return NextResponse.json({
      success: true,
      data: {
        links,
        stats: {
          totalClicks,
          totalConversions,
          totalRevenue,
          conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
        },
      },
    });
  } catch (error) {
    console.error('Referrals fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch referrals' } },
      { status: 500 }
    );
  }
}
