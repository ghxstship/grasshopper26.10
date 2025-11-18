import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("font-share-tech", {
  variants: {
    variant: {
      hero: "font-anton text-hero",
      display: "font-anton text-display",
      h1: "font-anton text-h1",
      h2: "font-bebas text-h2",
      h3: "font-bebas text-h3",
      h4: "font-bebas text-h4",
      h5: "font-bebas text-h5",
      h6: "font-bebas text-h6",
      subtitle: "font-oswald text-subtitle",
      "body-lg": "font-share-tech text-body-lg",
      body: "font-share-tech text-body",
      "body-sm": "font-share-tech text-body-sm",
      caption: "font-share-tech-mono text-caption",
      overline: "font-share-tech-mono text-overline uppercase",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

function Text({ 
  className, 
  variant, 
  as: Component = 'p',
  ...props 
}: TextProps) {
  return (
    <Component className={cn(textVariants({ variant }), className)} {...props} />
  );
}

export { Text, textVariants };
