import { NextRequest } from 'next/server';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { CartService } from '@/lib/services/cart.service';
import { errors } from '@/lib/api/errors';



// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
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

    // Get or create cart
    let cart = await new CartService().findById({
      where: { userId: context.userId },
    });

    if (!cart) {
      cart = await new CartService().create({
        data: { userId: context.userId! },
      });
    }

    // Get cart items
    const cartItems = await new CartService().findAll({
      where: { cartId: cart.id },
      include: {
        product: true,
      },
    }) as any[];

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
