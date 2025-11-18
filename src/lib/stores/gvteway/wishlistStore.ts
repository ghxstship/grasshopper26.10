import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventImage: string;
  ticketPrice: number;
  addedAt: string;
}

interface WishlistState {
  // State
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setItems: (items: WishlistItem[]) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (eventId: string) => boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

export const useWishlistStore = create<WishlistState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setItems: (items) => set({ items }),

        addItem: (item) =>
          set((state) => ({
            items: [item, ...state.items],
          })),

        removeItem: (id) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
          })),

        clearWishlist: () => set({ items: [] }),

        isInWishlist: (eventId) =>
          get().items.some((item) => item.eventId === eventId),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'gvteway-wishlist-storage',
      }
    ),
    { name: 'WishlistStore' }
  )
);
