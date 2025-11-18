import useSWR from 'swr';
import type { AdvancingRequest } from './useAdvancingRequests';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAdvancingRequest(id: string | null) {
  const { data, error, mutate, isLoading } = useSWR<AdvancingRequest>(
    id ? `/api/compvss/advancing/${id}` : null,
    fetcher
  );

  return {
    request: data,
    isLoading,
    isError: error,
    mutate,
  };
}
