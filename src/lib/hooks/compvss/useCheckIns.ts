import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface CheckIn {
  id: string;
  userId: string;
  eventId?: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  notes?: string;
  status: string;
  checkedInAt: Date;
  checkedOutAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  role?: string;
  organization?: string;
  zone?: string;
  checkInTime?: string;
  user?: {
    name?: string;
  };
}

interface CheckInFilters {
  eventId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export function useCheckIns(filters?: CheckInFilters) {
  return useQuery({
    queryKey: ['checkins', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.eventId) params.append('eventId', filters.eventId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/compvss/checkin?${params}`);
      if (!response.ok) throw new Error('Failed to fetch check-ins');
      return response.json() as Promise<CheckIn[]>;
    },
    staleTime: 30000,
  });
}

export function useCheckInHistory() {
  return useQuery({
    queryKey: ['checkins', 'history'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/checkin/history');
      if (!response.ok) throw new Error('Failed to fetch check-in history');
      return response.json() as Promise<CheckIn[]>;
    },
    staleTime: 30000,
  });
}

export function useCheckInStats() {
  return useQuery({
    queryKey: ['checkins', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/checkin/stats');
      if (!response.ok) throw new Error('Failed to fetch check-in stats');
      return response.json();
    },
    staleTime: 60000,
  });
}

export function useCreateCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CheckIn>) => {
      const response = await fetch('/api/compvss/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create check-in');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkins'] });
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/compvss/checkin/${id}/checkout`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to check out');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkins'] });
    },
  });
}
