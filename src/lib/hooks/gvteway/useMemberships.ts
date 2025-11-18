/**
 * React Query hooks for GVTEWAY Memberships
 * Provides data fetching, caching, and state management for memberships
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Membership } from '@prisma/client';

export interface MembershipFilters {
  userId?: string;
  tier?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface MembershipsResponse {
  memberships: Membership[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Fetch all memberships with filters
 */
export function useMemberships(filters: MembershipFilters = {}) {
  return useQuery({
    queryKey: ['memberships', filters],
    queryFn: async (): Promise<MembershipsResponse> => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`/api/memberships?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch memberships');
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

/**
 * Fetch single membership by ID
 */
export function useMembership(id: string | undefined) {
  return useQuery({
    queryKey: ['membership', id],
    queryFn: async (): Promise<Membership> => {
      if (!id) throw new Error('Membership ID is required');

      const response = await fetch(`/api/memberships/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch membership');
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Create new membership
 */
export function useCreateMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { tier: string; paymentMethodId: string }) => {
      const response = await fetch('/api/memberships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create membership');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
    },
  });
}

/**
 * Upgrade membership tier
 */
export function useUpgradeMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, tier }: { id: string; tier: string }) => {
      const response = await fetch(`/api/memberships/${id}/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upgrade membership');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      queryClient.invalidateQueries({ queryKey: ['membership', variables.id] });
    },
  });
}

/**
 * Cancel membership
 */
export function useCancelMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/memberships/${id}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel membership');
      }

      return response.json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      queryClient.invalidateQueries({ queryKey: ['membership', id] });
    },
  });
}

/**
 * Get membership benefits
 */
export function useMembershipBenefits(tier: string | undefined) {
  return useQuery({
    queryKey: ['membership-benefits', tier],
    queryFn: async () => {
      if (!tier) throw new Error('Tier is required');

      const response = await fetch(`/api/memberships/benefits/${tier}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch membership benefits');
      }

      return response.json();
    },
    enabled: !!tier,
    staleTime: 1000 * 60 * 10,
  });
}
