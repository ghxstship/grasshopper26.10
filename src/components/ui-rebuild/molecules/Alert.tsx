/**
 * Alert Component - Molecular Design System
 * Notification and message display
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Body } from '../atoms/Typography';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error';
  title?: string;
  onClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', title, onClose, children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-white border-black',
      success: 'bg-white border-black',
      warning: 'bg-gray-100 border-black',
      error: 'bg-gray-100 border-gray-900',
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative border-2 p-4',
          'shadow-[2px_2px_0_0_rgba(0,0,0,1)]',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1">
            {title && (
              <div className="font-bebas text-lg tracking-wide mb-2">
                {title}
              </div>
            )}
            <Body className="text-sm">{children}</Body>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 hover:bg-gray-100 transition-colors"
              aria-label="Close alert"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export { Alert };
