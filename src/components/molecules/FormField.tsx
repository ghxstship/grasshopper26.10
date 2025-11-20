import * as React from "react";
import { Label } from "@/components/atoms/Label";
import { cn } from "@/lib/utils";
import { BodyTextSmall } from "@/components/atoms/Typography";

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
        <BodyTextSmall className="text-grey-500 -tech">{hint}</BodyTextSmall>
      )}
      {error && (
        <BodyTextSmall className="text-error -tech">{error}</BodyTextSmall>
      )}
    </div>
  );
};

FormField.displayName = "FormField";

export { FormField };
