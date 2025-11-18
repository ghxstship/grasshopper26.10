import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdvancingStatus, Priority, AdvancingCategory } from '@prisma/client';

export interface AdvancingRequestFilters {
  status?: AdvancingStatus;
  category?: AdvancingCategory;
  priority?: Priority;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateAdvancingRequestData {
  eventId?: string;
  category: AdvancingCategory;
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateAdvancingRequestData {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateStatusData {
  status: AdvancingStatus;
  note?: string;
}

export interface CreateCommentData {
  content: string;
}

/**
 * Hook to fetch list of advancing requests
 */
export function useAdvancingRequests(filters: AdvancingRequestFilters = {}) {
  return useQuery({
    queryKey: ['advancing-requests', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/atlvs/advancing?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch advancing requests');
      }
      
      return response.json();
    },
  });
}

/**
 * Hook to fetch a single advancing request by ID
 */
export function useAdvancingRequest(id: string) {
  return useQuery({
    queryKey: ['advancing-request', id],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/advancing/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch advancing request');
      }
      
      return response.json();
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new advancing request
 */
export function useCreateAdvancingRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAdvancingRequestData) => {
      const response = await fetch('/api/atlvs/advancing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create advancing request');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advancing-requests'] });
    },
  });
}

/**
 * Hook to update an advancing request
 */
export function useUpdateAdvancingRequest(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateAdvancingRequestData) => {
      const response = await fetch(`/api/atlvs/advancing/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update advancing request');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advancing-request', id] });
      queryClient.invalidateQueries({ queryKey: ['advancing-requests'] });
    },
  });
}

/**
 * Hook to update advancing request status
 */
export function useUpdateAdvancingStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateStatusData) => {
      const response = await fetch(`/api/atlvs/advancing/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update status');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advancing-request', id] });
      queryClient.invalidateQueries({ queryKey: ['advancing-requests'] });
    },
  });
}

/**
 * Hook to delete an advancing request
 */
export function useDeleteAdvancingRequest(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/atlvs/advancing/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete advancing request');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advancing-requests'] });
    },
  });
}

/**
 * Hook to fetch comments for an advancing request
 */
export function useAdvancingComments(requestId: string) {
  return useQuery({
    queryKey: ['advancing-comments', requestId],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/advancing/${requestId}/comments`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      return response.json();
    },
    enabled: !!requestId,
  });
}

/**
 * Hook to create a comment on an advancing request
 */
export function useCreateAdvancingComment(requestId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommentData) => {
      const response = await fetch(`/api/atlvs/advancing/${requestId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create comment');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advancing-comments', requestId] });
      queryClient.invalidateQueries({ queryKey: ['advancing-request', requestId] });
    },
  });
}
