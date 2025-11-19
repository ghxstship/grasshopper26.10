/**
 * Reset Password API Route
 * Agent 1: Database & Auth Architect
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashToken, isTokenExpired } from '@/lib/auth/tokens';
import { hashPassword, validatePasswordStrength } from '@/lib/auth/password';
import { passwordResetSchema } from '@/lib/validations/auth';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { parseBody, rateLimit, getClientIdentifier } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { ResetPasswordService } from "@/lib/services/auth/resetPassword.service";



export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting - prevent password reset abuse
    const identifier = getClientIdentifier(request);
    if (!rateLimit(
      RateLimitIdentifiers.byIP(identifier),
      RATE_LIMITS.AUTH_PASSWORD_RESET.limit,
      RATE_LIMITS.AUTH_PASSWORD_RESET.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const body = await parseBody(request);
    const validatedData = passwordResetSchema.parse(body);
    const { token, password } = validatedData;

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      throw errors.badRequest('Password does not meet requirements', {
        errors: passwordValidation.errors,
      });
    }

    // Find token
    const tokenHash = hashToken(token);
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: tokenHash,
        used: false,
      },
      include: {
        user: true,
      },
    });

    if (!resetToken) {
      throw errors.badRequest('Invalid or expired reset token');
    }

    // Check if token is expired
    if (isTokenExpired(resetToken.expiresAt)) {
      throw errors.badRequest('Reset token has expired');
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    return successResponse({
      message: 'Password reset successfully',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
