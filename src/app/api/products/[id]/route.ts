import { NextRequest } from 'next/server';
import { updateProductSchema } from '@/lib/validations/products';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth } from '@/lib/api/middleware';
import { ProductsService } from '@/lib/services/products/id.service';



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
    const product = await new ProductsService().findById({
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
    const existingProduct = await new ProductsService().findById({
      where: { id },
    });

    if (!existingProduct) {
      throw errors.notFound('Product');
    }

    // Update product
    const product = await new ProductsService().update({
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
    const existingProduct = await new ProductsService().findById({
      where: { id },
    });

    if (!existingProduct) {
      throw errors.notFound('Product');
    }

    // Delete product
    await new ProductsService().delete({
      where: { id: id },
    });

    return successResponse({ message: 'Product deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
