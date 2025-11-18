import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OpportunityService } from '@/lib/services/shared/opportunity.service';
import type { OpportunityFilters, CreateOpportunityInput, UpdateOpportunityInput } from '@/lib/validations/opportunities';

export function useOpportunities(filters?: OpportunityFilters) {
  return useQuery({
    queryKey: ['opportunities', filters],
    queryFn: async () => {
      const opportunities = await OpportunityService.getAll(filters || {});
      return opportunities;
    },
  });
}

export function useOpportunity(id: string) {
  return useQuery({
    queryKey: ['opportunity', id],
    queryFn: () => OpportunityService.getById(id),
    enabled: !!id,
  });
}

export function useCreateOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, createdBy }: { data: CreateOpportunityInput; createdBy: string }) => 
      OpportunityService.create({ ...data, createdBy }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

export function useUpdateOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, userId }: { id: string; data: UpdateOpportunityInput; userId: string }) =>
      OpportunityService.update(id, data, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['opportunity', variables.id] });
    },
  });
}

export function useDeleteOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => OpportunityService.delete(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}
