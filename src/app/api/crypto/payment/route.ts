import { NextRequest } from 'next/server';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { convertUsdToEth } from '@/lib/integrations/crypto/payment';
import { prisma } from '@/lib/prisma';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { z } from 'zod';
import { CryptoService } from '@/lib/services/crypto/payment.service';
import { errors } from '@/lib/api/errors';



export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { amount, currency, metadata } = body;

    if (!amount || amount <= 0) {
      return Response.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Convert USD to ETH
    const ethAmount = await convertUsdToEth(amount);

    // Generate unique payment address (in production, use a payment processor or smart contract)
    // For now, use a mock address
    const paymentAddress = process.env.CRYPTO_PAYMENT_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

    // Create pending crypto payment record
    const transactionId = `crypto_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Store payment intent in database
    const orderNumber = `ORD-${Date.now()}`;
    await new CryptoService().create({
      data: {
        orderNumber,
        userId: context.userId!,
        eventId: metadata?.eventId,
        status: 'PENDING',
        subtotal: amount,
        tax: 0,
        fees: 0,
        total: amount,
        currency: currency || 'USD',
        paymentMethod: 'crypto',
        paymentIntent: transactionId,
        metadata: {
          ...metadata,
          ethAmount,
          paymentAddress,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        },
      },
    });

    return successResponse({
      paymentAddress,
      amount: ethAmount,
      currency: 'ETH',
      transactionId,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      instructions: [
        'Send exactly the specified amount of ETH to the payment address',
        'Payment must be received within 30 minutes',
        'Do not send from an exchange - use a personal wallet',
        'Your order will be confirmed once the transaction is verified on the blockchain',
      ],
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Verify crypto payment
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
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      return Response.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Find the order
    const order = await prisma.order.findFirst({
      where: {
        paymentIntent: transactionId,
        userId: context.userId!,
      },
    });

    if (!order) {
      return Response.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return successResponse({
      transactionId,
      status: order.status,
      amount: order.total,
      createdAt: order.createdAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
