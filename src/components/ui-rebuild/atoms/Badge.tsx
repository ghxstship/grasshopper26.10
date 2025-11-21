/**
 * Badge Component - Atomic Design System
 * Minimal status indicators
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center border-2 border-black px-3 py-1 font-bebas text-sm uppercase tracking-wider transition-all',
  {
    variants: {
      variant: {
        default: 'bg-black text-white',
        outline: 'bg-white text-black',
        ghost: 'bg-gray-100 text-black border-gray-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
