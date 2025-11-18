import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-bebas text-body transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // GVTEWAY variants
        gvteway: "bg-gradient-to-r from-gvteway-red-500 via-gvteway-yellow-500 to-gvteway-blue-500 text-black hover:shadow-lg hover:shadow-gvteway-red-500/50",
        "gvteway-outline": "border-2 border-gvteway-red-500 text-gvteway-red-500 hover:bg-gvteway-red-500 hover:text-black",
        "gvteway-ghost": "text-gvteway-red-500 hover:bg-gvteway-red-500/10",
        
        // COMPVSS variants
        compvss: "bg-gradient-to-r from-compvss-cyan-500 via-compvss-teal-500 to-compvss-indigo-500 text-white hover:shadow-lg hover:shadow-compvss-cyan-500/50",
        "compvss-outline": "border-2 border-compvss-cyan-500 text-compvss-cyan-500 hover:bg-compvss-cyan-500 hover:text-white",
        "compvss-ghost": "text-compvss-cyan-500 hover:bg-compvss-cyan-500/10",
        
        // ATLVS variants
        atlvs: "bg-gradient-to-r from-atlvs-green-500 via-atlvs-orange-500 to-atlvs-purple-500 text-black hover:shadow-lg hover:shadow-atlvs-green-500/50",
        "atlvs-outline": "border-2 border-atlvs-green-500 text-atlvs-green-500 hover:bg-atlvs-green-500 hover:text-black",
        "atlvs-ghost": "text-atlvs-green-500 hover:bg-atlvs-green-500/10",
        
        // Standard variants
        default: "bg-white text-black hover:bg-gray-100",
        primary: "bg-black text-white hover:bg-gray-900",
        secondary: "bg-gray-200 text-black hover:bg-gray-300",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-gray-300 bg-transparent hover:bg-gray-100",
        ghost: "hover:bg-gray-100",
        link: "text-black underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-body-sm",
        md: "h-11 px-6 text-body",
        lg: "h-14 px-8 text-h6",
        xl: "h-16 px-10 text-h5",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-lg",
        full: "rounded-full",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      rounded: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  iconOnly?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded, 
    loading = false,
    loadingText,
    iconOnly = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;
    const spinnerSize = size === "sm" ? "sm" : "md";
    
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, rounded, className }),
          iconOnly && "p-0 aspect-square"
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Spinner 
            size={spinnerSize} 
            variant={variant?.includes("gvteway") ? "gvteway" : variant?.includes("compvss") ? "compvss" : variant?.includes("atlvs") ? "atlvs" : "default"}
          />
        )}
        {!loading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {!iconOnly && (loading ? loadingText || children : children)}
        {!loading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
