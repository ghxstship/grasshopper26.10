import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  images?: string[];
  featured: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductFilters {
  category?: string;
  status?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
      if (filters?.minPrice) params.append('minPrice', String(filters.minPrice));
      if (filters?.maxPrice) params.append('maxPrice', String(filters.maxPrice));
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json() as Promise<Product[]>;
    },
    staleTime: 30000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json() as Promise<Product>;
    },
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Product>) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Product>) => {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useCart() {
  const queryClient = useQueryClient();
  
  const { data: cart, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Failed to fetch cart');
      return response.json();
    },
    staleTime: 30000,
  });

  const addItem = useMutation({
    mutationFn: async (item: { productId: string; quantity: number }) => {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Failed to add item to cart');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove item from cart');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error('Failed to update item quantity');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    cart,
    isLoading,
    error,
    addItem: addItem.mutate,
    removeItem: removeItem.mutate,
    updateItem: updateItem.mutate,
  };
}
