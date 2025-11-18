import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface SearchResult {
  id: string;
  type: 'event' | 'user' | 'organization' | 'project' | 'task' | 'asset';
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
}

interface SearchState {
  // State
  query: string;
  results: SearchResult[];
  recentSearches: string[];
  filters: {
    type: string;
    dateRange: [string, string] | null;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setQuery: (query: string) => void;
  setResults: (results: SearchResult[]) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  updateFilters: (filters: Partial<SearchState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  query: '',
  results: [],
  recentSearches: [],
  filters: {
    type: 'all',
    dateRange: null,
  },
  isLoading: false,
  error: null,
};

export const useSearchStore = create<SearchState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setQuery: (query) => set({ query }),

        setResults: (results) => set({ results }),

        addRecentSearch: (query) =>
          set((state) => {
            const filtered = state.recentSearches.filter((q) => q !== query);
            return {
              recentSearches: [query, ...filtered].slice(0, 10),
            };
          }),

        clearRecentSearches: () => set({ recentSearches: [] }),

        updateFilters: (filters) =>
          set((state) => ({
            filters: { ...state.filters, ...filters },
          })),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        reset: () => set({ ...initialState, recentSearches: [] }),
      }),
      {
        name: 'search-storage',
        partialize: (state) => ({
          recentSearches: state.recentSearches,
          filters: state.filters,
        }),
      }
    ),
    { name: 'SearchStore' }
  )
);
