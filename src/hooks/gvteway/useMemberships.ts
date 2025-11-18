/**
 * Memberships Hook
 * Manages membership tiers and user memberships
 */

import useSWR from 'swr';
import { useMutation } from '@tanstack/react-query';

export interface MembershipTier {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'MONTHLY' | 'YEARLY';
  benefits: string[];
  features: string[];
  priority: number;
  active: boolean;
}

export interface UserMembership {
  id: string;
  tierId: string;
  tierName: string;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  benefits: string[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useMembershipTiers() {
  const { data, error, mutate, isLoading } = useSWR<{
    tiers: MembershipTier[];
  }>('/api/memberships/tiers', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  });

  return {
    tiers: data?.tiers,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useMyMembership() {
  const { data, error, mutate, isLoading } = useSWR<UserMembership>(
    '/api/memberships/me',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    membership: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useSubscribeMembership() {
  return useMutation({
    mutationFn: async ({ tierId, interval }: { tierId: string; interval: 'MONTHLY' | 'YEARLY' }) => {
      const res = await fetch('/api/memberships/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId, interval }),
      });
      if (!res.ok) throw new Error('Failed to subscribe');
      return res.json();
    },
  });
}

export function useCancelMembership() {
  return useMutation({
    mutationFn: async (membershipId: string) => {
      const res = await fetch(`/api/memberships/${membershipId}/cancel`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to cancel membership');
      return res.json();
    },
  });
}
