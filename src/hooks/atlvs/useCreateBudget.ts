import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BudgetItem {
  category: string;
  description: string;
  amount: string;
}

interface BudgetFormData {
  name: string;
  project: string;
  totalBudget: string;
  currency: string;
  startDate: string;
  endDate: string;
}

export function useCreateBudget() {
  const _router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createBudget = async (formData: BudgetFormData, items: BudgetItem[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/atlvs/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          projectId: formData.project,
          totalAmount: parseFloat(formData.totalBudget),
          currency: formData.currency,
          startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
          endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
          items: items.map(item => ({
            category: item.category,
            description: item.description,
            amount: parseFloat(item.amount) || 0,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create budget');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBudget,
    isLoading,
    error,
  };
}
