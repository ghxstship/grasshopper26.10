'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  variant?: 'default' | 'gvteway' | 'atlvs' | 'compvss';
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, variant = 'default', ...props }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'gvteway':
          return 'bg-gvteway-red-500';
        case 'atlvs':
          return 'bg-atlvs-green-500';
        case 'compvss':
          return 'bg-compvss-cyan-500';
        default:
          return 'bg-primary';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-grey-200 dark:bg-grey-800',
          className
        )}
        {...props}
      >
        <div
          className={cn('h-full transition-all', getVariantStyles())}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
