import * as React from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  side = "top",
  className,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const sideStyles = {
    top: "bottom-full start-1/2 -translate-x-1/2 mb-2",
    right: "start-full top-1/2 -translate-y-1/2 ms-2",
    bottom: "top-full start-1/2 -translate-x-1/2 mt-2",
    left: "end-full top-1/2 -translate-y-1/2 me-2",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-3 py-2 text-body-sm font-share-tech text-white bg-grey-900 rounded-lg shadow-lg whitespace-nowrap pointer-events-none",
            sideStyles[side],
            className
          )}
        >
          {content}
          <div
            className={cn(
              "absolute w-2 h-2 bg-grey-900 transform rotate-45",
              side === "top" && "bottom-[-4px] start-1/2 -translate-x-1/2",
              side === "right" && "start-[-4px] top-1/2 -translate-y-1/2",
              side === "bottom" && "top-[-4px] start-1/2 -translate-x-1/2",
              side === "left" && "end-[-4px] top-1/2 -translate-y-1/2"
            )}
          />
        </div>
      )}
    </div>
  );
};

Tooltip.displayName = "Tooltip";

export { Tooltip };
