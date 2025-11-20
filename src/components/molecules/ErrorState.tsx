'use client';

import * as React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms/Button';
import { BodyTextSmall, Caption } from '@/components/atoms/Typography';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | string;
  onRetry?: () => void;
  onGoHome?: () => void;
  variant?: 'default' | 'gvteway' | 'compvss' | 'atlvs';
  showDetails?: boolean;
  className?: string;
}

const variantClasses = {
  default: 'text-destructive',
  gvteway: 'text-gvteway-red',
  compvss: 'text-compvss-cyan',
  atlvs: 'text-atlvs-green',
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  error,
  onRetry,
  onGoHome,
  variant = 'default',
  showDetails = false,
  className,
}) => {
  const [showErrorDetails, setShowErrorDetails] = React.useState(false);

  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[400px] p-8 text-center',
        className
      )}
    >
      <div className={cn('mb-6', variantClasses[variant])}>
        <AlertCircle className="w-16 h-16" />
      </div>

      <h2 className="text-white uppercase mb-2">
        {title}
      </h2>

      <p className="text-grey-400 max-w-md mb-6">{message}</p>

      {errorMessage && showDetails && (
        <div className="mb-6 w-full max-w-2xl">
          <button
            onClick={() => setShowErrorDetails(!showErrorDetails)}
            className="text-grey-500 hover:text-grey-400 mb-2"
          >
            {showErrorDetails ? 'Hide' : 'Show'} error details
          </button>

          {showErrorDetails && (
            <div className="bg-grey-900 border border-grey-800 rounded-lg p-4 text-left">
              <BodyTextSmall className="text-destructive font-mono mb-2">
                {errorMessage}
              </BodyTextSmall>
              {errorStack && (
                <Caption className="text-grey-500 font-mono overflow-x-auto block whitespace-pre">
                  {errorStack}
                </Caption>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        {onRetry && (
          <Button variant={variant} onClick={onRetry}>
            <RefreshCw className="w-4 h-4 me-2" />
            Try Again
          </Button>
        )}
        {onGoHome && (
          <Button variant="ghost" onClick={onGoHome}>
            <Home className="w-4 h-4 me-2" />
            Go Home
          </Button>
        )}
      </div>
    </div>
  );
};
