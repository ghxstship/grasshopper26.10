import { NextRequest } from 'next/server';
import { updateOrderStatusSchema } from '@/lib/validations/orders';
import type { Prisma as _Prisma } from '@prisma/client';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth } from '@/lib/api/middleware';
import { OrdersService } from '@/lib/services/orders/id.service';



type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/orders/[id] - Get order details
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const order = await new OrdersService().findById({
      where: { id: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            startDate: true,
            venue: {
              select: {
                name: true,
                city: true,
                state: true,
              },
            },
          },
        },
        items: true,
        tickets: {
          select: {
            id: true,
            qrCode: true,
            status: true,
            seatNumber: true,
            ticketType: {
              select: {
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw errors.notFound('Order');
    }

    // Check if user owns this order or is admin
    if (order.userId !== context.userId && context.userRole !== 'ADMIN') {
      throw errors.forbidden();
    }

    return successResponse(order);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await parseBody(request);
    const validatedData = updateOrderStatusSchema.parse(body);

    // Check if order exists
    const existingOrder = await new OrdersService().findById({
      where: { id: id },
    });

    if (!existingOrder) {
      throw errors.notFound('Order');
    }

    // Only admin or order owner can update
    if (existingOrder.userId !== context.userId && context.userRole !== 'ADMIN') {
      throw errors.forbidden();
    }

    // Update order
    const order = await new OrdersService().update({
      where: { id: id },
      data: {
        status: validatedData.status,
        metadata: existingOrder.metadata as never,
      },
      include: {
        items: true,
        tickets: true,
      },
    });

    // Send status update notification
    await new OrdersService().create({
      data: {
        userId: order.userId,
        type: 'ORDER_STATUS_UPDATE',
        title: 'Order Status Updated',
        message: `Your order ${order.orderNumber} status has been updated to ${validatedData.status}`,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          oldStatus: order.status,
          newStatus: validatedData.status,
        },
      },
    });

    return successResponse(order);
  } catch (error) {
    return handleApiError(error);
  }
}
