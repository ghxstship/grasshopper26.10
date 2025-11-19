/**
 * Resend Email Verification API Route
 * Allows users to request a new verification email
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { generateToken, hashToken } from '@/lib/auth/tokens';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { ResendVerificationService } from "@/lib/services/auth/resendVerification.service";
import { errors } from '@/lib/api/errors';



/**
 * POST /api/auth/resend-verification - Resend email verification
 */
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

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: context.userId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return handleApiError(new Error('User not found'));
    }

    // Check if already verified
    if (user.emailVerified) {
      return successResponse({
        message: 'Email already verified',
      });
    }

    // Invalidate old tokens
    await prisma.emailVerificationToken.updateMany({
      where: {
        userId: user.id,
        used: false,
      },
      data: {
        used: true,
      },
    });

    // Generate new verification token
    const token = generateToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: tokenHash,
        expiresAt,
      },
    });

    // Send verification email using notification system
    // The actual email sending is handled by the notification service/worker
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'EMAIL_VERIFICATION',
        title: 'Verify Your Email',
        message: 'Please verify your email address to complete registration',
        metadata: {
          token,
          verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`,
        },
      },
    });

    return successResponse({
      message: 'Verification email sent',
      email: user.email,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
