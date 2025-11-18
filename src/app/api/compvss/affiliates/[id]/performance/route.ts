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
    const affiliate = await prisma.affiliateProfile.findUnique({ where: { id } });

    if (!affiliate) {
      return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
    }

    const performance = {
      totalReferrals: 0,
      totalRevenue: 0,
      conversionRate: 0,
      topProducts: [],
      monthlyStats: [],
    };

    return NextResponse.json(performance);
  } catch (error) {
    console.error('Error getting affiliate performance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
