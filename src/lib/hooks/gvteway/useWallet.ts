/**
 * React Query hooks for GVTEWAY Wallet
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const response = await fetch('/api/wallet/balance');
      if (!response.ok) throw new Error('Failed to fetch wallet');
      return response.json();
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useWalletTransactions(filters = {}) {
  return useQuery({
    queryKey: ['wallet-transactions', filters],
    queryFn: async () => {
      const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]));
      const response = await fetch(`/api/wallet/transactions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useDepositFunds() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (amount: number) => {
      const response = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) throw new Error('Failed to deposit funds');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
    },
  });
}

export function useWithdrawFunds() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (amount: number) => {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) throw new Error('Failed to withdraw funds');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
    },
  });
}
