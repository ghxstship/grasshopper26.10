'use client';

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/atoms/IconButton";

export interface ActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: "left" | "right";
  size?: "sm" | "md" | "lg" | "full";
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
  className?: string;
}

const ActionDrawer: React.FC<ActionDrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  side = "right",
  size = "md",
  variant = "default",
  className,
}) => {
  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    full: "max-w-full",
  };

  const variantStyles = {
    default: "border-gray-200",
    gvteway: "border-gvteway-red-200",
    compvss: "border-compvss-cyan-200",
    atlvs: "border-atlvs-green-200",
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex w-full flex-col bg-white shadow-xl",
          side === "right" ? "right-0" : "left-0",
          sizeStyles[size],
          variantStyles[variant],
          side === "right" ? "border-l-2" : "border-r-2",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 p-6">
          <div className="flex-1">
            <h2 className="text-h5 font-bebas text-gray-900">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-body-sm text-gray-600 font-share-tech">
                {description}
              </p>
            )}
          </div>
          <IconButton
            icon={<X className="h-5 w-5" />}
            variant="ghost"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-200 p-6">
            {footer}
          </div>
        )}
      </div>
    </>
  );
};

ActionDrawer.displayName = "ActionDrawer";

export { ActionDrawer };
