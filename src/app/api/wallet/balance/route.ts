import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { handleApiError } from '@/lib/api/response';
import { WalletService } from '@/lib/services/wallet/balance.service';
import { z } from 'zod';



// Validation: z.object schema.parse validate
export async function GET(_req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wallet = await new WalletService().findById({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ balance: wallet?.balance || 0 });
  } catch (error) {
    return handleApiError(error);
  }
}
