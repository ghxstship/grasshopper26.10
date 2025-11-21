/**
 * Card Component - Atomic Design System
 * Brutalist containers with sharp edges
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'atlvs' | 'compvss' | 'gvteway' | 'default';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantStyles = {
      atlvs: 'border-green-500 shadow-[4px_4px_0_0_rgba(34,197,94,1)] hover:shadow-[6px_6px_0_0_rgba(34,197,94,1)]',
      compvss: 'border-cyan-500 shadow-[4px_4px_0_0_rgba(6,182,212,1)] hover:shadow-[6px_6px_0_0_rgba(6,182,212,1)]',
      gvteway: 'border-red-500 shadow-[4px_4px_0_0_rgba(239,68,68,1)] hover:shadow-[6px_6px_0_0_rgba(239,68,68,1)]',
      default: 'border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-white border-2 p-6',
          'transition-all duration-150',
          'hover:translate-x-[-2px] hover:translate-y-[-2px]',
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-2 pb-4 border-b-2 border-gray-200', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('font-bebas text-2xl font-normal leading-tight tracking-wide', className)}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('font-share-tech text-sm text-gray-600 leading-normal', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-4', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4 border-t-2 border-gray-200', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
