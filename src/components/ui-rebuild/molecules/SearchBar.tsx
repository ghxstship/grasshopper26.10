/**
 * SearchBar Component - Molecular Design System
 * Search input with icon and clear button
 */

import * as React from 'react';
import { Input } from '../atoms/Input';
import { cn } from '@/lib/utils';

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
  loading?: boolean;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, onClear, loading, value, ...props }, ref) => {
    return (
      <div className={cn('relative w-full', className)}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <Input
          ref={ref}
          type="search"
          className="pl-12 pr-12"
          value={value}
          {...props}
        />
        {(value || loading) && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full" />
            ) : (
              <button
                type="button"
                onClick={onClear}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Clear search"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
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
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export { SearchBar };
