'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/atoms/Spinner";

export interface LoadingStateProps {
  message?: string;
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  overlay?: boolean;
  className?: string;
}

const variantClasses = {
  default: "text-gray-400",
  gvteway: "text-purple-500",
  compvss: "text-blue-500",
  atlvs: "text-green-500",
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  variant = "default",
  size = "md",
  fullScreen = false,
  overlay = false,
  className,
}) => {

  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center",
      fullScreen ? "min-h-screen" : "min-h-[400px] p-8",
      className
    )}>
      <Spinner size={size} variant={variant} />
      {message && (
        <p className={cn(
          "mt-4 text-sm font-oswald",
          variantClasses[variant]
        )}>
          {message}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

