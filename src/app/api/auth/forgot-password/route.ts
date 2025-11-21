/**
 * Forgot Password API Route
 * Agent 1: Database & Auth Architect
 */

import { NextRequest } from 'next/server';
import { generatePasswordResetToken, hashToken } from '@/lib/auth/tokens';
import { passwordResetRequestSchema } from '@/lib/validations/auth';
import { SendGrid } from '@/lib/integrations';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { parseBody, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { prisma } from '@/lib/prisma';
import { getClientIdentifier } from '@/lib/api/middleware';



export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting - prevent password reset spam/enumeration
    const identifier = getClientIdentifier(request);
    if (!rateLimit(
      RateLimitIdentifiers.byIP(identifier),
      RATE_LIMITS.AUTH_PASSWORD_RESET.limit,
      RATE_LIMITS.AUTH_PASSWORD_RESET.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const body = await parseBody(request);
    const validatedData = passwordResetRequestSchema.parse(body);
    const { email } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return successResponse({
        message: 'If an account exists with that email, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const { token, expires } = generatePasswordResetToken();
    const tokenHash = hashToken(token);

    // Store token in database
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: tokenHash,
        expiresAt: expires,
      },
    });

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
    
    await SendGrid.sendEmail({
      to: email,
      subject: 'Reset Your Password - GVTEWAY',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">Reset Your Password</h2>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            This is an automated message from GVTEWAY. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    return successResponse({
      message: 'If an account exists with that email, a password reset link has been sent.',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
