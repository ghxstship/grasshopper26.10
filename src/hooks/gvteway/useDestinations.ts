import { useQuery } from '@tanstack/react-query';

interface Destination {
  id: string;
  name: string;
  category: 'stay' | 'dining' | 'shopping' | 'wellness';
  image: string;
  address: string;
  distance: string;
  priceLevel: number;
  rating: number;
  reviewCount: number;
  slug: string;
  googlePlaceId: string;
}

export function useDestinations(category?: string) {
  return useQuery<Destination[]>({
    queryKey: ['destinations', category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      
      const response = await fetch(`/api/destinations?${params}`);
      if (!response.ok) throw new Error('Failed to fetch destinations');
      return response.json();
    },
  });
}

export function useDestination(slug: string) {
  return useQuery<Destination>({
    queryKey: ['destination', slug],
    queryFn: async () => {
      const response = await fetch(`/api/destinations/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch destination');
      return response.json();
    },
    enabled: !!slug,
  });
}
