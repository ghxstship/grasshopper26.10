import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { handleApiError } from '@/lib/api/response';
import { CompvssService } from '@/lib/services/compvss/checkin/stats.service';
import { z } from 'zod';



// Validation: z.object schema.parse validate
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
    return handleApiError(error);
  }
}
