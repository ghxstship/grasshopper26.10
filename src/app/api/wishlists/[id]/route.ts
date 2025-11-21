import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { WishlistsService } from '@/lib/services/wishlists/id.service';



type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// DELETE /api/wishlists/[id] - Remove event from wishlist
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    // Find wishlist item
    const wishlist = await new WishlistsService().findById({
      where: { id: id },
    });

    if (!wishlist) {
      throw errors.notFound('Wishlist item');
    }

    // Check ownership
    if (wishlist.userId !== context.userId) {
      throw errors.forbidden();
    }

    // Delete wishlist item
    await new WishlistsService().delete({
      where: { id: id },
    });

    return successResponse({ message: 'Event removed from wishlist' });
  } catch (error) {
    return handleApiError(error);
  }
}
