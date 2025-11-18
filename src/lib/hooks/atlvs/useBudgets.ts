/**
 * React Query hooks for ATLVS Budgets
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Budget } from '@prisma/client';

export function useBudgets(filters = {}) {
  return useQuery({
    queryKey: ['budgets', filters],
    queryFn: async () => {
      const params = new URLSearchParams(Object.entries(filters).filter(([_, v]) => v != null).map(([k, v]) => [k, String(v)]));
      const response = await fetch(`/api/atlvs/budgets?${params}`);
      if (!response.ok) throw new Error('Failed to fetch budgets');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useBudget(id: string | undefined) {
  return useQuery({
    queryKey: ['budget', id],
    queryFn: async () => {
      if (!id) throw new Error('Budget ID required');
      const response = await fetch(`/api/atlvs/budgets/${id}`);
      if (!response.ok) throw new Error('Failed to fetch budget');
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Budget>) => {
      const response = await fetch('/api/atlvs/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create budget');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['budgets'] }),
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Budget> }) => {
      const response = await fetch(`/api/atlvs/budgets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update budget');
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budget', id] });
    },
  });
}

export function useBudgetForecast(projectId?: string) {
  return useQuery({
    queryKey: ['atlvs', 'budget-forecast', projectId],
    queryFn: async () => {
      const url = projectId 
        ? `/api/atlvs/budgets/forecast?projectId=${projectId}`
        : '/api/atlvs/budgets/forecast';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch budget forecast');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useBudgetVariance(projectId?: string) {
  return useQuery({
    queryKey: ['atlvs', 'budget-variance', projectId],
    queryFn: async () => {
      const url = projectId 
        ? `/api/atlvs/budgets/variance?projectId=${projectId}`
        : '/api/atlvs/budgets/variance';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch budget variance');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useBudgetExpenses(budgetId?: string) {
  return useQuery({
    queryKey: ['atlvs', 'budget-expenses', budgetId],
    queryFn: async () => {
      const url = budgetId 
        ? `/api/atlvs/budgets/${budgetId}/expenses`
        : '/api/atlvs/budgets/expenses';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch budget expenses');
      return response.json();
    },
    enabled: !!budgetId,
    staleTime: 1000 * 60 * 5,
  });
}
