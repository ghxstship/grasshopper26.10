/**
 * Request Signing for Sensitive Operations
 * Ensures request integrity and prevents replay attacks
 */

import { createHmac, timingSafeEqual } from 'crypto';

const SIGNATURE_VERSION = 'v1';
const MAX_TIMESTAMP_DIFF_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Generate HMAC signature for request
 */
export function signRequest(
  method: string,
  path: string,
  body: string | object,
  timestamp: number,
  secret: string
): string {
  const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
  
  // Create signature payload
  const payload = [
    SIGNATURE_VERSION,
    timestamp.toString(),
    method.toUpperCase(),
    path,
    bodyString,
  ].join('\n');
  
  // Generate HMAC signature
  const signature = createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return `${SIGNATURE_VERSION}=${signature}`;
}

/**
 * Verify request signature
 */
export function verifyRequestSignature(
  method: string,
  path: string,
  body: string | object,
  timestamp: number,
  signature: string,
  secret: string
): {
  valid: boolean;
  error?: string;
} {
  // Check timestamp to prevent replay attacks
  const now = Date.now();
  const timestampDiff = Math.abs(now - timestamp);
  
  if (timestampDiff > MAX_TIMESTAMP_DIFF_MS) {
    return {
      valid: false,
      error: 'Request timestamp too old or too far in future',
    };
  }
  
  // Extract version and signature
  const [version, receivedSig] = signature.split('=');
  
  if (version !== SIGNATURE_VERSION) {
    return {
      valid: false,
      error: 'Invalid signature version',
    };
  }
  
  // Generate expected signature
  const expectedSignature = signRequest(method, path, body, timestamp, secret);
  const [, expectedSig] = expectedSignature.split('=');
  
  // Timing-safe comparison
  const receivedBuffer = Buffer.from(receivedSig, 'hex');
  const expectedBuffer = Buffer.from(expectedSig, 'hex');
  
  if (receivedBuffer.length !== expectedBuffer.length) {
    return {
      valid: false,
      error: 'Invalid signature',
    };
  }
  
  const valid = timingSafeEqual(receivedBuffer, expectedBuffer);
  
  return {
    valid,
    error: valid ? undefined : 'Invalid signature',
  };
}

/**
 * Generate signature headers for client requests
 */
export function generateSignatureHeaders(
  method: string,
  path: string,
  body: string | object,
  secret: string
): {
  'X-Signature': string;
  'X-Timestamp': string;
} {
  const timestamp = Date.now();
  const signature = signRequest(method, path, body, timestamp, secret);
  
  return {
    'X-Signature': signature,
    'X-Timestamp': timestamp.toString(),
  };
}

/**
 * Middleware to verify signed requests
 */
export function requireSignedRequest(
  method: string,
  path: string,
  body: string | object,
  headers: Record<string, string | undefined>,
  secret: string
): {
  valid: boolean;
  error?: string;
} {
  const signature = headers['x-signature'] || headers['X-Signature'];
  const timestamp = headers['x-timestamp'] || headers['X-Timestamp'];
  
  if (!signature) {
    return {
      valid: false,
      error: 'Missing X-Signature header',
    };
  }
  
  if (!timestamp) {
    return {
      valid: false,
      error: 'Missing X-Timestamp header',
    };
  }
  
  const timestampNum = parseInt(timestamp);
  
  if (isNaN(timestampNum)) {
    return {
      valid: false,
      error: 'Invalid timestamp format',
    };
  }
  
  return verifyRequestSignature(method, path, body, timestampNum, signature, secret);
}

/**
 * Generate webhook signature (for outgoing webhooks)
 */
export function signWebhook(
  payload: object,
  secret: string
): {
  signature: string;
  timestamp: number;
} {
  const timestamp = Date.now();
  const payloadString = JSON.stringify(payload);
  
  const signature = createHmac('sha256', secret)
    .update(`${timestamp}.${payloadString}`)
    .digest('hex');
  
  return {
    signature: `t=${timestamp},v1=${signature}`,
    timestamp,
  };
}

/**
 * Verify webhook signature (for incoming webhooks)
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): {
  valid: boolean;
  error?: string;
} {
  // Parse signature header (format: t=timestamp,v1=signature)
  const parts = signature.split(',');
  const timestampPart = parts.find(p => p.startsWith('t='));
  const signaturePart = parts.find(p => p.startsWith('v1='));
  
  if (!timestampPart || !signaturePart) {
    return {
      valid: false,
      error: 'Invalid signature format',
    };
  }
  
  const timestamp = parseInt(timestampPart.split('=')[1]);
  const receivedSig = signaturePart.split('=')[1];
  
  // Check timestamp
  const now = Date.now();
  if (Math.abs(now - timestamp) > MAX_TIMESTAMP_DIFF_MS) {
    return {
      valid: false,
      error: 'Webhook timestamp too old',
    };
  }
  
  // Generate expected signature
  const expectedSig = createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`)
    .digest('hex');
  
  // Timing-safe comparison
  const receivedBuffer = Buffer.from(receivedSig, 'hex');
  const expectedBuffer = Buffer.from(expectedSig, 'hex');
  
  if (receivedBuffer.length !== expectedBuffer.length) {
    return {
      valid: false,
      error: 'Invalid webhook signature',
    };
  }
  
  const valid = timingSafeEqual(receivedBuffer, expectedBuffer);
  
  return {
    valid,
    error: valid ? undefined : 'Invalid webhook signature',
  };
}

/**
 * Generate nonce for one-time operations
 */
export function generateNonce(): string {
  return createHmac('sha256', Date.now().toString())
    .update(Math.random().toString())
    .digest('hex');
}

/**
 * Nonce store for replay attack prevention
 */
const usedNonces = new Set<string>();
const MAX_NONCE_AGE_MS = 10 * 60 * 1000; // 10 minutes
const nonceTimestamps = new Map<string, number>();

/**
 * Check and mark nonce as used
 */
export function checkAndUseNonce(nonce: string): {
  valid: boolean;
  error?: string;
} {
  // Check if nonce was already used
  if (usedNonces.has(nonce)) {
    return {
      valid: false,
      error: 'Nonce already used (replay attack detected)',
    };
  }
  
  // Mark nonce as used
  usedNonces.add(nonce);
  nonceTimestamps.set(nonce, Date.now());
  
  return { valid: true };
}

/**
 * Cleanup old nonces (run periodically)
 */
export function cleanupOldNonces(): number {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [nonce, timestamp] of nonceTimestamps.entries()) {
    if (now - timestamp > MAX_NONCE_AGE_MS) {
      usedNonces.delete(nonce);
      nonceTimestamps.delete(nonce);
      cleaned++;
    }
  }
  
  return cleaned;
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupOldNonces, 5 * 60 * 1000);
}
