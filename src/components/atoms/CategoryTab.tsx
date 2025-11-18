import * as React from "react";
import { cn } from "@/lib/utils";

interface CategoryTabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
}

export const CategoryTab = React.forwardRef<HTMLButtonElement, CategoryTabProps>(
  ({ className, active, icon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "font-bebas text-h6 px-6 py-3 border-b-2 transition-all uppercase",
          active 
            ? "border-black text-black" 
            : "border-transparent text-gray-500 hover:text-black hover:border-gray-300",
          className
        )}
        {...props}
      >
        {icon && <span className="inline-flex mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);

CategoryTab.displayName = "CategoryTab";
