/**
 * Refund Service
 * Handles payment refunds via Stripe
 */

import Stripe from 'stripe';
import { BaseService } from '../base/BaseService';
import { ServiceResult } from '../base/BaseService';
import { getStripeClient } from '@/lib/integrations/stripe';

export interface RefundRequest {
  paymentIntentId: string;
  amount?: number; // Amount in cents, optional for partial refund
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
  metadata?: Record<string, string>;
}

export interface RefundResult {
  refundId: string;
  amount: number;
  status: string;
  created: number;
}

export class RefundService extends BaseService {
  /**
   * Process a refund via Stripe
   */
  async processRefund(request: RefundRequest): Promise<ServiceResult<RefundResult>> {
    return this.execute(async () => {
      try {
        const stripe = getStripeClient();
        
        // Create refund in Stripe
        const refund = await stripe.refunds.create({
          payment_intent: request.paymentIntentId,
          amount: request.amount, // If undefined, refunds full amount
          reason: request.reason || 'requested_by_customer',
          metadata: request.metadata || {},
        });

        // Log the refund
        console.log('Refund processed:', {
          refundId: refund.id,
          amount: refund.amount,
          status: refund.status,
        });

        return {
          refundId: refund.id,
          amount: refund.amount,
          status: refund.status || 'pending',
          created: refund.created,
        };
      } catch (error) {
        console.error('Stripe refund failed:', error);
        throw new Error(`Failed to process refund: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, 'processRefund');
  }

  /**
   * Get refund status from Stripe
   */
  async getRefundStatus(refundId: string): Promise<ServiceResult<Stripe.Refund>> {
    return this.execute(async () => {
      try {
        const stripe = getStripeClient();
        const refund = await stripe.refunds.retrieve(refundId);
        return refund;
      } catch (error) {
        console.error('Failed to retrieve refund:', error);
        throw new Error(`Failed to get refund status: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, 'getRefundStatus');
  }

  /**
   * List refunds for a payment intent
   */
  async listRefunds(paymentIntentId: string): Promise<ServiceResult<Stripe.Refund[]>> {
    return this.execute(async () => {
      try {
        const stripe = getStripeClient();
        const refunds = await stripe.refunds.list({
          payment_intent: paymentIntentId,
          limit: 100,
        });
        return refunds.data;
      } catch (error) {
        console.error('Failed to list refunds:', error);
        throw new Error(`Failed to list refunds: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, 'listRefunds');
  }

  /**
   * Cancel a pending refund
   */
  async cancelRefund(refundId: string): Promise<ServiceResult<Stripe.Refund>> {
    return this.execute(async () => {
      try {
        const stripe = getStripeClient();
        const refund = await stripe.refunds.cancel(refundId);
        return refund;
      } catch (error) {
        console.error('Failed to cancel refund:', error);
        throw new Error(`Failed to cancel refund: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, 'cancelRefund');
  }
}
