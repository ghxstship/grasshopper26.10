import * as React from "react";
import { Label } from "@/components/atoms/Label";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  hint,
  required,
  children,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label required={required}>{label}</Label>}
      {children}
      {hint && !error && (
        <p className="text-body-sm text-grey-500 -tech">{hint}</p>
      )}
      {error && (
        <p className="text-body-sm text-error -tech">{error}</p>
      )}
    </div>
  );
};

FormField.displayName = "FormField";

export { FormField };
