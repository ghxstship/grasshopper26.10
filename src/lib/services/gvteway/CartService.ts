/**
 * GVTEWAY Cart Service
 * Handles shopping cart operations for consumer platform
 */

import { BaseService, ServiceResult } from '../base/BaseService';

export interface AddToCartInput {
  userId: string;
  productId: string;
  quantity: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateCartItemInput {
  quantity: number;
}

export class CartService extends BaseService {
  /**
   * Get or create user's cart
   */
  async getOrCreateCart(userId: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      let cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: {
            userId,
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });
      }

      return cart;
    }, 'getOrCreateCart');
  }

  /**
   * Add item to cart
   */
  async addItem(input: AddToCartInput): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      this.validateRequired(input as unknown as Record<string, unknown>, [
        'userId',
        'productId',
        'quantity',
      ]);

      if (input.quantity <= 0) {
        throw {
          name: 'ValidationError',
          message: 'Quantity must be greater than 0',
        };
      }

      // Get or create cart
      const cartResult = await this.getOrCreateCart(input.userId);
      if (!cartResult.success || !cartResult.data) {
        throw {
          name: 'InternalError',
          message: 'Failed to get cart',
        };
      }

      const cart = cartResult.data as { id: string };

      // Check if item already exists
      const existingItem = await this.prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: input.productId,
        },
      });

      let cartItem;
      if (existingItem) {
        // Update quantity
        cartItem = await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + input.quantity,
          },
          include: {
            product: true,
          },
        });
      } else {
        // Create new item
        cartItem = await this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: input.productId,
            quantity: input.quantity,
          },
          include: {
            product: true,
          },
        });
      }

      await this.logAudit(input.userId, 'ADD_TO_CART', 'Cart', cart.id, {
        productId: input.productId,
        quantity: input.quantity,
      });

      return cartItem;
    }, 'addItem');
  }

  /**
   * Update cart item quantity
   */
  async updateItem(
    itemId: string,
    input: UpdateCartItemInput,
    userId: string
  ): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      if (input.quantity <= 0) {
        throw {
          name: 'ValidationError',
          message: 'Quantity must be greater than 0',
        };
      }

      const item = await this.prisma.cartItem.findUnique({
        where: { id: itemId },
        include: {
          cart: true,
        },
      });

      if (!item) {
        throw {
          name: 'NotFoundError',
          message: 'Cart item not found',
        };
      }

      if (item.cart.userId !== userId) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to update this cart item',
        };
      }

      const updatedItem = await this.prisma.cartItem.update({
        where: { id: itemId },
        data: {
          quantity: input.quantity,
        },
        include: {
          product: true,
        },
      });

      await this.logAudit(userId, 'UPDATE_CART_ITEM', 'Cart', item.cartId, {
        itemId,
        quantity: input.quantity,
      });

      return updatedItem;
    }, 'updateItem');
  }

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string, userId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const item = await this.prisma.cartItem.findUnique({
        where: { id: itemId },
        include: {
          cart: true,
        },
      });

      if (!item) {
        throw {
          name: 'NotFoundError',
          message: 'Cart item not found',
        };
      }

      if (item.cart.userId !== userId) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not have permission to remove this cart item',
        };
      }

      await this.prisma.cartItem.delete({
        where: { id: itemId },
      });

      await this.logAudit(userId, 'REMOVE_FROM_CART', 'Cart', item.cartId, {
        itemId,
        productId: item.productId,
      });
    }, 'removeItem');
  }

  /**
   * Clear cart
   */
  async clearCart(userId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        return;
      }

      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      await this.logAudit(userId, 'CLEAR_CART', 'Cart', cart.id);
    }, 'clearCart');
  }

  /**
   * Get cart total
   */
  async getCartTotal(userId: string): Promise<ServiceResult<number>> {
    return this.execute(async () => {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart) {
        return 0;
      }

      const total = cart.items.reduce((sum, item) => {
        const price = typeof item.product.price === 'number' 
          ? item.product.price 
          : parseFloat(item.product.price.toString());
        return sum + (price * item.quantity);
      }, 0);

      return total;
    }, 'getCartTotal');
  }

  /**
   * Get cart item count
   */
  async getItemCount(userId: string): Promise<ServiceResult<number>> {
    return this.execute(async () => {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          items: true,
        },
      });

      if (!cart) {
        return 0;
      }

      const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      return count;
    }, 'getItemCount');
  }
}
