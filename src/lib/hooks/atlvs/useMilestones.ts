/**
 * React Query hooks for ATLVS Milestones
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface MilestoneFilters {
  projectId?: string;
  phaseId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateMilestoneData {
  projectId: string;
  phaseId?: string;
  title: string;
  description?: string;
  dueDate?: string;
  status?: string;
  completedAt?: string;
}

export interface UpdateMilestoneData {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: string;
  completedAt?: string;
}

/**
 * Hook to fetch list of milestones
 */
export function useMilestones(filters: MilestoneFilters = {}) {
  return useQuery({
    queryKey: ['milestones', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.projectId) params.append('projectId', filters.projectId);
      if (filters.phaseId) params.append('phaseId', filters.phaseId);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/atlvs/milestones?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch milestones');
      }
      
      return response.json();
    },
  });
}

/**
 * Hook to fetch a single milestone by ID
 */
export function useMilestone(id: string) {
  return useQuery({
    queryKey: ['milestone', id],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/milestones/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch milestone');
      }
      
      return response.json();
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new milestone
 */
export function useCreateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMilestoneData) => {
      const response = await fetch('/api/atlvs/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create milestone');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    },
  });
}

/**
 * Hook to update a milestone
 */
export function useUpdateMilestone(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateMilestoneData) => {
      const response = await fetch(`/api/atlvs/milestones/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update milestone');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestone', id] });
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    },
  });
}

/**
 * Hook to delete a milestone
 */
export function useDeleteMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/atlvs/milestones/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete milestone');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    },
  });
}

/**
 * Hook to mark milestone as complete
 */
export function useCompleteMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/atlvs/milestones/${id}/complete`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to complete milestone');
      }

      return response.json();
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['milestone', id] });
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    },
  });
}
