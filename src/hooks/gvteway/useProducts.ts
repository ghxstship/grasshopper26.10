/**
 * Products Hook
 * Fetches marketplace products
 */

import useSWR from 'swr';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  featured: boolean;
  createdAt: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useProducts(filters?: ProductFilters) {
  const params = new URLSearchParams();
  
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());

  const { data, error, mutate, isLoading } = useSWR<{
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/api/products?${params}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return {
    products: data?.products,
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useProduct(id: string) {
  const { data, error, mutate, isLoading } = useSWR<Product>(
    id ? `/api/products/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    product: data,
    isLoading,
    isError: error,
    mutate,
  };
}
