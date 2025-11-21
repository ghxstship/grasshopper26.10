/**
 * Input Component - Atomic Design System
 * Brutalist, high-contrast form inputs
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            // Base styles
            'flex h-11 w-full border-2 border-black bg-white px-4 py-2',
            'font-share-tech text-base text-black placeholder:text-gray-400',
            'transition-all duration-150',
            // Focus state
            'focus:outline-none focus:ring-4 focus:ring-black focus:ring-offset-2',
            // Disabled state
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
            // Error state
            error && 'border-gray-900 bg-gray-50',
            // Brutalist shadow
            'shadow-[2px_2px_0_0_rgba(0,0,0,1)]',
            'focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)]',
            'focus:translate-x-[-2px] focus:translate-y-[-2px]',
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p
            className={cn(
              'mt-2 text-sm font-share-tech',
              error ? 'text-gray-900' : 'text-gray-600'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
