import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Modal {
  id: string;
  component: string;
  props?: Record<string, unknown>;
}

interface UIState {
  // State
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  modals: Modal[];
  activeModal: Modal | null;
  loading: boolean;
  toast: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: UIState['theme']) => void;
  openModal: (modal: Modal) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  setLoading: (loading: boolean) => void;
  showToast: (
    message: string,
    type: UIState['toast']['type']
  ) => void;
  hideToast: () => void;
  reset: () => void;
}

const initialState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: 'system' as const,
  modals: [],
  activeModal: null,
  loading: false,
  toast: {
    show: false,
    message: '',
    type: 'info' as const,
  },
};

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        setSidebarOpen: (open) => set({ sidebarOpen: open }),

        toggleSidebarCollapsed: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

        setTheme: (theme) => set({ theme }),

        openModal: (modal) =>
          set((state) => ({
            modals: [...state.modals, modal],
            activeModal: modal,
          })),

        closeModal: (id) =>
          set((state) => {
            const newModals = state.modals.filter((m) => m.id !== id);
            return {
              modals: newModals,
              activeModal: newModals[newModals.length - 1] || null,
            };
          }),

        closeAllModals: () => set({ modals: [], activeModal: null }),

        setLoading: (loading) => set({ loading }),

        showToast: (message, type) =>
          set({
            toast: { show: true, message, type },
          }),

        hideToast: () =>
          set((state) => ({
            toast: { ...state.toast, show: false },
          })),

        reset: () => set(initialState),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
      }
    ),
    { name: 'UIStore' }
  )
);
