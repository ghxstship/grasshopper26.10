/**
 * Hook Enhancer Utility
 * Automatically adds error handling, retry logic, and optimistic updates to React Query hooks
 */

import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { logger } from '@/lib/monitoring/logger';
import { errorTracker, ErrorCategory, ErrorSeverity } from '@/lib/monitoring/error-tracking';

/**
 * Enhanced query options
 */
export interface EnhancedQueryOptions<TData, TError = Error> extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  // Retry configuration
  shouldRetryOnError?: boolean;
  errorRetryCount?: number;
  errorRetryInterval?: number;
  
  // Error handling
  onError?: (error: TError) => void;
  trackErrors?: boolean;
  errorCategory?: ErrorCategory;
  
  // Logging
  logQueries?: boolean;
}

/**
 * Enhanced mutation options
 */
export interface EnhancedMutationOptions<TData, TError = Error, TVariables = void, TContext = unknown> extends Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'> {
  // Optimistic updates
  optimisticUpdate?: (variables: TVariables) => void;
  
  // Error handling
  trackErrors?: boolean;
  errorCategory?: ErrorCategory;
  
  // Retry configuration
  shouldRetryOnError?: boolean;
  retryCount?: number;
  
  // Logging
  logMutations?: boolean;
  
  // Invalidation
  invalidateQueries?: string[][];
}

/**
 * Create enhanced query hook
 */
export function useEnhancedQuery<TData, TError = Error>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options: EnhancedQueryOptions<TData, TError> = {}
) {
  const {
    shouldRetryOnError = true,
    errorRetryCount = 3,
    errorRetryInterval = 1000,
    onError,
    trackErrors = true,
    errorCategory = ErrorCategory.API,
    logQueries = true,
    ...queryOptions
  } = options;

  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      const startTime = performance.now();
      
      try {
        const data = await queryFn();
        
        if (logQueries) {
          const duration = performance.now() - startTime;
          logger.debug('Query completed', {
            queryKey: JSON.stringify(queryKey),
            duration,
          });
        }
        
        return data;
      } catch (error) {
        if (trackErrors) {
          errorTracker.track(
            error as Error,
            ErrorSeverity.ERROR,
            errorCategory,
            { queryKey: JSON.stringify(queryKey) }
          );
        }
        
        if (onError) {
          onError(error as TError);
        }
        
        throw error;
      }
    },
    retry: shouldRetryOnError ? errorRetryCount : false,
    retryDelay: (attemptIndex) => {
      return Math.min(errorRetryInterval * Math.pow(2, attemptIndex), 30000);
    },
    ...queryOptions,
  });
}

/**
 * Create enhanced mutation hook
 */
export function useEnhancedMutation<TData, TError = Error, TVariables = void, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: EnhancedMutationOptions<TData, TError, TVariables, TContext> = {}
) {
  const queryClient = useQueryClient();
  
  const {
    optimisticUpdate,
    trackErrors = true,
    errorCategory = ErrorCategory.API,
    shouldRetryOnError = false,
    retryCount = 1,
    logMutations = true,
    invalidateQueries = [],
    ...mutationOptions
  } = options;

  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      const startTime = performance.now();
      
      try {
        const data = await mutationFn(variables);
        
        if (logMutations) {
          const duration = performance.now() - startTime;
          logger.debug('Mutation completed', {
            duration,
          });
        }
        
        return data;
      } catch (error) {
        if (trackErrors) {
          errorTracker.track(
            error as Error,
            ErrorSeverity.ERROR,
            errorCategory
          );
        }
        
        throw error;
      }
    },
    onMutate: async (variables, context) => {
      if (optimisticUpdate) {
        optimisticUpdate(variables);
      }
      
      if (mutationOptions.onMutate) {
        return await mutationOptions.onMutate(variables, context);
      }
    },
    onSuccess: (data, variables, context, mutationContext) => {
      // Invalidate queries
      invalidateQueries.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      if (mutationOptions.onSuccess) {
        mutationOptions.onSuccess(data, variables, context as TContext, mutationContext);
      }
    },
    retry: shouldRetryOnError ? retryCount : false,
    ...mutationOptions,
  });
}

/**
 * Hook enhancement wrapper
 * Wraps existing hooks to add error handling and retry logic
 */
export function enhanceHook<TArgs extends any[], TReturn>(
  hookFn: (...args: TArgs) => TReturn,
  hookName: string
): (...args: TArgs) => TReturn {
  return (...args: TArgs) => {
    try {
      return hookFn(...args);
    } catch (error) {
      logger.error(`Hook error: ${hookName}`, error);
      errorTracker.track(
        error as Error,
        ErrorSeverity.ERROR,
        ErrorCategory.BUSINESS_LOGIC,
        { hookName, args: JSON.stringify(args) }
      );
      throw error;
    }
  };
}

/**
 * Batch query invalidation helper
 */
export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  
  return {
    invalidate: (queryKeys: string[][]) => {
      queryKeys.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
    
    invalidateAll: (prefix: string) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return typeof key === 'string' && key.startsWith(prefix);
        },
      });
    },
    
    refetch: (queryKeys: string[][]) => {
      queryKeys.forEach((queryKey) => {
        queryClient.refetchQueries({ queryKey });
      });
    },
  };
}

/**
 * Optimistic update helper
 */
export function useOptimisticUpdate<T>(
  queryKey: unknown[],
  updateFn: (oldData: T | undefined, newData: Partial<T>) => T
) {
  const queryClient = useQueryClient();
  
  return {
    update: (newData: Partial<T>) => {
      queryClient.setQueryData<T>(queryKey, (oldData) => {
        return updateFn(oldData, newData);
      });
    },
    
    rollback: (previousData: T) => {
      queryClient.setQueryData(queryKey, previousData);
    },
    
    getPrevious: () => {
      return queryClient.getQueryData<T>(queryKey);
    },
  };
}

/**
 * Example usage:
 * 
 * // Enhanced query
 * export function useEnhancedEvents() {
 *   return createEnhancedQuery(
 *     ['events'],
 *     () => fetchEvents(),
 *     {
 *       shouldRetryOnError: true,
 *       errorRetryCount: 3,
 *       staleTime: 5 * 60 * 1000,
 *       onError: (error) => {
 *         toast.error('Failed to load events');
 *       },
 *     }
 *   );
 * }
 * 
 * // Enhanced mutation
 * export function useCreateEvent() {
 *   return createEnhancedMutation(
 *     (data: EventData) => createEvent(data),
 *     {
 *       invalidateQueries: [['events']],
 *       optimisticUpdate: (variables) => {
 *         // Update UI immediately
 *       },
 *       onError: (error) => {
 *         toast.error('Failed to create event');
 *       },
 *     }
 *   );
 * }
 * 
 * // Wrap existing hook
 * export const useEvents = enhanceHook(
 *   useEventsOriginal,
 *   'useEvents'
 * );
 */
