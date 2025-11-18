import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface MarketplaceItem {
  id: string;
  type: 'ticket' | 'merch' | 'experience';
  title: string;
  event?: string;
  seller: string;
  sellerRating: number;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  pricePerItem?: number;
  date?: string;
  venue?: string;
  condition?: string;
  size?: string;
  includes?: string[];
  verified: boolean;
  featured: boolean;
}

export function useMarketplaceItems(type?: string) {
  return useQuery<MarketplaceItem[]>({
    queryKey: ['marketplace', type],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      
      const response = await fetch(`/api/marketplace?${params}`);
      if (!response.ok) throw new Error('Failed to fetch marketplace items');
      return response.json();
    },
  });
}

export function useMarketplaceItem(id: string) {
  return useQuery<MarketplaceItem>({
    queryKey: ['marketplace-item', id],
    queryFn: async () => {
      const response = await fetch(`/api/marketplace/${id}`);
      if (!response.ok) throw new Error('Failed to fetch marketplace item');
      return response.json();
    },
    enabled: !!id,
  });
}

export function usePurchaseMarketplaceItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const response = await fetch(`/api/marketplace/${itemId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error('Failed to purchase item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
    },
  });
}

export function useListMarketplaceItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: Partial<MarketplaceItem>) => {
      const response = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Failed to list item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
    },
  });
}
