/**
 * Create Event Mutation Hook
 * Handles event creation with validation
 */

import { useState, useCallback } from 'react';
import { useEvents } from './useEvents';

export interface CreateEventData {
  organizationId: string;
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  imageUrl?: string;
  bannerUrl?: string;
  categoryId?: string;
  venueId?: string;
  startDate: string;
  endDate?: string;
  timezone: string;
  status?: string;
  visibility?: string;
  capacity?: number;
  featured?: boolean;
}

export function useCreateEvent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate } = useEvents();

  const createEvent = useCallback(
    async (data: CreateEventData) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create event');
        }

        const result = await response.json();
        
        // Revalidate events cache
        mutate();

        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [mutate]
  );

  return {
    createEvent,
    isLoading,
    error,
  };
}
