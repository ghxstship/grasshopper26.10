import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  ticketId: string;
  eventId: string;
  eventTitle: string;
  ticketType: string;
  price: number;
  quantity: number;
  currency: string;
  addedAt: string;
}

interface CartState {
  // State
  items: CartItem[];
  isLoading: boolean;
  error: string | null;

  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemCount: (ticketId: string) => number;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        getTotalItems: () => {
          return get().items.reduce((total, item) => total + item.quantity, 0);
        },

        getTotalPrice: () => {
          return get().items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
        },

        getItemCount: (ticketId: string) => {
          const item = get().items.find((i) => i.ticketId === ticketId);
          return item ? item.quantity : 0;
        },

        addItem: (item) =>
          set((state) => {
            // Check if item already exists
            const existingItem = state.items.find(
              (i) => i.ticketId === item.ticketId
            );

            if (existingItem) {
              // Update quantity
              return {
                items: state.items.map((i) =>
                  i.ticketId === item.ticketId
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i
                ),
              };
            }

            // Add new item
            return {
              items: [...state.items, item],
            };
          }),

        removeItem: (itemId) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== itemId),
          })),

        updateQuantity: (itemId, quantity) =>
          set((state) => {
            if (quantity <= 0) {
              return {
                items: state.items.filter((item) => item.id !== itemId),
              };
            }

            return {
              items: state.items.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
              ),
            };
          }),

        clearCart: () => set({ items: [] }),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),
      }),
      {
        name: 'gvteway-cart-storage',
        partialize: (state) => ({
          items: state.items,
        }),
      }
    ),
    { name: 'CartStore' }
  )
);
