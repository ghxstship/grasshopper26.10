import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

let toastCounter = 0;

/**
 * Simple toast hook for displaying notifications
 * This is a basic implementation - consider using a toast library like sonner or react-hot-toast
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((options: ToastOptions) => {
    const id = `toast-${++toastCounter}`;
    const duration = options.duration || 3000;

    const toast: Toast = {
      id,
      ...options,
    };

    setToasts((prev) => [...prev, toast]);

    // Auto-remove toast after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    // For now, also log to console as a fallback
    const prefix = options.variant === 'error' ? '❌' : options.variant === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} ${options.title}${options.description ? ': ' + options.description : ''}`);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
  };
}
