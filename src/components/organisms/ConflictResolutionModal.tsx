'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/organisms/Modal';
import { Button } from '@/components/atoms/Button';
import type { ConflictInfo, ResolvedData } from '@/lib/realtime/conflict-resolution';

interface ConflictResolutionModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  conflict: ConflictInfo<T>;
  onResolve: (resolution: ResolvedData<T>) => void;
  entityName?: string;
}

export function ConflictResolutionModal<T extends Record<string, any>>({
  isOpen,
  onClose,
  conflict,
  onResolve,
  entityName = 'item',
}: ConflictResolutionModalProps<T>) {
  const [selectedVersion, setSelectedVersion] = useState<'local' | 'remote' | 'custom'>('local');
  const [customData, setCustomData] = useState<T>(conflict.local.data);

  const handleResolve = () => {
    let resolvedData: ResolvedData<T>;

    if (selectedVersion === 'local') {
      resolvedData = {
        data: conflict.local.data,
        resolution: 'local',
        conflicts: conflict.conflictingFields || [],
      };
    } else if (selectedVersion === 'remote') {
      resolvedData = {
        data: conflict.remote.data,
        resolution: 'remote',
        conflicts: conflict.conflictingFields || [],
      };
    } else {
      resolvedData = {
        data: customData,
        resolution: 'manual',
        conflicts: [],
      };
    }

    onResolve(resolvedData);
    onClose();
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderFieldComparison = (field: string) => {
    const localValue = conflict.local.data[field];
    const remoteValue = conflict.remote.data[field];

    return (
      <div key={field} className="border-b border-gray-200 py-3">
        <div className="font-medium text-sm text-gray-700 mb-2">{field}</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-xs text-blue-600 mb-1">Your Version</div>
            <div className="text-sm text-gray-900">
              {typeof localValue === 'object' 
                ? JSON.stringify(localValue, null, 2)
                : String(localValue)}
            </div>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <div className="text-xs text-orange-600 mb-1">Remote Version</div>
            <div className="text-sm text-gray-900">
              {typeof remoteValue === 'object'
                ? JSON.stringify(remoteValue, null, 2)
                : String(remoteValue)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Resolve Conflict: ${entityName}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Conflict Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Concurrent Modifications Detected
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                This {entityName} was modified by multiple users at the same time.
                Please choose which version to keep or create a custom resolution.
              </p>
            </div>
          </div>
        </div>

        {/* Version Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Choose Resolution
          </label>

          {/* Local Version */}
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              selectedVersion === 'local'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedVersion('local')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Keep Your Version</div>
                <div className="text-sm text-gray-500">
                  Modified by you at {formatDate(conflict.local.timestamp)}
                </div>
              </div>
              <input
                type="radio"
                checked={selectedVersion === 'local'}
                onChange={() => setSelectedVersion('local')}
                className="h-4 w-4 text-blue-600"
              />
            </div>
          </div>

          {/* Remote Version */}
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              selectedVersion === 'remote'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedVersion('remote')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Keep Remote Version</div>
                <div className="text-sm text-gray-500">
                  Modified by {conflict.remote.userId} at {formatDate(conflict.remote.timestamp)}
                </div>
              </div>
              <input
                type="radio"
                checked={selectedVersion === 'remote'}
                onChange={() => setSelectedVersion('remote')}
                className="h-4 w-4 text-orange-600"
              />
            </div>
          </div>

          {/* Custom Resolution */}
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              selectedVersion === 'custom'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedVersion('custom')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Custom Resolution</div>
                <div className="text-sm text-gray-500">
                  Manually merge the changes
                </div>
              </div>
              <input
                type="radio"
                checked={selectedVersion === 'custom'}
                onChange={() => setSelectedVersion('custom')}
                className="h-4 w-4 text-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Conflicting Fields */}
        {conflict.conflictingFields && conflict.conflictingFields.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Conflicting Fields ({conflict.conflictingFields.length})
            </h4>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              {conflict.conflictingFields.map(renderFieldComparison)}
            </div>
          </div>
        )}

        {/* Custom Editor */}
        {selectedVersion === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Data (JSON)
            </label>
            <textarea
              value={JSON.stringify(customData, null, 2)}
              onChange={(e) => {
                try {
                  setCustomData(JSON.parse(e.target.value));
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleResolve}
          >
            Resolve Conflict
          </Button>
        </div>
      </div>
    </Modal>
  );
}
