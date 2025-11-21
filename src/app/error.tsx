'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { H2, Body } from '@/components/ui-rebuild/atoms/Typography';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="max-w-md w-full px-6 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">⚠️</div>
          <H2 className="mb-4">Something went wrong</H2>
          <Body className="text-gray-400 mb-6">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </Body>
          {error.digest && (
            <Body className="text-gray-500 text-sm mb-6">
              Error ID: {error.digest}
            </Body>
          )}
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="primary">
            Try again
          </Button>
          <Button onClick={() => (window.location.href = '/')} variant="secondary">
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
