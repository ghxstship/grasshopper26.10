import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Adventure {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  capacity: number;
  availableSpots: number;
  location: string;
  images?: string[];
  featured: boolean;
  status: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AdventureFilters {
  status?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export function useAdventures(filters?: AdventureFilters) {
  return useQuery({
    queryKey: ['adventures', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
      if (filters?.minPrice) params.append('minPrice', String(filters.minPrice));
      if (filters?.maxPrice) params.append('maxPrice', String(filters.maxPrice));
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`/api/adventures?${params}`);
      if (!response.ok) throw new Error('Failed to fetch adventures');
      return response.json() as Promise<Adventure[]>;
    },
    staleTime: 30000,
  });
}

export function useAdventure(id: string) {
  return useQuery({
    queryKey: ['adventures', id],
    queryFn: async () => {
      const response = await fetch(`/api/adventures/${id}`);
      if (!response.ok) throw new Error('Failed to fetch adventure');
      return response.json() as Promise<Adventure>;
    },
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useBookAdventure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { adventureId: string; participants: number; date: string }) => {
      const response = await fetch('/api/adventures/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to book adventure');
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adventures'] });
      queryClient.invalidateQueries({ queryKey: ['adventures', variables.adventureId] });
    },
  });
}

export function useCancelAdventureBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await fetch(`/api/adventures/bookings/${bookingId}/cancel`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to cancel booking');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adventures'] });
    },
  });
}

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await fetch('/api/adventures/bookings');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },
    staleTime: 30000,
  });
}
