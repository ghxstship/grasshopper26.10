import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "border-grey-300 checked:border-grey-900 focus:ring-grey-500",
      gvteway: "border-gvteway-red-500 checked:border-gvteway-red-500 focus:ring-gvteway-red-500",
      compvss: "border-compvss-cyan-500 checked:border-compvss-cyan-500 focus:ring-compvss-cyan-500",
      atlvs: "border-atlvs-green-500 checked:border-atlvs-green-500 focus:ring-atlvs-green-500",
    };

    const dotStyles = {
      default: "peer-checked:bg-grey-900",
      gvteway: "peer-checked:bg-gvteway-red-500",
      compvss: "peer-checked:bg-compvss-cyan-500",
      atlvs: "peer-checked:bg-atlvs-green-500",
    };

    return (
      <div className="relative inline-flex items-center">
        <input
          type="radio"
          className={cn(
            "peer h-5 w-5 shrink-0 appearance-none rounded-full border-2 transition-all cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            variantStyles[variant],
            className
          )}
          ref={ref}
          {...props}
        />
        <div className={cn(
          "absolute start-1.5 top-1.5 h-2 w-2 rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity",
          dotStyles[variant]
        )} />
      </div>
    );
  }
);
Radio.displayName = "Radio";

export { Radio };
