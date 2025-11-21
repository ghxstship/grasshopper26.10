import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface AdvancingRequest {
  id: string;
  requestNumber: string;
  eventId: string;
  category: string;
  status: string;
  priority: string;
  submittedBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateAdvancingRequestParams {
  eventId: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  description: string;
  requirements: Record<string, any>;
}

export function useAdvancing() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<AdvancingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async (filters?: Record<string, any>) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams(filters || {});
      const response = await fetch(`/api/compvss/advancing?${queryParams}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to fetch requests');
      }

      setRequests(result.data.requests);
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load requests';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRequest = async (params: CreateAdvancingRequestParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/compvss/advancing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to create request');
      }

      setRequests((prev) => [result.data.request, ...prev]);
      return result.data.request;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create request';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const approveRequest = async (requestId: string, notes?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/atlvs/advancing/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to approve request');
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: 'APPROVED' } : r
        )
      );

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve request';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectRequest = async (requestId: string, reason: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/atlvs/advancing/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to reject request');
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: 'REJECTED' } : r
        )
      );

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject request';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const submitResult = async (requestId: string, resultData: Record<string, any>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/atlvs/advancing/${requestId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to submit result');
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: 'COMPLETED' } : r
        )
      );

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit result';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (requestId: string, comment: string) => {
    try {
      const response = await fetch(`/api/atlvs/advancing/${requestId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Failed to add comment');
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add comment';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    requests,
    isLoading,
    error,
    fetchRequests,
    createRequest,
    approveRequest,
    rejectRequest,
    submitResult,
    addComment,
  };
}
