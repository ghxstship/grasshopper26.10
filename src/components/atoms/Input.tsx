import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
  brutalist?: boolean;  // Enable neobrutalist styling
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", brutalist = true, ...props }, ref) => {
    const variantStyles = {
      default: "focus:ring-black focus:border-black",
      gvteway: "focus:ring-black focus:border-black",
      compvss: "focus:ring-black focus:border-black",
      atlvs: "focus:ring-black focus:border-black",
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full bg-white px-4 py-2 font-share-tech text-body transition-colors",
          // Brutalist: sharp edges, bold borders
          brutalist ? "rounded-none border-3 border-black" : "rounded-lg border-2 border-grey-300",
          "placeholder:text-grey-400",
          brutalist ? "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1" : "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-grey-100",
          "dark:bg-grey-900 dark:border-white dark:text-white",
          variantStyles[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
