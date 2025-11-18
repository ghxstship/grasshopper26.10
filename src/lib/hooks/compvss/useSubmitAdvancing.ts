import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface AdvancingFormData {
  title: string;
  eventDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: string;
  description?: string;
  [key: string]: any; // Allow additional category-specific fields
}

export function useSubmitAdvancing() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (data: AdvancingFormData) => {
      const response = await fetch('/api/compvss/advancing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit advancing form');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compvss', 'advancing'] });
    },
  });

  return {
    submitAdvancing: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}

export function useUpdateAdvancing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AdvancingFormData> }) => {
      const response = await fetch(`/api/compvss/advancing/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update advancing form');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compvss', 'advancing'] });
    },
  });
}
