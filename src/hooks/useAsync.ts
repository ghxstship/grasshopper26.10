/**
 * Async Hook
 * Comprehensive hook for handling async operations with loading, error, and retry states
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export interface UseAsyncOptions<T> {
  immediate?: boolean;
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retry?: {
    maxRetries?: number;
    delay?: number;
  };
}

export interface UseAsyncReturn<T, Args extends any[] = any[]> {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  execute: (...args: Args) => Promise<T | undefined>;
  reset: () => void;
  retry: () => Promise<T | undefined>;
}

/**
 * Hook for managing async operations with comprehensive state management
 * 
 * @param asyncFunction - The async function to execute
 * @param options - Configuration options
 * @returns Object with data, loading state, error state, and control functions
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, execute } = useAsync(
 *   async (id: string) => {
 *     const response = await fetch(`/api/users/${id}`);
 *     return response.json();
 *   },
 *   {
 *     immediate: false,
 *     onSuccess: (data) => console.log('Success:', data),
 *     onError: (error) => console.error('Error:', error),
 *   }
 * );
 * 
 * // Later...
 * await execute('user-123');
 * ```
 */
export function useAsync<T, Args extends any[] = any[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T, Args> {
  const {
    immediate = false,
    initialData,
    onSuccess,
    onError,
    retry: retryOptions,
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(immediate);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const lastArgsRef = useRef<Args | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: Args): Promise<T | undefined> => {
      lastArgsRef.current = args;
      setIsLoading(true);
      setError(null);
      setIsError(false);
      setIsSuccess(false);

      let retries = 0;
      const maxRetries = retryOptions?.maxRetries ?? 0;
      const retryDelay = retryOptions?.delay ?? 1000;

      while (retries <= maxRetries) {
        try {
          const result = await asyncFunction(...args);

          if (mountedRef.current) {
            setData(result);
            setIsLoading(false);
            setIsSuccess(true);
            
            if (onSuccess) {
              onSuccess(result);
            }
          }

          return result;
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));

          if (retries < maxRetries) {
            retries++;
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue;
          }

          if (mountedRef.current) {
            setError(error);
            setIsError(true);
            setIsLoading(false);
            
            if (onError) {
              onError(error);
            }
          }

          throw error;
        }
      }
    },
    [asyncFunction, onSuccess, onError, retryOptions]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setIsLoading(false);
    setIsError(false);
    setIsSuccess(false);
    lastArgsRef.current = null;
  }, [initialData]);

  const retry = useCallback(async (): Promise<T | undefined> => {
    if (lastArgsRef.current) {
      return execute(...lastArgsRef.current);
    }
    return undefined;
  }, [execute]);

  useEffect(() => {
    if (immediate) {
      // Execute on mount only, ignore execute dependency to avoid cascading renders
       
      void execute(...([] as unknown as Args));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount if immediate is true

  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
    execute,
    reset,
    retry,
  };
}
