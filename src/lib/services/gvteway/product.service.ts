/**
 * GVTEWAY Product Service
 * Handles product catalog management for merchandise
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { AuditService } from '../shared/audit.service';

export class ProductService {
  /**
   * Get all products with filtering
   */
  static async getAll(params: {
    category?: string;
    search?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    page?: number;
    limit?: number;
  }) {
    const {
      category,
      search,
      featured,
      minPrice,
      maxPrice,
      inStock,
      page = 1,
      limit = 20,
    } = params;

    const where: Prisma.ProductWhereInput = {
      ...(category && { category }),
      ...(featured !== undefined && { featured }),
      ...(inStock && { stock: { gt: 0 } }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single product by ID
   */
  static async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  /**
   * Get product by slug
   */
  static async getBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  /**
   * Create a new product
   */
  static async create(data: {
    name: string;
    slug: string;
    description?: string;
    price: number;
    category?: string;
    imageUrl?: string;
    images?: string[];
    stock?: number;
    featured?: boolean;
    currency?: string;
    createdBy: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        category: data.category,
        imageUrl: data.imageUrl,
        images: data.images || [],
        stock: data.stock || 0,
        featured: data.featured || false,
        currency: data.currency || 'USD',
        metadata: data.metadata || {},
      },
    });

    await AuditService.log({
      userId: data.createdBy,
      action: 'CREATE',
      entity: 'Product',
      entityId: product.id,
      metadata: { name: data.name, price: data.price },
    });

    return product;
  }

  /**
   * Update a product
   */
  static async update(
    id: string,
    userId: string,
    data: Partial<{
      name: string;
      slug: string;
      description: string;
      price: number;
      category: string;
      imageUrl: string;
      images: string[];
      stock: number;
      featured: boolean;
      currency: string;
      metadata: Prisma.InputJsonValue;
    }>
  ) {
    const updated = await prisma.product.update({
      where: { id },
      data,
    });

    await AuditService.log({
      userId,
      action: 'UPDATE',
      entity: 'Product',
      entityId: id,
      metadata: data as Record<string, unknown>,
    });

    return updated;
  }

  /**
   * Delete a product
   */
  static async delete(id: string, userId: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        cartItems: true,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.cartItems.length > 0) {
      // Soft delete - mark as not featured and out of stock
      await prisma.product.update({
        where: { id },
        data: { featured: false, stock: 0 },
      });
    } else {
      // Hard delete if no cart items
      await prisma.product.delete({
        where: { id },
      });
    }

    await AuditService.log({
      userId,
      action: 'DELETE',
      entity: 'Product',
      entityId: id,
    });

    return { success: true };
  }

  /**
   * Update product stock
   */
  static async updateStock(params: {
    productId: string;
    quantity: number;
    operation: 'ADD' | 'SUBTRACT' | 'SET';
    userId: string;
  }) {
    const { productId, quantity, operation, userId } = params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    let newStock: number;
    if (operation === 'SET') {
      newStock = quantity;
    } else if (operation === 'ADD') {
      newStock = product.stock + quantity;
    } else {
      newStock = product.stock - quantity;
    }

    // Prevent negative stock
    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        stock: newStock,
      },
    });

    await AuditService.log({
      userId,
      action: 'UPDATE_STOCK',
      entity: 'Product',
      entityId: productId,
      metadata: {
        operation,
        quantity,
        oldStock: product.stock,
        newStock,
      },
    });

    return updated;
  }

  /**
   * Get products by category
   */
  static async getByCategory(category: string, limit = 20) {
    return prisma.product.findMany({
      where: {
        category,
        stock: { gt: 0 },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Get featured products
   */
  static async getFeatured(limit = 10) {
    return prisma.product.findMany({
      where: {
        featured: true,
        stock: { gt: 0 },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Search products
   */
  static async search(params: {
    query: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    const { query, category, minPrice, maxPrice, page = 1, limit = 20 } = params;

    const where: Prisma.ProductWhereInput = {
      stock: { gt: 0 },
      ...(category && { category }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Check product availability
   */
  static async checkAvailability(productId: string, quantity: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      return {
        available: false,
        reason: 'Insufficient stock',
        availableStock: product.stock,
      };
    }

    return {
      available: true,
      availableStock: product.stock,
    };
  }
}
