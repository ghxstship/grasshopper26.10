/**
 * Textarea Component - Atomic Design System
 * Brutalist multi-line text input
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            'flex min-h-[80px] w-full border-2 border-black bg-white px-4 py-3',
            'font-share-tech text-base text-black',
            'transition-all duration-150',
            'focus:outline-none focus:ring-4 focus:ring-black focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
            'placeholder:text-gray-400',
            error && 'border-gray-900 bg-gray-50',
            'shadow-[2px_2px_0_0_rgba(0,0,0,1)]',
            'focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)]',
            'focus:translate-x-[-2px] focus:translate-y-[-2px]',
            'resize-vertical',
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

Textarea.displayName = 'Textarea';

export { Textarea };
