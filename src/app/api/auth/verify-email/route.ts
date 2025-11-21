/**
 * Email Verification API Route
 * Agent 1: Database & Auth Architect (using Agent 6's SendGrid integration)
 */

import { NextRequest, NextResponse } from 'next/server';
import { hashToken, isTokenExpired } from '@/lib/auth/tokens';
import { emailVerificationSchema } from '@/lib/validations/auth';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { handleApiError } from '@/lib/api/response';
import { errors } from '@/lib/api/errors';
import { prisma } from '@/lib/prisma';




export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.WRITE_OPERATIONS.limit,
        RATE_LIMITS.WRITE_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const body = await request.json();
    
    // Validate request
    const validation = emailVerificationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    const { token } = validation.data;

    // Find token
    const tokenHash = hashToken(token);
    const verificationToken = await prisma.emailVerificationToken.findFirst({
      where: {
        token: tokenHash,
        used: false,
      },
      include: {
        user: true,
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (isTokenExpired(verificationToken.expiresAt)) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Update user email verification status and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: new Date() },
      }),
      prisma.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({
      message: 'Email verified successfully',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
