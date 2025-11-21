import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-3 py-1 font-share-tech text-caption transition-colors uppercase tracking-wide",
  {
    variants: {
      variant: {
        // Brutalist: sharp edges, bold borders
        default: "rounded-none bg-grey-200 text-black border-2 border-black",
        gvteway: "rounded-none bg-black text-white border-2 border-black",
        "gvteway-outline": "rounded-none border-2 border-black text-black bg-white",
        compvss: "rounded-none bg-black text-white border-2 border-black",
        "compvss-outline": "rounded-none border-2 border-black text-black bg-white",
        atlvs: "rounded-none bg-black text-white border-2 border-black",
        "atlvs-outline": "rounded-none border-2 border-black text-black bg-white",
        success: "rounded-none bg-black text-white border-2 border-black",
        warning: "rounded-none bg-white text-black border-2 border-black",
        error: "rounded-none bg-black text-white border-2 border-black",
        info: "rounded-none bg-grey-100 text-black border-2 border-black",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        full: "rounded-full",  // For legacy support
      },
    },
    defaultVariants: {
      variant: "default",
      rounded: "none",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  brutalist?: boolean;  // Enable neobrutalist styling (default true)
}

function Badge({ className, variant, rounded, brutalist: _brutalist = true, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, rounded }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
