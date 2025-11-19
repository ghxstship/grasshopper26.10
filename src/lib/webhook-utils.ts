import crypto from 'crypto';

/**
 * Webhook Utility Functions
 * Handles webhook signature verification and validation
 */

const WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET || 'default-secret-change-in-production';

/**
 * Verify webhook signature using HMAC SHA256
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string | null
): boolean {
  if (!signature) {
    console.warn('No webhook signature provided');
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

/**
 * Generate webhook signature for outgoing webhooks
 */
export function generateWebhookSignature(payload: string): string {
  return crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
}

/**
 * Validate webhook payload structure
 */
export function validateWebhookPayload(payload: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!payload.event) {
    errors.push('Missing required field: event');
  }

  if (!payload.data) {
    errors.push('Missing required field: data');
  }

  if (payload.event && typeof payload.event !== 'string') {
    errors.push('Field "event" must be a string');
  }

  if (payload.data && typeof payload.data !== 'object') {
    errors.push('Field "data" must be an object');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Rate limiting for webhook endpoints
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Clean up expired rate limit records
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 60000); // Clean up every minute
