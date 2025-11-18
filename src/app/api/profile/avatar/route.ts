import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { uploadToSupabase } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      throw errors.badRequest('No file provided');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw errors.badRequest('File must be an image');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw errors.badRequest('File size must be less than 5MB');
    }

    // Upload to Supabase
    const fileUrl = await uploadToSupabase(file, `avatars/${context.userId}`);

    // Update user profile
    const user = await prisma.user.update({
      where: { id: context.userId },
      data: { image: fileUrl },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}
