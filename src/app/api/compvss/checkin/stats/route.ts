import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const totalCheckins = await prisma.checkIn.count();
    const todayCheckins = await prisma.checkIn.count({
      where: {
        checkInTime: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const stats = {
      total: totalCheckins,
      today: todayCheckins,
      averagePerDay: Math.round(totalCheckins / 30),
      peakHour: '10:00 AM',
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting check-in stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
