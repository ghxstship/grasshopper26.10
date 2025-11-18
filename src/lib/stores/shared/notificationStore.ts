import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl: string | null;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

interface NotificationState {
  // State
  notifications: Notification[];
  unreadCount: number;
  filters: {
    type: string;
    read: 'all' | 'read' | 'unread';
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  updateFilters: (filters: Partial<NotificationState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  notifications: [],
  unreadCount: 0,
  filters: {
    type: 'all',
    read: 'all' as const,
  },
  isLoading: false,
  error: null,
};

export const useNotificationStore = create<NotificationState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setNotifications: (notifications) =>
          set({
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
          }),

        addNotification: (notification) =>
          set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: notification.read
              ? state.unreadCount
              : state.unreadCount + 1,
          })),

        markAsRead: (id) =>
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: state.notifications.find((n) => n.id === id && !n.read)
              ? state.unreadCount - 1
              : state.unreadCount,
          })),

        markAllAsRead: () =>
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
          })),

        deleteNotification: (id) =>
          set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            return {
              notifications: state.notifications.filter((n) => n.id !== id),
              unreadCount:
                notification && !notification.read
                  ? state.unreadCount - 1
                  : state.unreadCount,
            };
          }),

        clearAll: () => set({ notifications: [], unreadCount: 0 }),

        updateFilters: (filters) =>
          set((state) => ({
            filters: { ...state.filters, ...filters },
          })),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'notification-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'NotificationStore' }
  )
);
