import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900 hover:bg-gray-100 border border-gray-200",
        primary: "bg-gray-900 text-white hover:bg-gray-800",
        outline: "border-2 border-gray-300 bg-transparent hover:bg-gray-100",
        ghost: "hover:bg-gray-100 text-gray-700",
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
