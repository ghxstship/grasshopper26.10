'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";

const toastVariants = cva(
  "pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-lg border p-4 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200 text-gray-900",
        success: "bg-success-light border-success-border text-success-foreground",
        error: "bg-error-light border-error-border text-error-foreground",
        warning: "bg-warning-light border-warning-border text-warning-foreground",
        info: "bg-info-light border-info-border text-info-foreground",
        gvteway: "bg-gradient-to-r from-gvteway-red-50 to-gvteway-yellow-50 border-gvteway-red-200 text-gray-900",
        compvss: "bg-gradient-to-r from-compvss-cyan-50 to-compvss-teal-50 border-compvss-cyan-200 text-gray-900",
        atlvs: "bg-gradient-to-r from-atlvs-green-50 to-atlvs-orange-50 border-atlvs-green-200 text-gray-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconVariants = cva("h-5 w-5 flex-shrink-0", {
  variants: {
    variant: {
      default: "text-gray-500",
      success: "text-success",
      error: "text-error",
      warning: "text-warning",
      info: "text-info",
      gvteway: "text-gvteway-red-600",
      compvss: "text-compvss-cyan-600",
      atlvs: "text-atlvs-green-600",
    },
  },
});

export interface ToastProps extends VariantProps<typeof toastVariants> {
  title: string;
  description?: string;
  onClose?: () => void;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  className?: string;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ 
    title, 
    description, 
    onClose, 
    icon, 
    action,
    duration = 5000,
    variant = "default", 
    className,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
      if (duration && duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            onClose?.();
          }, 300); // Wait for exit animation
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);

    const getDefaultIcon = () => {
      switch (variant) {
        case "success":
          return <CheckCircle className={cn(iconVariants({ variant }))} />;
        case "error":
          return <AlertCircle className={cn(iconVariants({ variant }))} />;
        case "warning":
          return <AlertTriangle className={cn(iconVariants({ variant }))} />;
        case "info":
          return <Info className={cn(iconVariants({ variant }))} />;
        default:
          return null;
      }
    };

    const handleClose = () => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300);
    };

    return (
      <div
        ref={ref}
        className={cn(
          toastVariants({ variant }),
          "transform transition-all duration-300",
          isVisible 
            ? "translate-x-0 opacity-100" 
            : "translate-x-full opacity-0",
          className
        )}
        {...props}
      >
        {/* Icon */}
        {icon || getDefaultIcon()}

        {/* Content */}
        <div className="flex-1 space-y-1">
          <div className="font-semibold text-body-sm">{title}</div>
          {description && (
            <div className="text-body-sm opacity-90">{description}</div>
          )}
          {action && (
            <Button
              onClick={action.onClick}
              variant="ghost"
              size="sm"
              className="mt-2 text-body-sm underline hover:no-underline"
            >
              {action.label}
            </Button>
          )}
        </div>

        {/* Close Button */}
        {onClose && (
          <IconButton
            onClick={handleClose}
            variant="ghost"
            size="sm"
            icon={<X className="h-4 w-4" />}
            className="flex-shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors"
            aria-label="Close"
          />
        )}
      </div>
    );
  }
);

Toast.displayName = "Toast";

// Toast Container for managing multiple toasts
export interface ToastContainerProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  children: React.ReactNode;
  className?: string;
}

const positionClasses = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = "top-right",
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-2 pointer-events-none",
        positionClasses[position],
        className
      )}
    >
      {children}
    </div>
  );
};

export { Toast, toastVariants };
