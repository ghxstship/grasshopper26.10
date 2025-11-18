import { useQuery } from '@tanstack/react-query';

interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  followers: number;
  upcomingShows: number;
  slug: string;
  spotifyId: string;
}

export function useArtists(genre?: string) {
  return useQuery<Artist[]>({
    queryKey: ['artists', genre],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (genre) params.append('genre', genre);
      
      const response = await fetch(`/api/artists?${params}`);
      if (!response.ok) throw new Error('Failed to fetch artists');
      return response.json();
    },
  });
}

export function useArtist(slug: string) {
  return useQuery<Artist>({
    queryKey: ['artist', slug],
    queryFn: async () => {
      const response = await fetch(`/api/artists/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch artist');
      return response.json();
    },
    enabled: !!slug,
  });
}
