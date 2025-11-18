/**
 * Service Enhancers
 * Utilities to add transactions, retry logic, and error handling to services
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '@/lib/monitoring/logger';

const prisma = new PrismaClient();

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  maxDelayMs?: number;
  retryableErrors?: Array<string | RegExp>;
}

const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  maxDelayMs: 30000,
  retryableErrors: [
    /ECONNRESET/,
    /ETIMEDOUT/,
    /ENOTFOUND/,
    /503/,
    /429/,
    'Network request failed',
  ],
};

/**
 * Check if error is retryable
 */
function isRetryableError(error: Error, retryableErrors: Array<string | RegExp>): boolean {
  const errorMessage = error.message;
  
  return retryableErrors.some((pattern) => {
    if (typeof pattern === 'string') {
      return errorMessage.includes(pattern);
    }
    return pattern.test(errorMessage);
  });
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry wrapper for async functions
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const fullConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error | undefined;
  let delay = fullConfig.delayMs;

  for (let attempt = 1; attempt <= fullConfig.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if should retry
      if (
        attempt === fullConfig.maxAttempts ||
        !isRetryableError(lastError, fullConfig.retryableErrors)
      ) {
        throw lastError;
      }

      // Log retry attempt
      logger.warn(`Retry attempt ${attempt}/${fullConfig.maxAttempts}`, {
        error: lastError.message,
        delay,
      });

      // Wait before retry
      await sleep(delay);

      // Exponential backoff
      delay = Math.min(
        delay * fullConfig.backoffMultiplier,
        fullConfig.maxDelayMs
      );
    }
  }

  throw lastError;
}

/**
 * Transaction wrapper
 */
export async function withTransaction<T>(
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(async (tx) => {
    try {
      const result = await fn(tx as PrismaClient);
      logger.debug('Transaction completed successfully');
      return result;
    } catch (error) {
      logger.error('Transaction failed', error);
      throw error;
    }
  });
}

/**
 * Circuit breaker state
 */
interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  state: 'closed' | 'open' | 'half-open';
}

const circuitBreakers = new Map<string, CircuitBreakerState>();

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  failureThreshold?: number;
  resetTimeoutMs?: number;
  halfOpenAttempts?: number;
}

const DEFAULT_CIRCUIT_BREAKER_CONFIG: Required<CircuitBreakerConfig> = {
  failureThreshold: 5,
  resetTimeoutMs: 60000, // 1 minute
  halfOpenAttempts: 1,
};

/**
 * Circuit breaker wrapper
 */
export async function withCircuitBreaker<T>(
  key: string,
  fn: () => Promise<T>,
  config: CircuitBreakerConfig = {}
): Promise<T> {
  const fullConfig = { ...DEFAULT_CIRCUIT_BREAKER_CONFIG, ...config };
  
  // Get or create circuit breaker state
  let state = circuitBreakers.get(key);
  if (!state) {
    state = { failures: 0, lastFailureTime: 0, state: 'closed' };
    circuitBreakers.set(key, state);
  }

  const now = Date.now();

  // Check if circuit should reset
  if (
    state.state === 'open' &&
    now - state.lastFailureTime > fullConfig.resetTimeoutMs
  ) {
    state.state = 'half-open';
    state.failures = 0;
    logger.info(`Circuit breaker ${key} entering half-open state`);
  }

  // Reject if circuit is open
  if (state.state === 'open') {
    const error = new Error(`Circuit breaker ${key} is open`);
    logger.warn('Circuit breaker rejected request', { key });
    throw error;
  }

  try {
    const result = await fn();

    // Success - reset failures if in half-open state
    if (state.state === 'half-open') {
      state.state = 'closed';
      state.failures = 0;
      logger.info(`Circuit breaker ${key} closed`);
    }

    return result;
  } catch (error) {
    state.failures++;
    state.lastFailureTime = now;

    // Open circuit if threshold exceeded
    if (state.failures >= fullConfig.failureThreshold) {
      state.state = 'open';
      logger.error(`Circuit breaker ${key} opened`, error, {
        failures: state.failures,
        threshold: fullConfig.failureThreshold,
      });
    }

    throw error;
  }
}

/**
 * Combine retry with circuit breaker
 */
