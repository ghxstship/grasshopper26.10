import * as React from "react";
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { IconButton } from "@/components/atoms/IconButton";

const alertVariants = cva(
  "relative w-full rounded-lg border-2 p-4 font-share-tech",
  {
    variants: {
      variant: {
        default: "bg-gray-50 border-gray-200 text-gray-900",
        info: "bg-info-light border-info-border text-info-foreground",
        success: "bg-success-light border-success-border text-success-foreground",
        warning: "bg-warning-light border-warning-border text-warning-foreground",
        error: "bg-error-light border-error-border text-error-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconMap = {
  default: Info,
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  onClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", title, onClose, children, ...props }, ref) => {
    const Icon = iconMap[variant || "default"];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <div className="flex gap-3">
          <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            {title && (
              <h5 className="mb-1 font-medium leading-none tracking-tight">
                {title}
              </h5>
            )}
            <div className="text-sm [&_p]:leading-relaxed">{children}</div>
          </div>
          {onClose && (
            <IconButton
              onClick={onClose}
              variant="ghost"
              size="sm"
              icon={<X className="h-4 w-4" />}
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            />
          )}
        </div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { Alert, alertVariants };
