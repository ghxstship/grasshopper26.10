/**
 * Budgets Hook
 * Fetches and manages ATLVS budgets with error handling and optimistic updates
 * 
 * @param filters - Optional filters for project and status
 * @returns Budgets data with loading/error states and mutation functions
 * 
 * @example
 * ```tsx
 * const { budgets, isLoading, error, optimisticUpdate } = useBudgets({
 *   projectId: 'proj-123'
 * });
 * ```
 */

import useSWR from 'swr';
import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';

export interface BudgetExpense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  projectId?: string;
  receipts?: string[];
  notes?: string;
}

export interface Budget {
  id: string;
  name: string;
  totalAmount: number;
  spentAmount: number;
  remainingAmount: number;
  projectId?: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'exceeded';
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
});

export function useBudgets(filters?: { projectId?: string; status?: string }) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const { data, error, mutate, isLoading, isValidating } = useSWR(
    `/api/atlvs/budgets?${params}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (err) => {
        console.error('Error fetching budgets:', err);
      },
    }
  );

  const refresh = useCallback(() => {
    return mutate();
  }, [mutate]);

  const optimisticUpdate = useCallback(
    (updatedBudget: Budget) => {
      if (!data) return;

      mutate(
        {
          ...data,
          budgets: data.budgets.map((budget: Budget) =>
            budget.id === updatedBudget.id ? updatedBudget : budget
          ),
        },
        false
      );
    },
    [data, mutate]
  );

  const optimisticDelete = useCallback(
    (budgetId: string) => {
      if (!data) return;

      mutate(
        {
          ...data,
          budgets: data.budgets.filter((budget: Budget) => budget.id !== budgetId),
          pagination: data.pagination ? {
            ...data.pagination,
            total: data.pagination.total - 1,
          } : undefined,
        },
        false
      );
    },
    [data, mutate]
  );

  const optimisticAdd = useCallback(
    (newBudget: Budget) => {
      if (!data) return;

      mutate(
        {
          ...data,
          budgets: [newBudget, ...data.budgets],
          pagination: data.pagination ? {
            ...data.pagination,
            total: data.pagination.total + 1,
          } : undefined,
        },
        false
      );
    },
    [data, mutate]
  );

  return {
    budgets: data?.budgets,
    pagination: data?.pagination,
    isLoading,
    isValidating,
    error: error as Error | undefined,
    isError: !!error,
    mutate,
    refresh,
    optimisticUpdate,
    optimisticDelete,
    optimisticAdd,
  };
}

export function useBudget(budgetId?: string) {
  const { data, error, mutate, isLoading } = useSWR(
    budgetId ? `/api/atlvs/budgets/${budgetId}` : null,
    fetcher
  );

  return {
    budget: data,
    isLoading,
    isError: error,
    refetch: mutate,
  };
}

export function useBudgetExpenses(filters?: { status?: string; category?: string; projectId?: string }) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const { data, error, mutate, isLoading } = useSWR(
    `/api/atlvs/budgets/expenses?${params}`,
    fetcher
  );

  return {
    expenses: data?.expenses || [],
    pagination: data?.pagination,
    isLoading,
    isError: error,
    refetch: mutate,
  };
}

export function useCreateBudgetExpense() {
  return useMutation({
    mutationFn: async (data: Omit<BudgetExpense, 'id' | 'submittedBy' | 'status'>) => {
      const response = await fetch('/api/atlvs/budgets/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create expense');
      return response.json();
    },
  });
}

export function useApproveExpense() {
  return useMutation({
    mutationFn: async ({ expenseId, notes }: { expenseId: string; notes?: string }) => {
      const response = await fetch(`/api/atlvs/budgets/expenses/${expenseId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (!response.ok) throw new Error('Failed to approve expense');
      return response.json();
    },
  });
}
