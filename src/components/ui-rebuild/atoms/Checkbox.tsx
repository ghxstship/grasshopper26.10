/**
 * Checkbox Component - Atomic Design System
 * Brutalist checkbox with clear states
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : 'item'}`;

    return (
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id={checkboxId}
          ref={ref}
          className={cn(
            'h-5 w-5 border-2 border-black bg-white',
            'transition-all duration-150',
            'focus:outline-none focus:ring-4 focus:ring-black focus:ring-offset-2',
            'checked:bg-black checked:border-black',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'cursor-pointer',
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className="font-share-tech text-base text-black cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
