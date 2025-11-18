/**
 * Single Event Hook
 * Fetches single event with real-time updates
 */

import useSWR from 'swr';
import type { Event } from './useEvents';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useEvent(id: string | null) {
  const { data, error, mutate, isLoading } = useSWR<Event>(
    id ? `/api/events/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  return {
    event: data,
    isLoading,
    isError: error,
    mutate,
  };
}
