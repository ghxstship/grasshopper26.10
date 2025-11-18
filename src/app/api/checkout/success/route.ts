import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/response';
import { retrieveCheckoutSession } from '@/lib/integrations/stripe/checkout';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      throw new Error('Session ID required');
    }

    const session = await retrieveCheckoutSession(sessionId);

    if (session.payment_status === 'paid') {
      const userId = session.metadata?.userId;
      const eventId = session.metadata?.eventId;

      if (userId && eventId) {
        // Create order
        const order = await prisma.order.create({
          data: {
            userId,
            eventId,
            orderNumber: `ORD-${Date.now()}`,
            status: 'COMPLETED',
            subtotal: session.amount_subtotal! / 100,
            tax: 0,
            fees: 0,
            total: session.amount_total! / 100,
            currency: session.currency!.toUpperCase(),
            paymentIntent: session.payment_intent as string,
            paymentMethod: 'card',
          },
        });

        return successResponse({
          success: true,
          orderId: order.id,
          orderNumber: order.orderNumber,
        });
      }
    }

    return successResponse({
      success: true,
      session,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
