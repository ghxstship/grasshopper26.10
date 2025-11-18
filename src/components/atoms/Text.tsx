import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("font-share-tech", {
  variants: {
    variant: {
      h1: "text-4xl font-bold",
      h2: "text-3xl font-bold",
      h3: "text-2xl font-semibold",
      h4: "text-xl font-semibold",
      h5: "text-lg font-medium",
      h6: "text-base font-medium",
      body: "text-base",
      caption: "text-sm",
      small: "text-xs",
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
