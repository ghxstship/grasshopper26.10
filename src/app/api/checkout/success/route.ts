import { NextRequest } from 'next/server';
import { successResponse, handleApiError } from '@/lib/api/response';
import { retrieveCheckoutSession } from '@/lib/integrations/stripe/checkout';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { CheckoutService } from '@/lib/services/checkout/success.service';
import { errors } from '@/lib/api/errors';




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
        const order = await new CheckoutService().create({
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
