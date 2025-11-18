'use client';

import { useState, useCallback, useEffect } from 'react';

export interface PageState<T = unknown> {
  loading: boolean;
  error: Error | null;
  data: T | null;
  isEmpty: boolean;
}

export interface PageStateActions<T> {
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setData: (data: T | null) => void;
  retry: () => void;
  reset: () => void;
}

export interface UsePageStateOptions<T> {
  initialData?: T | null;
  fetchFn?: () => Promise<T>;
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
  autoFetch?: boolean;
  emptyCheck?: (data: T | null) => boolean;
}

export type UsePageStateReturn<T> = PageState<T> & PageStateActions<T>;

export function usePageState<T = unknown>(
  options: UsePageStateOptions<T> = {}
): UsePageStateReturn<T> {
  const {
    initialData = null,
    fetchFn,
    onError,
    onSuccess,
    autoFetch = true,
    emptyCheck = (data) => !data || (Array.isArray(data) && data.length === 0),
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(initialData);

  const isEmpty = emptyCheck(data);

  const fetchData = useCallback(async () => {
    if (!fetchFn) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onError, onSuccess]);

  const retry = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (autoFetch && fetchFn) {
      fetchData();
    }
  }, [autoFetch, fetchData, fetchFn]);

  return {
    loading,
    error,
    data,
    isEmpty,
    setLoading,
    setError,
    setData,
    retry,
    reset,
  };
}
