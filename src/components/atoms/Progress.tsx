'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  variant?: 'default' | 'gvteway' | 'atlvs' | 'compvss';
  brutalist?: boolean;  // Enable neobrutalist styling
  showBorder?: boolean; // Show border around progress bar
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, variant = 'default', brutalist = true, showBorder = true, ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'gvteway':
          return 'bg-black';  // Brutalist: solid black
        case 'atlvs':
          return 'bg-black';
        case 'compvss':
          return 'bg-black';
        default:
          return 'bg-black';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full overflow-hidden',
          // Brutalist: sharp edges, flat design
          brutalist ? 'rounded-none h-4' : 'rounded-full h-2',
          brutalist && showBorder ? 'border-2 border-black' : '',
          'bg-grey-200 dark:bg-grey-800',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'h-full transition-all',
            getVariantStyles()
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
