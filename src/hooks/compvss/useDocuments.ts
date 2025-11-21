import { useState, useCallback } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
});

export function useDocuments(filters?: Record<string, any>) {
  const params = new URLSearchParams(filters || {});
  
  const { data, error, mutate, isLoading } = useSWR(
    `/api/compvss/documents?${params}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  const refresh = useCallback(() => {
    return mutate();
  }, [mutate]);

  return {
    data: data?.data,
    isLoading,
    error: error as Error | undefined,
    isError: !!error,
    refresh,
    mutate,
  };
}

export function useCreateDocuments() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: Record<string, any>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/compvss/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to create');
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    create,
    isLoading,
    error,
  };
}
