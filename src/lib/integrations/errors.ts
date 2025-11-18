/**
 * Integration error handling utilities
 */

export class IntegrationError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'IntegrationError';
  }
}

export class StripeError extends IntegrationError {
  constructor(message: string, details?: unknown) {
    super('STRIPE_ERROR', message, details);
    this.name = 'StripeError';
  }
}

export class MapboxError extends IntegrationError {
  constructor(message: string, details?: unknown) {
    super('MAPBOX_ERROR', message, details);
    this.name = 'MapboxError';
  }
}

export class Web3Error extends IntegrationError {
  constructor(message: string, details?: unknown) {
    super('WEB3_ERROR', message, details);
    this.name = 'Web3Error';
  }
}

export class EmailError extends IntegrationError {
  constructor(message: string, details?: unknown) {
    super('EMAIL_ERROR', message, details);
    this.name = 'EmailError';
  }
}

export class SMSError extends IntegrationError {
  constructor(message: string, details?: unknown) {
    super('SMS_ERROR', message, details);
    this.name = 'SMSError';
  }
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('rate limit') || 
           message.includes('too many requests') ||
           message.includes('429');
  }
  return false;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('network') ||
           message.includes('timeout') ||
           message.includes('econnrefused') ||
           message.includes('enotfound');
  }
  return false;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('unauthorized') ||
           message.includes('authentication') ||
           message.includes('invalid api key') ||
           message.includes('401') ||
           message.includes('403');
  }
  return false;
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on auth errors
      if (isAuthError(error)) {
        throw lastError;
      }

      // Only retry on rate limit or network errors
      if (!isRateLimitError(error) && !isNetworkError(error)) {
        throw lastError;
      }

      // Don't wait after the last attempt
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
