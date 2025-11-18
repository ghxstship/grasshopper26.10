/**
 * Retry Hook
 * Provides retry logic for failed operations with exponential backoff
 */

'use client';

import { useState, useCallback } from 'react';

export interface UseRetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
  shouldRetry?: (error: Error) => boolean;
}

export interface UseRetryReturn<T> {
  execute: (fn: () => Promise<T>) => Promise<T>;
  isRetrying: boolean;
  retryCount: number;
  lastError: Error | null;
  reset: () => void;
}

/**
 * Hook for executing operations with automatic retry logic
 * 
 * @param options - Configuration options for retry behavior
 * @returns Object with execute function and retry state
 * 
 * @example
 * ```tsx
 * const { execute, isRetrying, retryCount } = useRetry({
 *   maxRetries: 3,
 *   initialDelay: 1000,
 * });
 * 
 * const fetchData = async () => {
 *   return execute(async () => {
 *     const response = await fetch('/api/data');
 *     if (!response.ok) throw new Error('Failed to fetch');
 *     return response.json();
 *   });
 * };
 * ```
 */
export function useRetry<T = any>(options: UseRetryOptions = {}): UseRetryReturn<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2,
    onRetry,
    shouldRetry = () => true,
  } = options;

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);

  const execute = useCallback(
    async (fn: () => Promise<T>): Promise<T> => {
      let attempt = 0;
      let delay = initialDelay;

      while (attempt <= maxRetries) {
        try {
          setIsRetrying(attempt > 0);
          setRetryCount(attempt);
          
          const result = await fn();
          
          // Success - reset state
          setIsRetrying(false);
          setRetryCount(0);
          setLastError(null);
          
          return result;
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));
          setLastError(err);

          // Check if we should retry
          if (attempt >= maxRetries || !shouldRetry(err)) {
            setIsRetrying(false);
            throw err;
          }

          // Notify about retry
          if (onRetry) {
            onRetry(attempt + 1, err);
          }

          // Wait before retrying with exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.min(delay, maxDelay)));
          delay *= backoffMultiplier;
          attempt++;
        }
      }

      // This should never be reached, but TypeScript needs it
      throw lastError || new Error('Max retries exceeded');
    },
    [maxRetries, initialDelay, maxDelay, backoffMultiplier, onRetry, shouldRetry, lastError]
  );

  const reset = useCallback(() => {
    setIsRetrying(false);
    setRetryCount(0);
    setLastError(null);
  }, []);

  return {
    execute,
    isRetrying,
    retryCount,
    lastError,
    reset,
  };
}
