/**
 * React Query hooks for ATLVS Assets
 * Provides data fetching, caching, and state management for assets
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Equipment as Asset } from '@prisma/client';

export interface AssetFilters {
  status?: string;
  category?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AssetsResponse {
  assets: Asset[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Fetch all assets with filters
 */
export function useAssets(filters: AssetFilters = {}) {
  return useQuery({
    queryKey: ['assets', filters],
    queryFn: async (): Promise<AssetsResponse> => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`/api/atlvs/assets?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch assets');
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Fetch single asset by ID
 */
export function useAsset(id: string | undefined) {
  return useQuery({
    queryKey: ['asset', id],
    queryFn: async (): Promise<Asset> => {
      if (!id) throw new Error('Asset ID is required');

      const response = await fetch(`/api/atlvs/assets/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch asset');
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Create new asset
 */
export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Asset>) => {
      const response = await fetch('/api/atlvs/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create asset');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}

/**
 * Update existing asset
 */
export function useUpdateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Asset> }) => {
      const response = await fetch(`/api/atlvs/assets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update asset');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['asset', variables.id] });
    },
  });
}

/**
 * Delete asset
 */
export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/atlvs/assets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete asset');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}

/**
 * Book asset
 */
export function useBookAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { startDate: string; endDate: string; projectId?: string } }) => {
      const response = await fetch(`/api/atlvs/assets/${id}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to book asset');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['asset', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['asset-availability', variables.id] });
    },
  });
}

/**
 * Get asset availability
 */
export function useAssetAvailability(id: string | undefined) {
  return useQuery({
    queryKey: ['asset-availability', id],
    queryFn: async () => {
      if (!id) throw new Error('Asset ID is required');

      const response = await fetch(`/api/atlvs/assets/${id}/availability`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch asset availability');
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Get asset maintenance history
 */
export function useAssetMaintenance(id: string | undefined) {
  return useQuery({
    queryKey: ['asset-maintenance', id],
    queryFn: async () => {
      if (!id) throw new Error('Asset ID is required');

      const response = await fetch(`/api/atlvs/assets/${id}/maintenance`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch asset maintenance history');
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Get asset calendar
 */
export function useAssetCalendar(filters: { startDate?: string; endDate?: string } = {}) {
  return useQuery({
    queryKey: ['asset-calendar', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/atlvs/assets/calendar?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch asset calendar');
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}
