/**
 * Typography Components - Atomic Design System
 * ANTON (Display) / BEBAS NEUE (Headings) / SHARE TECH (Body)
 * Strict hierarchy, maximum readability
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// Display Typography - ANTON (All Caps, Bold Statements)
// ============================================================================

interface HeroProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

export const Hero = React.forwardRef<HTMLHeadingElement, HeroProps>(
  ({ className, as: Component = 'h1', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-anton text-6xl md:text-8xl lg:text-9xl font-normal leading-none tracking-wider uppercase',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Hero.displayName = 'Hero';

export const Display = React.forwardRef<HTMLHeadingElement, HeroProps>(
  ({ className, as: Component = 'h2', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-anton text-5xl md:text-6xl lg:text-7xl font-normal leading-none tracking-wider uppercase',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Display.displayName = 'Display';

// ============================================================================
// Heading Typography - BEBAS NEUE (Clean, Modern Hierarchy)
// ============================================================================

export const H1 = React.forwardRef<HTMLHeadingElement, HeroProps>(
  ({ className, as: Component = 'h1', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-bebas-neue text-5xl md:text-6xl font-normal leading-tight tracking-wide',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
H1.displayName = 'H1';

export const H2 = React.forwardRef<HTMLHeadingElement, HeroProps>(
  ({ className, as: Component = 'h2', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-bebas-neue text-4xl md:text-5xl font-normal leading-tight tracking-wide',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
H2.displayName = 'H2';

export const H3 = React.forwardRef<HTMLHeadingElement, HeroProps>(
  ({ className, as: Component = 'h3', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-bebas-neue text-3xl md:text-4xl font-normal leading-snug tracking-wide',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
H3.displayName = 'H3';

export const H4 = React.forwardRef<HTMLHeadingElement, HeroProps>(
  ({ className, as: Component = 'h4', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-bebas-neue text-2xl md:text-3xl font-normal leading-snug tracking-wide',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
H4.displayName = 'H4';

export const H5 = React.forwardRef<HTMLHeadingElement, HeroProps>(
  ({ className, as: Component = 'h5', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-bebas-neue text-xl md:text-2xl font-normal leading-normal tracking-wide',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
H5.displayName = 'H5';

export const H6 = React.forwardRef<HTMLHeadingElement, HeroProps>(
  ({ className, as: Component = 'h6', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-bebas-neue text-lg md:text-xl font-normal leading-normal tracking-wide',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
H6.displayName = 'H6';

// ============================================================================
// Body Typography - SHARE TECH (Technical Precision)
// ============================================================================

interface BodyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span' | 'div';
}

export const BodyLarge = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ className, as: Component = 'p', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-share-tech text-lg leading-relaxed tracking-wide',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
BodyLarge.displayName = 'BodyLarge';

export const Body = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ className, as: Component = 'p', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-share-tech text-base leading-relaxed tracking-wide',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Body.displayName = 'Body';

export const BodySmall = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ className, as: Component = 'p', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-share-tech text-sm leading-normal tracking-wide',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
BodySmall.displayName = 'BodySmall';

// ============================================================================
// Utility Typography
// ============================================================================

export const Caption = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ className, as: Component = 'p', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-share-tech text-xs leading-normal tracking-wider text-gray-600',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Caption.displayName = 'Caption';

export const Overline = React.forwardRef<HTMLParagraphElement, BodyProps>(
  ({ className, as: Component = 'p', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-share-tech text-[10px] leading-normal tracking-[0.1em] uppercase text-gray-500',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Overline.displayName = 'Overline';

export const Code = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <code
        ref={ref}
        className={cn(
          'font-share-tech-mono text-sm bg-gray-100 px-2 py-1 rounded border border-gray-300',
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  }
);
Code.displayName = 'Code';

// ============================================================================
// Form Typography
// ============================================================================

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'block font-bebas-neue text-lg tracking-wide mb-2',
          className
        )}
        {...props}
      >
        {children}
      </label>
    );
  }
);
Label.displayName = 'Label';

// Aliases for backward compatibility
export const BodyText = Body;
export const BodyTextSmall = BodySmall;
export const SectionHeader = H2;
export const SubsectionHeader = H3;
export const CardTitle = H4;
