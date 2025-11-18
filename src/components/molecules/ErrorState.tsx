'use client';

import * as React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms/Button';

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
  default: 'text-red-500',
  gvteway: 'text-purple-500',
  compvss: 'text-blue-500',
  atlvs: 'text-green-500',
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

      <h2 className="text-2xl font-bebas text-white uppercase tracking-wide mb-2">
        {title}
      </h2>

      <p className="text-gray-400 font-oswald max-w-md mb-6">{message}</p>

      {errorMessage && showDetails && (
        <div className="mb-6 w-full max-w-2xl">
          <button
            onClick={() => setShowErrorDetails(!showErrorDetails)}
            className="text-sm text-gray-500 hover:text-gray-400 font-oswald mb-2"
          >
            {showErrorDetails ? 'Hide' : 'Show'} error details
          </button>

          {showErrorDetails && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-left">
              <p className="text-sm text-red-400 font-mono mb-2">
                {errorMessage}
              </p>
              {errorStack && (
                <pre className="text-xs text-gray-500 font-mono overflow-x-auto">
                  {errorStack}
                </pre>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        {onRetry && (
          <Button variant={variant} onClick={onRetry}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        {onGoHome && (
          <Button variant="ghost" onClick={onGoHome}>
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        )}
      </div>
    </div>
  );
};
