import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdvancingRequest, useAdvancingRequests as _useAdvancingRequests } from './useAdvancingRequests';

interface AddCommentData {
  requestId: string;
  content: string;
}

interface RejectRequestData {
  id: string;
  reason?: string;
}

/**
 * Re-export hooks for backward compatibility
 */
export { useAdvancingRequest };
export { _useAdvancingRequests as useAdvancingRequests };

/**
 * Hook to add a comment to an advancing request
 */
export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, content }: AddCommentData) => {
      const response = await fetch(`/api/atlvs/advancing/${requestId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add comment');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['advancing-request', variables.requestId] });
      queryClient.invalidateQueries({ queryKey: ['advancing-comments', variables.requestId] });
    },
  });
}

/**
 * Hook to approve an advancing request
 */
export function useApproveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await fetch(`/api/atlvs/advancing/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to approve request');
      }

      return response.json();
    },
    onSuccess: (_, requestId) => {
      queryClient.invalidateQueries({ queryKey: ['advancing-request', requestId] });
      queryClient.invalidateQueries({ queryKey: ['advancing-requests'] });
    },
  });
}

/**
 * Hook to reject an advancing request
 */
export function useRejectRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: RejectRequestData) => {
      const response = await fetch(`/api/atlvs/advancing/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reject request');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['advancing-request', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['advancing-requests'] });
    },
  });
}
