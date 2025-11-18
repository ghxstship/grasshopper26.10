import useSWR from 'swr';
import { useMutation } from '@tanstack/react-query';

export interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  category: string;
  date: string;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'reimbursed';
  approvedBy?: string;
  approvedAt?: string;
  reimbursedAt?: string;
  receipts?: string[];
  notes?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useExpenses(filters?: { status?: string; category?: string; submittedBy?: string }) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const { data, error, mutate, isLoading } = useSWR(
    `/api/compvss/expenses?${params}`,
    fetcher
  );

  return {
    data,
    expenses: data?.expenses,
    pagination: data?.pagination,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useExpense(expenseId?: string) {
  const { data, error, mutate, isLoading } = useSWR(
    expenseId ? `/api/compvss/expenses/${expenseId}` : null,
    fetcher
  );

  return {
    expense: data,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useCreateExpense() {
  return useMutation({
    mutationFn: async (data: Omit<Expense, 'id' | 'submittedBy' | 'status'>) => {
      const response = await fetch('/api/compvss/expenses', {
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
      const response = await fetch(`/api/compvss/expenses/${expenseId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (!response.ok) throw new Error('Failed to approve expense');
      return response.json();
    },
  });
}

export function useReimburseExpense() {
  return useMutation({
    mutationFn: async ({ expenseId, method }: { expenseId: string; method: string }) => {
      const response = await fetch(`/api/compvss/expenses/${expenseId}/reimburse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method }),
      });
      if (!response.ok) throw new Error('Failed to reimburse expense');
      return response.json();
    },
  });
}
