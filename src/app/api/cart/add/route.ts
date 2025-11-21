import { NextRequest } from 'next/server';
import { addToCartSchema } from '@/lib/validations/products';
import { createdResponse, handleApiError, errors } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { CartService } from '@/lib/services/cart/items.service';
import { prisma } from '@/lib/prisma';

// POST /api/cart/add - Add item to cart (alias for /api/cart/items)
export async function POST(request: NextRequest) {
  try {
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
    const validatedData = addToCartSchema.parse(body);

    // Check if product exists and has stock
    const product = await new CartService().findById({
      where: { id: validatedData.productId },
    }) as any;

    if (!product) {
      throw errors.notFound('Product');
    }

    if (product.stock < validatedData.quantity) {
      throw errors.badRequest('Insufficient stock available');
    }

    // Get or create cart
    let cart = await new CartService().findById({
      where: { userId: context.userId },
    }) as any;

    if (!cart) {
      cart = await new CartService().create({
        data: { userId: context.userId! },
      });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: validatedData.productId,
      },
    });

    let cartItem;

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + validatedData.quantity;

      if (product.stock < newQuantity) {
        throw errors.badRequest('Insufficient stock for requested quantity');
      }

      cartItem = await new CartService().update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
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
    } else {
      // Add new item
      cartItem = await new CartService().create({
        data: {
          cartId: cart.id,
          productId: validatedData.productId,
          quantity: validatedData.quantity,
        },
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
    }

    return createdResponse(cartItem);
  } catch (error) {
    return handleApiError(error);
  }
}
