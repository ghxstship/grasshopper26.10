import { NextRequest } from 'next/server';
import { noContentResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { deleteFromSupabase } from '@/lib/storage';

export async function DELETE(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');

    if (!fileUrl) {
      throw errors.badRequest('File URL required');
    }

    // Delete from Supabase
    await deleteFromSupabase(fileUrl);

    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
}
