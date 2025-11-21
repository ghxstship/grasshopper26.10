/**
 * FormField Component - Molecular Design System
 * Complete form field with label, input, and validation
 */

import * as React from 'react';
import { Input, type InputProps } from '../atoms/Input';
import { cn } from '@/lib/utils';

export interface FormFieldProps extends InputProps {
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, required, error, helperText, className, id, ...props }, ref) => {
    const fieldId = id || `field-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={cn('w-full space-y-2', className)}>
        {label && (
          <label
            htmlFor={fieldId}
            className="block font-bebas text-lg tracking-wide text-black"
          >
            {label}
            {required && <span className="ml-1 text-gray-900">*</span>}
          </label>
        )}
        <Input
          ref={ref}
          id={fieldId}
          error={error}
          helperText={helperText}
          aria-required={required}
          aria-invalid={error}
          {...props}
        />
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export { FormField };
