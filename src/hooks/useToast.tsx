'use client';

import * as React from "react";
import type { ToastProps } from "@/components/molecules/Toast";

export interface ToastItem extends ToastProps {
  id: string;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastProps, "onClose">) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastProps, "onClose">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Convenience methods
export const toast = {
  success: (_title: string, _description?: string) => {
    // This will be implemented by the consumer using useToast hook
    console.warn("Toast provider not initialized. Wrap your app with ToastProvider.");
  },
  error: (_title: string, _description?: string) => {
    console.warn("Toast provider not initialized. Wrap your app with ToastProvider.");
  },
  warning: (_title: string, _description?: string) => {
    console.warn("Toast provider not initialized. Wrap your app with ToastProvider.");
  },
  info: (_title: string, _description?: string) => {
    console.warn("Toast provider not initialized. Wrap your app with ToastProvider.");
  },
};
