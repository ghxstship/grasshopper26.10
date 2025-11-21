import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const onboardingSchema = z.object({
  displayName: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
  interests: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = onboardingSchema.parse(body);

    // Update user profile with onboarding data
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.displayName,
        bio: validatedData.bio,
      },
    });

    // Store interests in user preferences or metadata if needed
    // For now, we'll just acknowledge them in the response
    const interests = validatedData.interests || [];

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          bio: updatedUser.bio,
        },
        interests,
      },
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid data', details: error.issues } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to complete onboarding' } },
      { status: 500 }
    );
  }
}