export async function withRetryAndCircuitBreaker<T>(
  key: string,
  fn: () => Promise<T>,
  retryConfig: RetryConfig = {},
  circuitBreakerConfig: CircuitBreakerConfig = {}
): Promise<T> {
  return await withCircuitBreaker(
    key,
    () => withRetry(fn, retryConfig),
    circuitBreakerConfig
  );
}

/**
 * Batch operation with transaction
 */
export async function batchWithTransaction<T, R>(
  items: T[],
  operation: (item: T, tx: PrismaClient) => Promise<R>,
  batchSize: number = 100
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    const batchResults = await withTransaction(async (tx) => {
      return await Promise.all(
        batch.map((item) => operation(item, tx))
      );
    });

    results.push(...batchResults);
    
    logger.debug(`Processed batch ${i / batchSize + 1}`, {
      processed: Math.min(i + batchSize, items.length),
      total: items.length,
    });
  }

  return results;
}

/**
 * Idempotency key manager
 */
const idempotencyCache = new Map<string, { result: any; expiresAt: number }>();

/**
 * Idempotent operation wrapper
 */
export async function withIdempotency<T>(
  key: string,
  fn: () => Promise<T>,
  ttlMs: number = 24 * 60 * 60 * 1000 // 24 hours
): Promise<T> {
  const now = Date.now();
  
  // Check cache
  const cached = idempotencyCache.get(key);
  if (cached && cached.expiresAt > now) {
    logger.debug('Idempotency cache hit', { key });
    return cached.result;
  }

  // Execute and cache
  const result = await fn();
  idempotencyCache.set(key, {
    result,
    expiresAt: now + ttlMs,
  });

  // Cleanup expired entries periodically
  if (Math.random() < 0.01) { // 1% chance
    for (const [k, v] of idempotencyCache.entries()) {
      if (v.expiresAt < now) {
        idempotencyCache.delete(k);
      }
    }
  }

  return result;
}

/**
 * Service method enhancer
 */
export function enhanceServiceMethod<T extends (...args: any[]) => Promise<any>>(
  method: T,
  options: {
    retry?: RetryConfig;
    transaction?: boolean;
    circuitBreaker?: { key: string; config?: CircuitBreakerConfig };
    idempotency?: { keyFn: (...args: Parameters<T>) => string; ttlMs?: number };
  } = {}
): T {
  return (async (...args: Parameters<T>) => {
    let fn = () => method(...args);

    // Add idempotency
    if (options.idempotency) {
      const key = options.idempotency.keyFn(...args);
      fn = () => withIdempotency(key, () => method(...args), options.idempotency!.ttlMs);
    }

    // Add transaction
    if (options.transaction) {
      const originalFn = fn;
      fn = () => withTransaction((_tx) => originalFn());
    }

    // Add retry
    if (options.retry) {
      const originalFn = fn;
      fn = () => withRetry(originalFn, options.retry);
    }

    // Add circuit breaker
    if (options.circuitBreaker) {
      const originalFn = fn;
      fn = () => withCircuitBreaker(
        options.circuitBreaker!.key,
        originalFn,
        options.circuitBreaker!.config
      );
    }

    return await fn();
  }) as T;
}

/**
 * Example usage:
 * 
 * // Simple retry
 * const fetchData = withRetry(async () => {
 *   return await externalAPI.getData();
 * });
 * 
 * // Transaction
 * const result = await withTransaction(async (tx) => {
 *   await tx.user.create({ data: { name: 'John' } });
 *   await tx.profile.create({ data: { userId: 'john' } });
 * });
 * 
 * // Circuit breaker
 * const data = await withCircuitBreaker('external-api', async () => {
 *   return await externalAPI.getData();
 * });
 * 
 * // Combined
 * const data = await withRetryAndCircuitBreaker(
 *   'external-api',
 *   async () => externalAPI.getData(),
 *   { maxAttempts: 3 },
 *   { failureThreshold: 5 }
 * );
 * 
 * // Enhance service method
 * class MyService {
 *   createUser = enhanceServiceMethod(
 *     async (data: UserData) => {
 *       // implementation
 *     },
 *     {
 *       transaction: true,
 *       retry: { maxAttempts: 3 },
 *       idempotency: {
 *         keyFn: (data) => `create-user:${data.email}`,
 *       },
 *     }
 *   );
 * }
 */
