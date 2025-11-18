import { useState, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export function useSearch() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (query: string, type?: string) => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ q: query });
      if (type) params.append('type', type);

      const response = await fetch(`/api/search?${params}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useDebouncedCallback(search, 300);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    search,
    debouncedSearch,
    results,
    isLoading,
    error,
    clearResults,
  };
}
