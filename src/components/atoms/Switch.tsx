import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "peer-checked:bg-grey-900 peer-focus:ring-grey-500",
      gvteway: "peer-checked:bg-gvteway-red-500 peer-focus:ring-gvteway-red-500",
      compvss: "peer-checked:bg-compvss-cyan-500 peer-focus:ring-compvss-cyan-500",
      atlvs: "peer-checked:bg-atlvs-green-500 peer-focus:ring-atlvs-green-500",
    };

    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          {...props}
        />
        <div className={cn(
          "w-11 h-6 bg-grey-300 rounded-full peer transition-colors",
          "peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          variantStyles[variant],
          className
        )}>
          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5" />
        </div>
      </label>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
