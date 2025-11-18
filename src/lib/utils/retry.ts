/**
 * Retry Utilities
 * Provides retry logic with exponential backoff for external API calls
 */

interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryOn?: (error: Error) => boolean;
  onRetry?: (error: Error, attempt: number) => void;
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2,
    retryOn = () => true,
    onRetry,
  } = options;

  let lastError: Error | undefined;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if we should retry
      if (attempt === maxAttempts || !retryOn(lastError)) {
        throw lastError;
      }

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(lastError, attempt);
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Increase delay with exponential backoff
      delay = Math.min(delay * backoffMultiplier, maxDelay);

      console.log(
        `Retry attempt ${attempt}/${maxAttempts} after ${delay}ms delay`
      );
    }
  }

  throw lastError;
}

/**
 * Retry with jitter to prevent thundering herd
 */
export async function retryWithJitter<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  return retry(fn, {
    ...options,
    initialDelay: options.initialDelay
      ? options.initialDelay * (0.5 + Math.random() * 0.5)
      : 1000,
  });
}

/**
 * Circuit breaker pattern
 * Stops retrying after too many failures
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime?: number;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private options: {
      failureThreshold?: number;
      resetTimeout?: number;
      monitoringPeriod?: number;
    } = {}
  ) {
    this.options.failureThreshold = options.failureThreshold || 5;
    this.options.resetTimeout = options.resetTimeout || 60000; // 1 minute
    this.options.monitoringPeriod = options.monitoringPeriod || 10000; // 10 seconds
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit should be reset
    if (
      this.state === 'open' &&
      this.lastFailureTime &&
      Date.now() - this.lastFailureTime > this.options.resetTimeout!
    ) {
      this.state = 'half-open';
      this.failures = 0;
    }

    // If circuit is open, fail fast
    if (this.state === 'open') {
      throw new Error('Circuit breaker is open');
    }

    try {
      const result = await fn();
      
      // Success - reset if in half-open state
      if (this.state === 'half-open') {
        this.state = 'closed';
        this.failures = 0;
      }
      
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();

      // Open circuit if threshold reached
      if (this.failures >= this.options.failureThreshold!) {
        this.state = 'open';
        console.error('Circuit breaker opened due to failures');
      }

      throw error;
    }
  }

  getState(): 'closed' | 'open' | 'half-open' {
    return this.state;
  }

  reset(): void {
    this.state = 'closed';
    this.failures = 0;
    this.lastFailureTime = undefined;
  }
}

/**
 * Predefined retry configurations for common scenarios
 */
export const retryConfigs = {
  // Quick retry for fast operations
  quick: {
    maxAttempts: 3,
    initialDelay: 500,
    maxDelay: 2000,
    backoffMultiplier: 2,
  },

  // Standard retry for API calls
  standard: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  },

  // Aggressive retry for critical operations
  aggressive: {
    maxAttempts: 5,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
  },

  // Network retry for network-related errors
  network: {
    maxAttempts: 3,
    initialDelay: 2000,
    maxDelay: 15000,
    backoffMultiplier: 2,
    retryOn: (error: Error) => {
      const networkErrors = [
        'ECONNREFUSED',
        'ENOTFOUND',
        'ETIMEDOUT',
        'ECONNRESET',
        'ENETUNREACH',
      ];
      return networkErrors.some((code) => error.message.includes(code));
    },
  },

  // HTTP retry for HTTP errors
  http: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    retryOn: (error: Error) => {
      // Retry on 5xx errors and 429 (rate limit)
      const statusMatch = error.message.match(/status (\d+)/);
      if (statusMatch) {
        const status = parseInt(statusMatch[1]);
        return status >= 500 || status === 429;
      }
      return false;
    },
  },
};

/**
 * Retry with timeout
 */
export async function retryWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  retryOptions: RetryOptions = {}
): Promise<T> {
  return Promise.race([
    retry(fn, retryOptions),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    ),
  ]);
}

/**
 * Batch retry - retry multiple operations
 */
export async function retryBatch<T>(
  operations: Array<() => Promise<T>>,
  options: RetryOptions = {}
): Promise<T[]> {
  return Promise.all(operations.map((op) => retry(op, options)));
}

/**
 * Retry with fallback
 */
export async function retryWithFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>,
  retryOptions: RetryOptions = {}
): Promise<T> {
  try {
    return await retry(primary, retryOptions);
  } catch (error) {
    console.warn('Primary operation failed, using fallback:', error);
    return fallback();
  }
}

/**
 * Conditional retry - only retry if condition is met
 */
export async function conditionalRetry<T>(
  fn: () => Promise<T>,
  shouldRetry: boolean,
  options: RetryOptions = {}
): Promise<T> {
  if (shouldRetry) {
    return retry(fn, options);
  }
  return fn();
}

/**
 * Helper to create a retryable function
 */
export function makeRetryable<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: RetryOptions = {}
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs) => {
    return retry(() => fn(...args), options);
  };
}

/**
 * Retry for specific error types
 */
export function retryOnError<T>(
  fn: () => Promise<T>,
  errorTypes: Array<new (...args: unknown[]) => Error>,
  options: RetryOptions = {}
): Promise<T> {
  return retry(fn, {
    ...options,
    retryOn: (error) => {
      return errorTypes.some((ErrorType) => error instanceof ErrorType);
    },
  });
}
