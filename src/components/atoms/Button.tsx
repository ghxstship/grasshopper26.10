import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bebas text-body transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // GVTEWAY variants (Brutalist solid style)
        gvteway: "bg-black text-white border-3 border-black hover:shadow-hard-base hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-0 active:translate-y-0",
        "gvteway-outline": "border-3 border-black text-black bg-white hover:bg-black hover:text-white",
        "gvteway-ghost": "text-black hover:bg-grey-100 border-3 border-transparent hover:border-black",
        
        // COMPVSS variants (Brutalist solid style)
        compvss: "bg-black text-white border-3 border-black hover:shadow-hard-base hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-0 active:translate-y-0",
        "compvss-outline": "border-3 border-black text-black bg-white hover:bg-black hover:text-white",
        "compvss-ghost": "text-black hover:bg-grey-100 border-3 border-transparent hover:border-black",
        
        // ATLVS variants (Brutalist solid style)
        atlvs: "bg-black text-white border-3 border-black hover:shadow-hard-base hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-0 active:translate-y-0",
        "atlvs-outline": "border-3 border-black text-black bg-white hover:bg-black hover:text-white",
        "atlvs-ghost": "text-black hover:bg-grey-100 border-3 border-transparent hover:border-black",
        
        // Standard variants (BRUTALIST)
        default: "bg-white text-black border-3 border-black hover:bg-black hover:text-white",
        primary: "bg-black text-white border-3 border-black hover:shadow-hard-base hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-0 active:translate-y-0",
        secondary: "bg-grey-100 text-black border-3 border-black hover:bg-black hover:text-white",
        destructive: "bg-black text-white border-3 border-black hover:bg-grey-900",
        outline: "border-3 border-black bg-transparent hover:bg-black hover:text-white",
        ghost: "text-black hover:bg-grey-100 border-3 border-transparent hover:border-black",
        link: "text-black underline-offset-4 hover:underline border-3 border-transparent",
      },
      size: {
        sm: "h-9 px-4 text-body-sm",
        md: "h-11 px-6 text-body",
        lg: "h-14 px-8 text-h6",
        xl: "h-16 px-10 text-h5",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-none",  // Brutalist: sharp edges
        sm: "rounded-sm",
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
