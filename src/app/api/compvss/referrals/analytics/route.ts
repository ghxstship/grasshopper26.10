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

    const [links, profile] = await Promise.all([
      prisma.referralLink.findMany({
        where: { userId: session.user.id },
        include: {
          uses: true,
        },
      }),
      prisma.affiliateProfile.findUnique({
        where: { userId: session.user.id },
      }),
    ]);

    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    const totalConversions = links.reduce((sum, link) => sum + link.conversions, 0);
    const totalRevenue = links.reduce((sum, link) => sum + parseFloat(link.revenue.toString()), 0);

    const byTargetType = links.reduce((acc, link) => {
      if (!acc[link.targetType]) {
        acc[link.targetType] = { clicks: 0, conversions: 0, revenue: 0 };
      }
      acc[link.targetType].clicks += link.clicks;
      acc[link.targetType].conversions += link.conversions;
      acc[link.targetType].revenue += parseFloat(link.revenue.toString());
      return acc;
    }, {} as Record<string, { clicks: number; conversions: number; revenue: number }>);

    const topPerformers = links
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 10)
      .map(link => ({
        code: link.code,
        targetType: link.targetType,
        clicks: link.clicks,
        conversions: link.conversions,
        revenue: parseFloat(link.revenue.toString()),
        conversionRate: link.clicks > 0 ? (link.conversions / link.clicks) * 100 : 0,
      }));

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalClicks,
          totalConversions,
          totalRevenue,
          conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
          totalEarnings: profile?.totalEarned || 0,
        },
        byTargetType,
        topPerformers,
      },
    });
  } catch (error) {
    console.error('Referral analytics error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch analytics' } },
      { status: 500 }
    );
  }
}
