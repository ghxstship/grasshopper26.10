import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  imageUrl: string | null;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

interface SocialState {
  // State
  posts: SocialPost[];
  currentPost: SocialPost | null;
  comments: Comment[];
  filters: {
    type: 'all' | 'following' | 'trending';
    search: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setPosts: (posts: SocialPost[]) => void;
  setCurrentPost: (post: SocialPost | null) => void;
  addPost: (post: SocialPost) => void;
  updatePost: (id: string, updates: Partial<SocialPost>) => void;
  deletePost: (id: string) => void;
  toggleLike: (id: string) => void;
  setComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
  updateFilters: (filters: Partial<SocialState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  posts: [],
  currentPost: null,
  comments: [],
  filters: {
    type: 'all' as const,
    search: '',
  },
  isLoading: false,
  error: null,
};

export const useSocialStore = create<SocialState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setPosts: (posts) => set({ posts }),

        setCurrentPost: (post) => set({ currentPost: post }),

        addPost: (post) =>
          set((state) => ({
            posts: [post, ...state.posts],
          })),

        updatePost: (id, updates) =>
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === id ? { ...post, ...updates } : post
            ),
            currentPost:
              state.currentPost?.id === id
                ? { ...state.currentPost, ...updates }
                : state.currentPost,
          })),

        deletePost: (id) =>
          set((state) => ({
            posts: state.posts.filter((post) => post.id !== id),
            currentPost: state.currentPost?.id === id ? null : state.currentPost,
          })),

        toggleLike: (id) =>
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === id
                ? {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                  }
                : post
            ),
          })),

        setComments: (comments) => set({ comments }),

        addComment: (comment) =>
          set((state) => ({
            comments: [comment, ...state.comments],
            posts: state.posts.map((post) =>
              post.id === comment.postId
                ? { ...post, comments: post.comments + 1 }
                : post
            ),
          })),

        updateFilters: (filters) =>
          set((state) => ({
            filters: { ...state.filters, ...filters },
          })),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'gvteway-social-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'SocialStore' }
  )
);
