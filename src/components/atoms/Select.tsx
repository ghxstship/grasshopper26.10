import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variantStyles = {
      default: "focus:ring-grey-500 focus:border-grey-500",
      gvteway: "focus:ring-gvteway-red-500 focus:border-gvteway-red-500",
      compvss: "focus:ring-compvss-cyan-500 focus:border-compvss-cyan-500",
      atlvs: "focus:ring-atlvs-green-500 focus:border-atlvs-green-500",
    };

    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-11 w-full appearance-none rounded-lg border-2 border-grey-300 bg-white px-4 py-2 pr-10 font-share-tech text-body transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "dark:bg-grey-900 dark:border-grey-700 dark:text-white",
            variantStyles[variant],
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-grey-500 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
