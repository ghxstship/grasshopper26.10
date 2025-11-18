/**
 * React Query hooks for COMPVSS Expenses
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  receiptUrl?: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export function useExpenses(filters = {}) {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: async () => {
      const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]));
      const response = await fetch(`/api/compvss/expenses?${params}`);
      if (!response.ok) throw new Error('Failed to fetch expenses');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useExpense(id: string | undefined) {
  return useQuery({
    queryKey: ['expense', id],
    queryFn: async () => {
      if (!id) throw new Error('Expense ID required');
      const response = await fetch(`/api/compvss/expenses/${id}`);
      if (!response.ok) throw new Error('Failed to fetch expense');
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await fetch('/api/compvss/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create expense');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
  });
}

export function useApproveExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ expenseId, approved }: { expenseId: string; approved: boolean }) => {
      const response = await fetch(`/api/compvss/expenses/${expenseId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      });
      if (!response.ok) throw new Error('Failed to approve expense');
      return response.json();
    },
    onSuccess: (_, { expenseId }) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense', expenseId] });
    },
  });
}

export function useExpenseCategories() {
  return useQuery({
    queryKey: ['expense-categories'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/expenses/categories');
      if (!response.ok) throw new Error('Failed to fetch expense categories');
      return response.json();
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useExpenseReports() {
  return useQuery({
    queryKey: ['expense-reports'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/expenses/reports');
      if (!response.ok) throw new Error('Failed to fetch expense reports');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}
