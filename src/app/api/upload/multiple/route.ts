import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { uploadToSupabase } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      throw errors.badRequest('No files provided');
    }

    // Validate max files (10)
    if (files.length > 10) {
      throw errors.badRequest('Maximum 10 files allowed');
    }

    // Upload all files
    const uploadPromises = files.map(async (file, index) => {
      // Validate file size (max 10MB per file)
      if (file.size > 10 * 1024 * 1024) {
        throw errors.badRequest(`File ${file.name} exceeds 10MB limit`);
      }

      const fileUrl = await uploadToSupabase(file, `uploads/${context.userId}/${Date.now()}-${index}`);
      
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    return successResponse({ files: uploadedFiles });
  } catch (error) {
    return handleApiError(error);
  }
}
