/**
 * Webhook signature validation utilities
 * These use Node.js crypto module and should NOT be imported in Edge Runtime/middleware
 */

/**
 * Validate Stripe webhook signature
 */
export async function validateStripeWebhook(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const crypto = await import('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
  } catch {
    return false;
  }
}

/**
 * Validate SendGrid webhook signature
 */
export async function validateSendGridWebhook(
  payload: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  try {
    const crypto = await import('crypto');
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(payload);
    return verify.verify(publicKey, signature, 'base64');
  } catch {
    return false;
  }
}

/**
 * Validate Twilio webhook signature
 */
export async function validateTwilioWebhook(
  url: string,
  params: Record<string, string>,
  signature: string,
  authToken: string
): Promise<boolean> {
  try {
    const crypto = await import('crypto');
    
    // Build data string
    const data = Object.keys(params)
      .sort()
      .reduce((acc, key) => acc + key + params[key], url);
    
    // Compute signature
    const expectedSignature = crypto
      .createHmac('sha1', authToken)
      .update(Buffer.from(data, 'utf-8'))
      .digest('base64');
    
    return signature === expectedSignature;
  } catch {
    return false;
  }
}
