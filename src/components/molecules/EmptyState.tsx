'use client';

import * as React from "react";
import { Inbox, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";

export interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
  className?: string;
}

const variantClasses = {
  default: "text-gray-600",
  gvteway: "text-purple-600",
  compvss: "text-blue-600",
  atlvs: "text-green-600",
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data",
  message = "There's nothing here yet.",
  icon,
  action,
  actionLabel,
  onAction,
  variant = "default",
  className,
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[400px] p-8 text-center",
      className
    )}>
      <div className={cn("mb-4", variantClasses[variant])}>
        {icon || <Inbox className="w-16 h-16" />}
      </div>
      <h3 className="text-2xl font-bebas text-white uppercase tracking-wide mb-2">
        {title}
      </h3>
      <p className="text-gray-400 font-oswald max-w-md mb-6">{message}</p>
      {action || (actionLabel && onAction && (
        <Button variant={variant} onClick={onAction}>
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      ))}
    </div>
  );
};
