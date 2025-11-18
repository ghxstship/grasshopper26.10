/**
 * React Query hooks for ATLVS Project Phases
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface PhaseFilters {
  projectId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreatePhaseData {
  projectId: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  order?: number;
  status?: string;
}

export interface UpdatePhaseData {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  order?: number;
  status?: string;
}

/**
 * Hook to fetch list of phases
 */
export function usePhases(filters: PhaseFilters = {}) {
  return useQuery({
    queryKey: ['phases', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.projectId) params.append('projectId', filters.projectId);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/atlvs/phases?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch phases');
      }
      
      return response.json();
    },
  });
}

/**
 * Hook to fetch a single phase by ID
 */
export function usePhase(id: string) {
  return useQuery({
    queryKey: ['phase', id],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/phases/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch phase');
      }
      
      return response.json();
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new phase
 */
export function useCreatePhase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePhaseData) => {
      const response = await fetch('/api/atlvs/phases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create phase');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases'] });
    },
  });
}

/**
 * Hook to update a phase
 */
export function useUpdatePhase(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePhaseData) => {
      const response = await fetch(`/api/atlvs/phases/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update phase');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phase', id] });
      queryClient.invalidateQueries({ queryKey: ['phases'] });
    },
  });
}

/**
 * Hook to delete a phase
 */
export function useDeletePhase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/atlvs/phases/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete phase');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases'] });
    },
  });
}

/**
 * Hook to reorder phases
 */
export function useReorderPhases() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { projectId: string; phaseIds: string[] }) => {
      const response = await fetch('/api/atlvs/phases/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder phases');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases'] });
    },
  });
}
