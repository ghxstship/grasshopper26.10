import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white text-grey-900 hover:bg-grey-100 border border-grey-200",
        primary: "bg-grey-900 text-white hover:bg-grey-800",
        outline: "border-2 border-grey-300 bg-transparent hover:bg-grey-100",
        ghost: "hover:bg-grey-100 text-grey-700",
        gvteway: "bg-gvteway-red-500 text-white hover:bg-gvteway-red-600",
        compvss: "bg-compvss-cyan-500 text-white hover:bg-compvss-cyan-600",
        atlvs: "bg-atlvs-green-500 text-black hover:bg-atlvs-green-600",
      },
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: React.ReactNode;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, icon, ...props }, ref) => {
    return (
      <button
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {icon}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
