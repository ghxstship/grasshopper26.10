import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateCartItemSchema } from '@/lib/validations/products';
import { successResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth, rateLimit,  } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// PATCH /api/cart/items/[id] - Update cart item quantity
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.WRITE_OPERATIONS.limit,
      RATE_LIMITS.WRITE_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const body = await parseBody(request);
    const validatedData = updateCartItemSchema.parse(body);

    // Get cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: id },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem) {
      throw errors.notFound('Cart item');
    }

    // Check ownership
    if (cartItem.cart.userId !== context.userId) {
      throw errors.forbidden();
    }

    // Check stock
    if (cartItem.product.stock < validatedData.quantity) {
      throw errors.badRequest('Insufficient stock available');
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: id },
      data: { quantity: validatedData.quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            currency: true,
            images: true,
          },
        },
      },
    });

    return successResponse(updatedItem);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/cart/items/[id] - Remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.WRITE_OPERATIONS.limit,
      RATE_LIMITS.WRITE_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    // Get cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: id },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      throw errors.notFound('Cart item');
    }

    // Check ownership
    if (cartItem.cart.userId !== context.userId) {
      throw errors.forbidden();
    }

    // Delete item
    await prisma.cartItem.delete({
      where: { id: id },
    });

    return successResponse({ message: 'Item removed from cart' });
  } catch (error) {
    return handleApiError(error);
  }
}
