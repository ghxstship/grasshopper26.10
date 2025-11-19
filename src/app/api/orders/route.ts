import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOrderSchema } from '@/lib/validations/orders';
import { successResponse, createdResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, getPaginationParams, validateRequest, requireAuth, rateLimit,  } from '@/lib/api/middleware';
import { Decimal } from '@prisma/client/runtime/library';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { OrdersService } from '@/lib/services/orders.service';


// GET /api/orders - List user's orders
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.READ_OPERATIONS.limit,
      RATE_LIMITS.READ_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const { page, limit, skip } = getPaginationParams(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {
      userId: context.userId,
    };

    if (status) {
      where.status = status;
    }

    const total = await prisma.order.count({ where });

    const orders = await new OrdersService().findAll({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
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
              },
            },
          },
        },
      },
    });

    return successResponse(orders, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.PAYMENT_OPERATIONS.limit,
      RATE_LIMITS.PAYMENT_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const body = await parseBody(request);
    const validatedData = createOrderSchema.parse(body);

    // Calculate order totals
    let subtotal = new Decimal(0);
    const orderItems = [];

    for (const item of validatedData.items) {
      let itemPrice = new Decimal(0);
      let itemName = '';

      if (item.type === 'ticket') {
        const ticketType = await prisma.ticketType.findUnique({
          where: { id: item.itemId },
          include: { event: true },
        });

        if (!ticketType) {
          throw errors.notFound('Ticket type');
        }

        // Check availability
        if (ticketType.sold + item.quantity > ticketType.quantity) {
          throw errors.badRequest('Not enough tickets available');
        }

        itemPrice = new Decimal(ticketType.price.toString());
        itemName = `${ticketType.event.name} - ${ticketType.name}`;
      } else if (item.type === 'product') {
        const product = await prisma.product.findUnique({
          where: { id: item.itemId },
        });

        if (!product) {
          throw errors.notFound('Product');
        }

        if (product.stock < item.quantity) {
          throw errors.badRequest('Not enough stock available');
        }

        itemPrice = new Decimal(product.price.toString());
        itemName = product.name;
      } else if (item.type === 'adventure') {
        const adventure = await prisma.adventure.findUnique({
          where: { id: item.itemId },
        });

        if (!adventure) {
          throw errors.notFound('Adventure');
        }

        itemPrice = new Decimal(adventure.price.toString());
        itemName = adventure.name;
      }

      const itemTotal = itemPrice.mul(item.quantity);
      subtotal = subtotal.add(itemTotal);

      orderItems.push({
        type: item.type,
        itemId: item.itemId,
        name: itemName,
        quantity: item.quantity,
        price: itemPrice,
      });
    }

    // Calculate tax and fees (simplified - should be based on location/rules)
    const tax = subtotal.mul(0.08); // 8% tax
    const fees = subtotal.mul(0.05); // 5% service fee
    const total = subtotal.add(tax).add(fees);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = await new OrdersService().create({
      data: {
        userId: context.userId!,
        eventId: validatedData.eventId,
        orderNumber,
        status: 'PENDING',
        subtotal,
        tax,
        fees,
        total,
        currency: 'USD',
        metadata: validatedData.metadata ? JSON.parse(JSON.stringify(validatedData.metadata)) : undefined,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
        event: true,
      },
    });

    // Create Stripe payment intent
    const { getStripeClient } = await import('@/lib/integrations/stripe');
    const stripe = getStripeClient();
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total.toNumber() * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: context.userId!,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update order with payment intent ID
    await new OrdersService().update({
      where: { id: order.id },
      data: {
        paymentIntent: paymentIntent.id,
      },
    });

    // Note: Tickets will be generated after payment confirmation via webhook
    // See /api/webhooks/stripe/route.ts for ticket generation logic

    return createdResponse({
      ...order,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
