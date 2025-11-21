/**
 * Profile Management API Route
 * Handles user profile CRUD operations
 */

import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { ProfileService } from '@/lib/services/profile.service';
import { z } from 'zod';


const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  image: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  instagram: z.string().max(50).optional(),
  twitter: z.string().max(50).optional(),
  phone: z.string().max(20).optional(),
  timezone: z.string().optional(),
});

/**
 * GET /api/profile - Get current user's profile
 */
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.READ_OPERATIONS.limit,
      RATE_LIMITS.READ_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const user = await new ProfileService().findById({
      where: { id: context.userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        organizations: {
          select: {
            id: true,
            role: true,
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
              },
            },
          },
        },
        _count: {
          select: {
            orders: true,
            tickets: true,
            wishlists: true,
          },
        },
      },
    });

    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/profile - Update current user's profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.WRITE_OPERATIONS.limit,
      RATE_LIMITS.WRITE_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const body = await request.json();
    const validation = updateProfileSchema.safeParse(body);

    if (!validation.success) {
      return handleApiError(new Error('Invalid profile data'));
    }

    const data = validation.data;

    // Update user profile
    const updatedUser = await new ProfileService().update({
      where: { id: context.userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        updatedAt: true,
      },
    });

    return successResponse({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/profile - Update current user's profile (alias for PATCH)
 */
export async function PUT(request: NextRequest) {
  return PATCH(request);
}
