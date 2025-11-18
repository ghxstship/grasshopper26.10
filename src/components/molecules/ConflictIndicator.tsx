'use client';

import React from 'react';

interface ConflictIndicatorProps {
  hasConflict: boolean;
  conflictCount?: number;
  onClick?: () => void;
  className?: string;
}

export function ConflictIndicator({
  hasConflict,
  conflictCount = 1,
  onClick,
  className = '',
}: ConflictIndicatorProps) {
  if (!hasConflict) return null;

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors ${className}`}
      title="Click to resolve conflicts"
    >
      <svg
        className="w-4 h-4 mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {conflictCount > 1 ? `${conflictCount} Conflicts` : 'Conflict'}
    </button>
  );
}

interface FieldConflictIndicatorProps {
  fieldName: string;
  localValue: any;
  remoteValue: any;
  onResolve?: (value: any) => void;
}

export function FieldConflictIndicator({
  fieldName,
  localValue,
  remoteValue,
  onResolve,
}: FieldConflictIndicatorProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className="relative">
      <div
        className="absolute -left-6 top-0 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
        title="Field has conflicting values"
      >
        <svg
          className="w-5 h-5 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {showDetails && (
        <div className="absolute z-10 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="text-sm font-medium text-gray-900 mb-2">
            Conflict in &ldquo;{fieldName}&rdquo;
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="bg-blue-50 p-2 rounded">
              <div className="text-xs text-blue-600 mb-1">Your Value</div>
              <div className="text-sm text-gray-900 break-all">
                {typeof localValue === 'object'
                  ? JSON.stringify(localValue)
                  : String(localValue)}
              </div>
            </div>
            
            <div className="bg-orange-50 p-2 rounded">
              <div className="text-xs text-orange-600 mb-1">Remote Value</div>
              <div className="text-sm text-gray-900 break-all">
                {typeof remoteValue === 'object'
                  ? JSON.stringify(remoteValue)
                  : String(remoteValue)}
              </div>
            </div>
          </div>

          {onResolve && (
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  onResolve(localValue);
                  setShowDetails(false);
                }}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
              >
                Keep Mine
              </button>
              <button
                onClick={() => {
                  onResolve(remoteValue);
                  setShowDetails(false);
                }}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-100 rounded hover:bg-orange-200"
              >
                Keep Theirs
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
