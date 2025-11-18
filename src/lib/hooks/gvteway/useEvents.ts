/**
 * React Query hooks for GVTEWAY Events
 * Provides data fetching, caching, and state management for events
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Event, TicketType, Organization, EventCategory, Venue, Artist } from '@prisma/client';

export interface EventFilters {
  category?: string;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface EventWithRelations extends Event {
  ticketTypes?: TicketType[];
  organization?: Partial<Organization>;
  category?: Partial<EventCategory>;
  venue?: Partial<Venue>;
  artists?: Array<{
    artist: Partial<Artist>;
  }>;
  _count?: {
    tickets: number;
    orders: number;
    wishlists: number;
  };
}

export interface EventsResponse {
  events: Event[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Fetch all events with filters
 */
export function useEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async (): Promise<EventsResponse> => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`/api/events?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Fetch single event by ID
 */
export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async (): Promise<EventWithRelations> => {
      if (!id) throw new Error('Event ID is required');

      const response = await fetch(`/api/events/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Create new event
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Event>) => {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create event');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

/**
 * Update existing event
 */
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Event> }) => {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update event');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] });
    },
  });
}

/**
 * Delete event
 */
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete event');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

/**
 * Publish event
 */
export function usePublishEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/events/${id}/publish`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to publish event');
      }

      return response.json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
  });
}

/**
 * Get event analytics
 */
export function useEventAnalytics(id: string | undefined) {
  return useQuery({
    queryKey: ['event-analytics', id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID is required');

      const response = await fetch(`/api/events/${id}/analytics`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch event analytics');
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Fetch artist by ID
 */
export function useArtist(id: string | undefined) {
  return useQuery({
    queryKey: ['artist', id],
    queryFn: async () => {
      if (!id) throw new Error('Artist ID is required');

      const response = await fetch(`/api/artists/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch artist');
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
