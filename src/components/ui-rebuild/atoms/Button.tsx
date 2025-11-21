/**
 * Button Component - Atomic Design System
 * Contemporary Minimal Pop Art - Monochromatic
 * High contrast, brutalist clarity
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles - Brutalist, high contrast
  'inline-flex items-center justify-center font-bebas-neue uppercase tracking-wider transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        // Primary - Solid black
        primary: 'bg-black text-white hover:bg-gray-900 active:bg-gray-950 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px]',
        
        // Secondary - Outlined
        secondary: 'bg-white text-black border-2 border-black hover:bg-gray-100 active:bg-gray-200 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px]',
        
        // Ghost - Minimal
        ghost: 'bg-transparent text-black hover:bg-gray-100 active:bg-gray-200',
        
        // Destructive - Still monochrome but bold
        destructive: 'bg-gray-900 text-white border-2 border-black hover:bg-black active:bg-gray-950',
        
        // Link - Text only
        link: 'bg-transparent text-black underline-offset-4 hover:underline',
        
        // Platform variants
        atlvs: 'bg-green-500 text-white hover:bg-green-600 shadow-[4px_4px_0_0_rgba(34,197,94,1)] hover:shadow-[6px_6px_0_0_rgba(34,197,94,1)]',
        compvss: 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-[4px_4px_0_0_rgba(6,182,212,1)] hover:shadow-[6px_6px_0_0_rgba(6,182,212,1)]',
        gvteway: 'bg-red-500 text-white hover:bg-red-600 shadow-[4px_4px_0_0_rgba(239,68,68,1)] hover:shadow-[6px_6px_0_0_rgba(239,68,68,1)]',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        xl: 'h-16 px-10 text-xl',
        icon: 'h-11 w-11',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
