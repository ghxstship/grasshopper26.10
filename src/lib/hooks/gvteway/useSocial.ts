/**
 * React Query hooks for GVTEWAY Social Features
 * Provides data fetching, caching, and state management for social posts, comments, likes
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface SocialPost {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface SocialFilters {
  userId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch social feed
 */
export function useSocialFeed(filters: SocialFilters = {}) {
  return useQuery({
    queryKey: ['social-feed', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`/api/social/feed?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch social feed');
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
}

/**
 * Create social post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { content: string; imageUrl?: string }) => {
      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create post');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-feed'] });
    },
  });
}

/**
 * Like/unlike post
 */
export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/social/posts/${postId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to like post');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-feed'] });
    },
  });
}

/**
 * Add comment to post
 */
export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const response = await fetch(`/api/social/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add comment');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-feed'] });
    },
  });
}

/**
 * Get post comments
 */
export function usePostComments(postId: string | undefined) {
  return useQuery({
    queryKey: ['post-comments', postId],
    queryFn: async () => {
      if (!postId) throw new Error('Post ID is required');

      const response = await fetch(`/api/social/posts/${postId}/comments`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      return response.json();
    },
    enabled: !!postId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Follow/unfollow user
 */
export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/social/friends/${userId}/add`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to follow user');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-friends'] });
    },
  });
}

/**
 * Unfollow user
 */
export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/social/friends/${userId}/remove`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to unfollow user');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-friends'] });
    },
  });
}

/**
 * Get friends list
 */
export function useFriends() {
  return useQuery({
    queryKey: ['social-friends'],
    queryFn: async () => {
      const response = await fetch('/api/social/friends');
      
      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}
