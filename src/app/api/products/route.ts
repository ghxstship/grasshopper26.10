import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createProductSchema, productFiltersSchema } from '@/lib/validations/products';
import { successResponse, createdResponse, handleApiError, errors,  } from '@/lib/api/response';
import { getPaginationParams, validateRequest, requireAuth,  } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { ProductsService } from '@/lib/services/products.service';



// GET /api/products - List products
export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);

    // Parse filters
    const filters = productFiltersSchema.parse(Object.fromEntries(searchParams));

    // Build where clause
    const where: Record<string, unknown> = {};

    if (filters.organizationId) where.organizationId = filters.organizationId;
    if (filters.category) where.category = filters.category;
    if (filters.status) where.status = filters.status;
    if (filters.featured !== undefined) where.featured = filters.featured;
    if (filters.inStock) where.stock = { gt: 0 };

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        (where.price as Record<string, unknown>).gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        (where.price as Record<string, unknown>).lte = filters.maxPrice;
      }
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Get total count and products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return successResponse(products, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/products - Create product
export async function POST(request: NextRequest) {
  try {
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

    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    // Generate slug if not provided
    const slug =
      validatedData.slug ||
      validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    // Check if slug is unique for this organization
    const existingProduct = await new ProductsService().findById({
      where: { slug },
    });

    if (existingProduct) {
      throw errors.conflict('Product with this slug already exists in this organization');
    }

    // Create product
    const product = await new ProductsService().create({
      data: {
        organization: validatedData.organizationId ? { connect: { id: validatedData.organizationId } } : undefined,
        name: validatedData.name,
        slug,
        description: validatedData.description,
        price: validatedData.price,
        currency: validatedData.currency,
        images: validatedData.images || [],
        category: validatedData.category,
        stock: validatedData.stock,
        metadata: validatedData.metadata ? JSON.parse(JSON.stringify(validatedData.metadata)) : undefined,
      },
    });

    return createdResponse(product);
  } catch (error) {
    return handleApiError(error);
  }
}
