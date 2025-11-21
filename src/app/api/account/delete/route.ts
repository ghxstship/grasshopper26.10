/**
 * Account Deletion API Route
 * Handles permanent user account deletion
 */

import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import bcrypt from 'bcryptjs';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { z } from 'zod';
import { prisma } from '@/lib/prisma';



const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  confirmation: z.literal('DELETE'),
});

/**
 * DELETE /api/account/delete - Permanently delete user account
 * Requires password confirmation
 */
export async function DELETE(request: NextRequest) {
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
    const validation = deleteAccountSchema.safeParse(body);

    if (!validation.success) {
      return handleApiError(new Error('Invalid deletion request'));
    }

    const { password } = validation.data;

    // Get user with password for verification
    const user = await prisma.user.findUnique({
      where: { id: context.userId },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      return handleApiError(new Error('User not found'));
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return handleApiError(new Error('Invalid password'));
    }

    // Delete user and all related data (cascade delete via Prisma schema)
    await prisma.user.delete({
      where: { id: context.userId },
    });

    return successResponse({
      message: 'Account deleted successfully',
      email: user.email,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
