import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
  brutalist?: boolean;  // Enable neobrutalist styling
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant = "default", brutalist = true, children, ...props }, ref) => {
    const variantStyles = {
      default: "focus:ring-black focus:border-black",
      gvteway: "focus:ring-black focus:border-black",
      compvss: "focus:ring-black focus:border-black",
      atlvs: "focus:ring-black focus:border-black",
    };

    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-11 w-full appearance-none bg-white px-4 py-2 pe-10 font-share-tech text-body transition-colors",
            // Brutalist: sharp edges, bold borders
            brutalist ? "rounded-none border-3 border-black" : "rounded-lg border-2 border-grey-300",
            brutalist ? "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1" : "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-grey-100",
            "dark:bg-grey-900 dark:border-white dark:text-white",
            variantStyles[variant],
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black pointer-events-none dark:text-white" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
