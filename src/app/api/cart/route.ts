import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError,  } from '@/lib/api/response';
import { validateRequest, requireAuth,  } from '@/lib/api/middleware';

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: context.userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: context.userId! },
      });
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: true,
      },
    });

    // Calculate totals
    const subtotal = cartItems.reduce((sum: number, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    return successResponse({
      cart: { ...cart, items: cartItems },
      summary: {
        itemCount: cartItems.length,
        totalQuantity: cartItems.reduce((sum: number, item) => sum + item.quantity, 0),
        subtotal,
        currency: cartItems[0]?.product.currency || 'USD',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
