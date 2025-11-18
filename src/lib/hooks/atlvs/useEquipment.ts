import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Equipment {
  id: string;
  name: string;
  category: string;
  status: string;
  condition: string;
  serialNumber?: string;
  purchaseDate?: Date;
  warrantyExpiry?: Date;
  location?: string;
  assignedTo?: string;
  maintenanceSchedule?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface EquipmentFilters {
  category?: string;
  status?: string;
  condition?: string;
  location?: string;
  search?: string;
}

export function useEquipment(filters?: EquipmentFilters) {
  return useQuery({
    queryKey: ['equipment', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.condition) params.append('condition', filters.condition);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`/api/atlvs/equipment?${params}`);
      if (!response.ok) throw new Error('Failed to fetch equipment');
      return response.json() as Promise<Equipment[]>;
    },
    staleTime: 30000,
  });
}

export function useEquipmentItem(id: string) {
  return useQuery({
    queryKey: ['equipment', id],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/equipment/${id}`);
      if (!response.ok) throw new Error('Failed to fetch equipment');
      return response.json() as Promise<Equipment>;
    },
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Equipment>) => {
      const response = await fetch('/api/atlvs/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create equipment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });
}

export function useUpdateEquipment(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Equipment>) => {
      const response = await fetch(`/api/atlvs/equipment/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update equipment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      queryClient.invalidateQueries({ queryKey: ['equipment', id] });
    },
  });
}

export function useDeleteEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/atlvs/equipment/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete equipment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
  });
}
