/**
 * React Query hooks for Opportunity Applications
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ApplicationFilters {
  opportunityId?: string;
  userId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch user's applications (COMPVSS)
 */
export function useMyApplications(filters: ApplicationFilters = {}) {
  return useQuery({
    queryKey: ['my-applications', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value != null) {
          params.append(key, String(value));
        }
      });
      const response = await fetch(`/api/compvss/applications?${params}`);
      if (!response.ok) throw new Error('Failed to fetch applications');
      return response.json();
    },
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Fetch all applications (ATLVS - for review)
 */
export function useApplications(filters: ApplicationFilters = {}) {
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value != null) {
          params.append(key, String(value));
        }
      });
      const response = await fetch(`/api/atlvs/applications?${params}`);
      if (!response.ok) throw new Error('Failed to fetch applications');
      return response.json();
    },
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Fetch single application by ID
 */
export function useApplication(id: string | undefined) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      if (!id) throw new Error('Application ID required');
      const response = await fetch(`/api/compvss/applications/${id}`);
      if (!response.ok) throw new Error('Failed to fetch application');
      return response.json();
    },
    enabled: !!id,
  });
}

/**
 * Submit application (COMPVSS)
 */
export function useSubmitApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ opportunityId, data }: { opportunityId: string; data: unknown }) => {
      const response = await fetch(`/api/compvss/opportunities/${opportunityId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit application');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      queryClient.invalidateQueries({ queryKey: ['public-opportunities'] });
    },
  });
}

/**
 * Update application status (ATLVS - for reviewers)
 */
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      opportunityId, 
      applicationId, 
      data 
    }: { 
      opportunityId: string; 
      applicationId: string; 
      data: unknown 
    }) => {
      const response = await fetch(
        `/api/atlvs/opportunities/${opportunityId}/applications/${applicationId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update application');
      }
      return response.json();
    },
    onSuccess: (_, { opportunityId, applicationId }) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
      queryClient.invalidateQueries({ queryKey: ['opportunity-applications', opportunityId] });
    },
  });
}

/**
 * Withdraw application (COMPVSS)
 */
export function useWithdrawApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/compvss/applications/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to withdraw application');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
