/**
 * Artists Hook
 * Fetches artist profiles and related events
 */

import useSWR from 'swr';

export interface Artist {
  id: string;
  name: string;
  bio: string;
  genre: string;
  image: string;
  verified: boolean;
  followers: number;
  upcomingEvents: number;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useArtists(filters?: { search?: string; genre?: string }) {
  const params = new URLSearchParams();
  
  if (filters?.search) params.append('search', filters.search);
  if (filters?.genre) params.append('genre', filters.genre);

  const { data, error, mutate, isLoading } = useSWR<{
    artists: Artist[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/api/artists?${params}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return {
    artists: data?.artists,
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useArtist(id: string) {
  const { data, error, mutate, isLoading } = useSWR<Artist>(
    id ? `/api/artists/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    artist: data,
    isLoading,
    isError: error,
    mutate,
  };
}
