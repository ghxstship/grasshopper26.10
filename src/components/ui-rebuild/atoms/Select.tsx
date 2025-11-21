/**
 * Select Component - Atomic Design System
 * Brutalist dropdown selector
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, helperText, options, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          className={cn(
            'flex h-11 w-full border-2 border-black bg-white px-4 py-2',
            'font-share-tech text-base text-black',
            'transition-all duration-150',
            'focus:outline-none focus:ring-4 focus:ring-black focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
            error && 'border-gray-900 bg-gray-50',
            'shadow-[2px_2px_0_0_rgba(0,0,0,1)]',
            'focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)]',
            'focus:translate-x-[-2px] focus:translate-y-[-2px]',
            'appearance-none cursor-pointer',
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select';

export { Select };
