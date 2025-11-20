import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "border-grey-300 checked:bg-grey-900 checked:border-grey-900 focus:ring-grey-500",
      gvteway: "border-gvteway-red-500 checked:bg-gvteway-red-500 checked:border-gvteway-red-500 focus:ring-gvteway-red-500",
      compvss: "border-compvss-cyan-500 checked:bg-compvss-cyan-500 checked:border-compvss-cyan-500 focus:ring-compvss-cyan-500",
      atlvs: "border-atlvs-green-500 checked:bg-atlvs-green-500 checked:border-atlvs-green-500 focus:ring-atlvs-green-500",
    };

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className={cn(
            "peer h-5 w-5 shrink-0 appearance-none rounded border-2 transition-all cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            variantStyles[variant],
            className
          )}
          ref={ref}
          {...props}
        />
        <Check className="absolute start-0.5 top-0.5 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
