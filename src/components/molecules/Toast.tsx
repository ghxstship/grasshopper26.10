/**
 * Toast Component
 */

import { Body } from '@/components/ui-rebuild/atoms/Typography';

export interface ToastProps {
  title?: string;
  message: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  variant?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

export function Toast({ title, message, type = 'info' }: ToastProps) {
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  return (
    <div className={`${bgColors[type]} text-white px-6 py-4 rounded-lg shadow-lg`}>
      <Body>{message}</Body>
    </div>
  );
}
