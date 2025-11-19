import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, parseBody, rateLimit } from '@/lib/api/middleware';
import { createCheckoutSession } from '@/lib/integrations/stripe/checkout';
import { createCheckoutSessionSchema } from '@/lib/validations/checkout';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Database: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting - prevent checkout spam
    const identifier = RateLimitIdentifiers.byUserId(context.userId);
    if (!rateLimit(identifier, RATE_LIMITS.PAYMENT_OPERATIONS.limit, RATE_LIMITS.PAYMENT_OPERATIONS.windowMs)) {
      throw errors.rateLimitExceeded();
    }

    // Parse and validate request body
    const body = await parseBody(request);
    const validatedData = createCheckoutSessionSchema.parse(body);

    // Validate items array
    if (!validatedData.items || validatedData.items.length === 0) {
      throw errors.badRequest('Cart is empty');
    }

    // Validate items total doesn't exceed reasonable limits
    const totalItems = validatedData.items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 100) {
      throw errors.badRequest('Too many items in cart');
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Create Stripe checkout session
    const session = await createCheckoutSession({
      items: validatedData.items,
      customerId: validatedData.metadata?.stripeCustomerId,
      successUrl: validatedData.successUrl || `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: validatedData.cancelUrl || `${baseUrl}/checkout/cancel`,
      metadata: {
        userId: context.userId,
        userEmail: context.userEmail,
        ...validatedData.metadata,
      },
    });

    if (!session || !session.id || !session.url) {
      throw errors.serverError('Failed to create checkout session');
    }

    return successResponse({
      sessionId: session.id,
      url: session.url,
      expiresAt: session.expires_at,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
