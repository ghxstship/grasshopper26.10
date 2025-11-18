import { useState, useCallback } from 'react';
import { useAdvancingRequest } from './useAdvancingRequest';

export function useApproveRequest(requestId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate } = useAdvancingRequest(requestId);

  const approveRequest = useCallback(
    async (approved: boolean, comments?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const endpoint = approved ? 'approve' : 'reject';
        const response = await fetch(`/api/compvss/advancing/${requestId}/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comments }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Action failed');
        }

        const result = await response.json();
        mutate();
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [requestId, mutate]
  );

  return { approveRequest, isLoading, error };
}
