import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface LoyaltyPoints {
  userId: string;
  totalPoints: number;
  availablePoints: number;
  lifetimePoints: number;
  tier: string;
  nextTier?: string;
  pointsToNextTier?: number;
}

interface LoyaltyTransaction {
  id: string;
  userId: string;
  points: number;
  type: 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'ADJUSTED';
  reason: string;
  referenceId?: string;
  createdAt: Date;
}

interface Reward {
  id: string;
  name: string;
  description?: string;
  pointsCost: number;
  category: string;
  available: boolean;
  expiresAt?: Date;
}

export function useLoyaltyPoints() {
  return useQuery({
    queryKey: ['loyalty', 'points'],
    queryFn: async () => {
      const response = await fetch('/api/loyalty/points');
      if (!response.ok) throw new Error('Failed to fetch loyalty points');
      return response.json() as Promise<LoyaltyPoints>;
    },
    staleTime: 30000,
  });
}

export function useLoyaltyTransactions() {
  return useQuery({
    queryKey: ['loyalty', 'transactions'],
    queryFn: async () => {
      const response = await fetch('/api/loyalty/transactions');
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json() as Promise<LoyaltyTransaction[]>;
    },
    staleTime: 30000,
  });
}

export function useRewards(category?: string) {
  return useQuery({
    queryKey: ['loyalty', 'rewards', category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);

      const response = await fetch(`/api/loyalty/rewards?${params}`);
      if (!response.ok) throw new Error('Failed to fetch rewards');
      return response.json() as Promise<Reward[]>;
    },
    staleTime: 30000,
  });
}

export function useRedeemReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rewardId: string) => {
      const response = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId }),
      });
      if (!response.ok) throw new Error('Failed to redeem reward');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty'] });
    },
  });
}

// Alias for backward compatibility
export { useLoyaltyPoints as useLoyalty };
