import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateProductSchema } from '@/lib/validations/products';
import { successResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth,  } from '@/lib/api/middleware';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/products/[id] - Get product by ID
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw errors.notFound('Product');
    }

    return successResponse(product);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/products/[id] - Update product
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await parseBody(request);
    const validatedData = updateProductSchema.parse(body);

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw errors.notFound('Product');
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: validatedData as any,
    });

    return successResponse(product);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw errors.notFound('Product');
    }

    // Delete product
    await prisma.product.delete({
      where: { id: id },
    });

    return successResponse({ message: 'Product deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
