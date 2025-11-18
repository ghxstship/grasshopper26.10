/**
 * React Query hooks for GVTEWAY Venues
 * Provides data fetching, caching, and state management for venues
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Venue } from '@prisma/client';

export interface VenueFilters {
  city?: string;
  state?: string;
  capacity?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface VenuesResponse {
  venues: Venue[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Fetch all venues with filters
 */
export function useVenues(filters: VenueFilters = {}) {
  return useQuery({
    queryKey: ['venues', filters],
    queryFn: async (): Promise<VenuesResponse> => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`/api/venues?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch venues');
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}

/**
 * Fetch single venue by ID
 */
export function useVenue(id: string | undefined) {
  return useQuery({
    queryKey: ['venue', id],
    queryFn: async (): Promise<Venue> => {
      if (!id) throw new Error('Venue ID is required');

      const response = await fetch(`/api/venues/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch venue');
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Create new venue
 */
export function useCreateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Venue>) => {
      const response = await fetch('/api/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create venue');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
}

/**
 * Update venue
 */
export function useUpdateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Venue> }) => {
      const response = await fetch(`/api/venues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update venue');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      queryClient.invalidateQueries({ queryKey: ['venue', variables.id] });
    },
  });
}

/**
 * Delete venue
 */
export function useDeleteVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/venues/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete venue');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
}
