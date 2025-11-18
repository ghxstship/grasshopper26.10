/**
 * React Query hooks for ATLVS Contracts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface ContractFilters {
  organizationId?: string;
  projectId?: string;
  status?: string;
  vendorId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateContractData {
  organizationId: string;
  projectId?: string;
  title: string;
  description?: string;
  vendorName: string;
  vendorContact?: string;
  amount?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  terms?: string;
  status?: string;
}

export interface UpdateContractData {
  title?: string;
  description?: string;
  vendorName?: string;
  vendorContact?: string;
  amount?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  terms?: string;
  status?: string;
}

/**
 * Hook to fetch list of contracts
 */
export function useContracts(filters: ContractFilters = {}) {
  return useQuery({
    queryKey: ['contracts', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.organizationId) params.append('organizationId', filters.organizationId);
      if (filters.projectId) params.append('projectId', filters.projectId);
      if (filters.status) params.append('status', filters.status);
      if (filters.vendorId) params.append('vendorId', filters.vendorId);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/atlvs/contracts?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch contracts');
      }
      
      return response.json();
    },
  });
}

/**
 * Hook to fetch a single contract by ID
 */
export function useContract(id: string) {
  return useQuery({
    queryKey: ['contract', id],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/contracts/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch contract');
      }
      
      return response.json();
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new contract
 */
export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateContractData) => {
      const response = await fetch('/api/atlvs/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create contract');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

/**
 * Hook to update a contract
 */
export function useUpdateContract(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateContractData) => {
      const response = await fetch(`/api/atlvs/contracts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update contract');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', id] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

/**
 * Hook to delete a contract
 */
export function useDeleteContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/atlvs/contracts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete contract');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}
