import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdvancingStore, type AdvancingRequest, type AdvancingComment } from '@/lib/stores';

// API client functions
const fetchAdvancingRequests = async (): Promise<AdvancingRequest[]> => {
  const response = await fetch('/api/atlvs/advancing');
  if (!response.ok) {
    throw new Error('Failed to fetch advancing requests');
  }
  return response.json();
};

const fetchAdvancingRequest = async (id: string): Promise<AdvancingRequest> => {
  const response = await fetch(`/api/atlvs/advancing/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch advancing request');
  }
  return response.json();
};

const createAdvancingRequest = async (data: Partial<AdvancingRequest>): Promise<AdvancingRequest> => {
  const response = await fetch('/api/atlvs/advancing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create advancing request');
  }
  return response.json();
};

const updateAdvancingRequest = async ({ id, data }: { id: string; data: Partial<AdvancingRequest> }): Promise<AdvancingRequest> => {
  const response = await fetch(`/api/atlvs/advancing/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update advancing request');
  }
  return response.json();
};

const deleteAdvancingRequest = async (id: string): Promise<void> => {
  const response = await fetch(`/api/atlvs/advancing/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete advancing request');
  }
};

const addComment = async ({ requestId, content }: { requestId: string; content: string }): Promise<AdvancingComment> => {
  const response = await fetch(`/api/atlvs/advancing/${requestId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error('Failed to add comment');
  }
  return response.json();
};

const approveRequest = async (id: string): Promise<AdvancingRequest> => {
  const response = await fetch(`/api/atlvs/advancing/${id}/approve`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to approve request');
  }
  return response.json();
};

const rejectRequest = async ({ id, reason }: { id: string; reason?: string }): Promise<AdvancingRequest> => {
  const response = await fetch(`/api/atlvs/advancing/${id}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  if (!response.ok) {
    throw new Error('Failed to reject request');
  }
  return response.json();
};

// Hooks
export function useAdvancingRequests() {
  const { setRequests, setLoading, setError } = useAdvancingStore();

  return useQuery({
    queryKey: ['advancing-requests'],
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await fetchAdvancingRequests();
        setRequests(data);
        setError(null);
        return data;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}

export function useAdvancingRequest(id: string) {
  const { setCurrentRequest, setLoading, setError } = useAdvancingStore();

  return useQuery({
    queryKey: ['advancing-request', id],
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await fetchAdvancingRequest(id);
        setCurrentRequest(data);
        setError(null);
        return data;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useCreateAdvancingRequest() {
  const queryClient = useQueryClient();
  const { addRequest } = useAdvancingStore();

  return useMutation({
    mutationFn: createAdvancingRequest,
    onSuccess: (data) => {
      addRequest(data);
      queryClient.invalidateQueries({ queryKey: ['advancing-requests'] });
    },
  });
}

export function useUpdateAdvancingRequest() {
  const queryClient = useQueryClient();
  const { updateRequest } = useAdvancingStore();

  return useMutation({
    mutationFn: updateAdvancingRequest,
    onSuccess: (data) => {
      updateRequest(data.id, data);
      queryClient.invalidateQueries({ queryKey: ['advancing-requests'] });
      queryClient.invalidateQueries({ queryKey: ['advancing-request', data.id] });
    },
  });
}

export function useDeleteAdvancingRequest() {
  const queryClient = useQueryClient();
  const { deleteRequest } = useAdvancingStore();

  return useMutation({
    mutationFn: deleteAdvancingRequest,
    onSuccess: (_, id) => {
      deleteRequest(id);
      queryClient.invalidateQueries({ queryKey: ['advancing-requests'] });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  const { addComment: addCommentToStore } = useAdvancingStore();

  return useMutation({
    mutationFn: addComment,
    onSuccess: (data, variables) => {
      addCommentToStore(variables.requestId, data);
      queryClient.invalidateQueries({ queryKey: ['advancing-request', variables.requestId] });
    },
  });
}

export function useApproveRequest() {
  const queryClient = useQueryClient();
  const { updateRequest } = useAdvancingStore();

  return useMutation({
    mutationFn: approveRequest,
    onSuccess: (data) => {
      updateRequest(data.id, data);
      queryClient.invalidateQueries({ queryKey: ['advancing-requests'] });
      queryClient.invalidateQueries({ queryKey: ['advancing-request', data.id] });
    },
  });
}

export function useRejectRequest() {
  const queryClient = useQueryClient();
  const { updateRequest } = useAdvancingStore();

  return useMutation({
    mutationFn: rejectRequest,
    onSuccess: (data) => {
      updateRequest(data.id, data);
      queryClient.invalidateQueries({ queryKey: ['advancing-requests'] });
      queryClient.invalidateQueries({ queryKey: ['advancing-request', data.id] });
    },
  });
}
