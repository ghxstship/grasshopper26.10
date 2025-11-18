import useSWR from 'swr';
import { useMutation } from '@tanstack/react-query';

export interface ReferralLink {
  id: string;
  name: string;
  url: string;
  clicks: number;
  conversions: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface ReferralStats {
  totalReferrals: number;
  conversions: number;
  totalEarned: number;
  tierLevel: string;
  change: {
    referrals: number;
    conversions: number;
    earned: number;
  };
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  referrals: number;
  earnings: string;
  badge?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useReferrals() {
  const { data, error, mutate, isLoading } = useSWR(
    '/api/compvss/referrals',
    fetcher
  );

  return {
    links: data?.links,
    stats: data?.stats,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useReferralLeaderboard() {
  const { data, error, mutate, isLoading } = useSWR(
    '/api/compvss/referrals/leaderboard',
    fetcher
  );

  return {
    leaderboard: data?.leaderboard,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useCreateReferralLink() {
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await fetch('/api/compvss/referrals/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create referral link');
      return response.json();
    },
  });
}
