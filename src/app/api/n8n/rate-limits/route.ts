import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/webhook-utils';
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { handleApiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';


/**
 * N8N Rate Limit Status API
 * Check current rate limit status for API endpoints
 */
export async function GET(request: NextRequest) {
  try {
    // Database: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
    const context = await validateRequest(request);
    requireAuth(context);

    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get('identifier') || 'default';

    const rateLimit = checkRateLimit(identifier, 100, 60000);

    return NextResponse.json({
      identifier,
      allowed: rateLimit.allowed,
      remaining: rateLimit.remaining,
      resetAt: new Date(rateLimit.resetAt).toISOString(),
      limit: 100,
      window: '60s',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
