/**
 * React Query hooks for COMPVSS Referrals
 */

import { useQuery,  } from '@tanstack/react-query';

export interface ReferralLink {
  id: string;
  code: string;
  clicks: number;
  conversions: number;
  createdAt: string;
  name: string;
  url: string;
  status: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  referrals: number;
  rewards: number;
  rank: number;
  badge?: string;
  isCurrentUser?: boolean;
  earnings?: string | number;
}

export function useReferralRewards() {
  return useQuery({
    queryKey: ['compvss', 'referrals', 'rewards'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/referrals/rewards');
      if (!response.ok) throw new Error('Failed to fetch referral rewards');
      return response.json();
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useReferralStats() {
  return useQuery({
    queryKey: ['compvss', 'referrals', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/referrals/stats');
      if (!response.ok) throw new Error('Failed to fetch referral stats');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useReferrals() {
  return useQuery({
    queryKey: ['compvss', 'referrals'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/referrals');
      if (!response.ok) throw new Error('Failed to fetch referrals');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useReferralLeaderboard() {
  return useQuery({
    queryKey: ['compvss', 'referrals', 'leaderboard'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/referrals/leaderboard');
      if (!response.ok) throw new Error('Failed to fetch referral leaderboard');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}
