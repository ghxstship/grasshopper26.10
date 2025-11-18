import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetData: any) => {
      const response = await fetch('/api/atlvs/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create budget');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atlvs', 'budgets'] });
    },
  });
}
