/**
 * React Query hooks for ATLVS Vehicles
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface VehicleFilters {
  organizationId?: string;
  projectId?: string;
  status?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateVehicleData {
  organizationId: string;
  projectId?: string;
  name: string;
  type: string;
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
  capacity?: number;
  status?: string;
}

export interface UpdateVehicleData {
  name?: string;
  type?: string;
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
  capacity?: number;
  status?: string;
}

/**
 * Hook to fetch list of vehicles
 */
export function useVehicles(filters: VehicleFilters = {}) {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.organizationId) params.append('organizationId', filters.organizationId);
      if (filters.projectId) params.append('projectId', filters.projectId);
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/atlvs/vehicles?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      
      return response.json();
    },
  });
}

/**
 * Hook to fetch a single vehicle by ID
 */
export function useVehicle(id: string) {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/vehicles/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch vehicle');
      }
      
      return response.json();
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new vehicle
 */
export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVehicleData) => {
      const response = await fetch('/api/atlvs/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create vehicle');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

/**
 * Hook to update a vehicle
 */
export function useUpdateVehicle(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateVehicleData) => {
      const response = await fetch(`/api/atlvs/vehicles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update vehicle');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle', id] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

/**
 * Hook to delete a vehicle
 */
export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/atlvs/vehicles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete vehicle');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

/**
 * Hook to fetch vehicle maintenance logs
 */
export function useVehicleMaintenance(vehicleId: string) {
  return useQuery({
    queryKey: ['vehicle-maintenance', vehicleId],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/vehicles/${vehicleId}/maintenance`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch maintenance logs');
      }
      
      return response.json();
    },
    enabled: !!vehicleId,
  });
}
