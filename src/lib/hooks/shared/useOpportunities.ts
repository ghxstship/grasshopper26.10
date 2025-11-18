/**
 * React Query hooks for Opportunities (shared between ATLVS and COMPVSS)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface OpportunityFilters {
  organizationId?: string;
  projectId?: string;
  eventId?: string;
  category?: string;
  status?: string;
  locationType?: string;
  compensationType?: string;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

/**
 * Fetch opportunities list (ATLVS - all opportunities)
 */
export function useOpportunities(filters: OpportunityFilters = {}) {
  return useQuery({
    queryKey: ['opportunities', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value != null) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, String(value));
          }
        }
      });
      const response = await fetch(`/api/atlvs/opportunities?${params}`);
      if (!response.ok) throw new Error('Failed to fetch opportunities');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch public opportunities (COMPVSS - published only)
 */
export function usePublicOpportunities(filters: OpportunityFilters = {}) {
  return useQuery({
    queryKey: ['public-opportunities', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value != null) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, String(value));
          }
        }
      });
      const response = await fetch(`/api/compvss/opportunities?${params}`);
      if (!response.ok) throw new Error('Failed to fetch opportunities');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch single opportunity by ID
 */
export function useOpportunity(id: string | undefined, includeApplications = false) {
  return useQuery({
    queryKey: ['opportunity', id, includeApplications],
    queryFn: async () => {
      if (!id) throw new Error('Opportunity ID required');
      const params = includeApplications ? '?includeApplications=true' : '';
      const response = await fetch(`/api/atlvs/opportunities/${id}${params}`);
      if (!response.ok) throw new Error('Failed to fetch opportunity');
      return response.json();
    },
    enabled: !!id,
  });
}

/**
 * Fetch single public opportunity (COMPVSS view)
 */
export function usePublicOpportunity(id: string | undefined) {
  return useQuery({
    queryKey: ['public-opportunity', id],
    queryFn: async () => {
      if (!id) throw new Error('Opportunity ID required');
      const response = await fetch(`/api/compvss/opportunities/${id}`);
      if (!response.ok) throw new Error('Failed to fetch opportunity');
      return response.json();
    },
    enabled: !!id,
  });
}

/**
 * Create new opportunity (ATLVS)
 */
export function useCreateOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) => {
      const response = await fetch('/api/atlvs/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create opportunity');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

/**
 * Update opportunity (ATLVS)
 */
export function useUpdateOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: unknown }) => {
      const response = await fetch(`/api/atlvs/opportunities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update opportunity');
      }
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['opportunity', id] });
    },
  });
}

/**
 * Delete opportunity (ATLVS)
 */
export function useDeleteOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/atlvs/opportunities/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete opportunity');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

/**
 * Publish opportunity (ATLVS)
 */
export function usePublishOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/atlvs/opportunities/${id}/publish`, {
        method: 'POST',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to publish opportunity');
      }
      return response.json();
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['opportunity', id] });
      queryClient.invalidateQueries({ queryKey: ['public-opportunities'] });
    },
  });
}

/**
 * Get applications for an opportunity (ATLVS)
 */
export function useOpportunityApplications(opportunityId: string | undefined, filters = {}) {
  return useQuery({
    queryKey: ['opportunity-applications', opportunityId, filters],
    queryFn: async () => {
      if (!opportunityId) throw new Error('Opportunity ID required');
      const params = new URLSearchParams(Object.entries(filters).filter(([_, v]) => v != null).map(([k, v]) => [k, String(v)]));
      const response = await fetch(`/api/atlvs/opportunities/${opportunityId}/applications?${params}`);
      if (!response.ok) throw new Error('Failed to fetch applications');
      return response.json();
    },
    enabled: !!opportunityId,
  });
}
