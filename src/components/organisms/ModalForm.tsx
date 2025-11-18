'use client';

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/atoms/IconButton";
import { Button } from "@/components/atoms/Button";

export interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
  className?: string;
}

const ModalForm: React.FC<ModalFormProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  isLoading = false,
  size = "md",
  variant = "default",
  className,
}) => {
  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
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

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full bg-white rounded-2xl shadow-2xl",
            sizeStyles[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-200 p-6">
            <div className="flex-1">
              <h2 className="text-xl font-bebas tracking-wide text-gray-900">
                {title}
              </h2>
              {description && (
                <p className="mt-1 text-sm text-gray-600 font-share-tech">
                  {description}
                </p>
              )}
            </div>
            <IconButton
              icon={<X className="h-5 w-5" />}
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
            />
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {onSubmit && (
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
              <Button
                variant={variant}
                onClick={onSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : submitLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

ModalForm.displayName = "ModalForm";

export { ModalForm };
