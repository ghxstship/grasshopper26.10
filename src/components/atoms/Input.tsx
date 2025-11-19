import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "focus:ring-grey-500 focus:border-grey-500",
      gvteway: "focus:ring-gvteway-red-500 focus:border-gvteway-red-500",
      compvss: "focus:ring-compvss-cyan-500 focus:border-compvss-cyan-500",
      atlvs: "focus:ring-atlvs-green-500 focus:border-atlvs-green-500",
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border-2 border-grey-300 bg-white px-4 py-2 font-share-tech text-body transition-colors",
          "placeholder:text-grey-400",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-grey-900 dark:border-grey-700 dark:text-white",
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
