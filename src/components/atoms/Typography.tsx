import * as React from "react";
import { cn } from "@/lib/utils";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  variant?: 'anton' | 'bebas' | 'share-tech' | 'mono' | 'subtitle';
  children: React.ReactNode;
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ as: Component = 'p', variant, className, children, ...props }, ref) => {
    const variantClasses = {
      anton: 'font-anton',
      bebas: 'font-bebas',
      'share-tech': 'font-share-tech',
      mono: 'font-share-tech-mono',
      subtitle: 'subtitle',
    };

    return React.createElement(
      Component,
      {
        ref,
        className: cn(variant && variantClasses[variant], className),
        ...props,
      },
      children
    );
  }
);

Typography.displayName = "Typography";

// Specific typography components for convenience - Using semantic typography tokens
export const HeroTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h1 className={cn("font-anton text-hero", className)} {...props} />
);

export const DisplayTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h1 className={cn("font-anton text-display", className)} {...props} />
);

export const PageTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h1 className={cn("font-anton text-h1", className)} {...props} />
);

export const SectionHeader: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn("font-bebas text-h2", className)} {...props} />
);

export const SubsectionHeader: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h4 className={cn("font-bebas text-h3", className)} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h5 className={cn("font-bebas text-h4", className)} {...props} />
);

export const SmallHeader: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h6 className={cn("font-bebas text-h5", className)} {...props} />
);

export const Subtitle: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn("font-oswald text-subtitle", className)} {...props} />
);

export const BodyText: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn("font-share-tech text-body mb-4", className)} {...props} />
);

export const BodyTextLarge: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn("font-share-tech text-body-lg", className)} {...props} />
);

export const BodyTextSmall: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn("font-share-tech text-body-sm", className)} {...props} />
);

export const Metadata: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => (
  <span className={cn("font-share-tech-mono text-caption", className)} {...props} />
);

export const Caption: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => (
  <span className={cn("font-share-tech-mono text-caption", className)} {...props} />
);

export const Overline: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => (
  <span className={cn("font-share-tech-mono text-overline uppercase", className)} {...props} />
);
