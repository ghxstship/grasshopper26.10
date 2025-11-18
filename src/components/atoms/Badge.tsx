import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 font-share-tech text-caption transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-200 text-gray-900",
        gvteway: "bg-gvteway-red-500 text-white",
        "gvteway-outline": "border-2 border-gvteway-red-500 text-gvteway-red-500",
        compvss: "bg-compvss-cyan-500 text-white",
        "compvss-outline": "border-2 border-compvss-cyan-500 text-compvss-cyan-500",
        atlvs: "bg-atlvs-green-500 text-black",
        "atlvs-outline": "border-2 border-atlvs-green-500 text-atlvs-green-500",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        error: "bg-error text-error-foreground",
        info: "bg-info text-info-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
