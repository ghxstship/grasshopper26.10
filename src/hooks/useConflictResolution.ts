import { useState, useCallback, useEffect } from 'react';
import { ConflictInfo, ResolvedData, ConflictDetector, ConflictResolver, VectorClockManager, VersionedData, conflictResolutionManager,  } from '@/lib/realtime/conflict-resolution';

export interface UseConflictResolutionOptions<T> {
  /**
   * Auto-resolve strategy: 'lww' | 'merge' | 'manual'
   */
  autoResolve?: 'lww' | 'merge' | 'manual';
  
  /**
   * Callback when conflict is detected
   */
  onConflict?: (conflict: ConflictInfo<T>) => void;
  
  /**
   * Callback when conflict is resolved
   */
  onResolved?: (resolved: ResolvedData<T>) => void;
  
  /**
   * Current user ID for conflict resolution
   */
  userId: string;
}

export function useConflictResolution<T extends Record<string, any>>(
  options: UseConflictResolutionOptions<T>
) {
  const { autoResolve = 'merge', onConflict, onResolved, userId } = options;
  
  const [conflicts, setConflicts] = useState<Map<string, ConflictInfo<T>>>(new Map());
  const [isResolving, setIsResolving] = useState(false);

  /**
   * Detect and handle conflict between local and remote data
   */
  const detectConflict = useCallback(
    (id: string, local: VersionedData<T>, remote: VersionedData<T>) => {
      const conflict = ConflictDetector.detect(local, remote);
      
      if (conflict.conflictType === 'none') {
        // No conflict, return remote data
        return remote.data;
      }
      
      // Conflict detected
      if (onConflict) {
        onConflict(conflict);
      }
      
      // Auto-resolve or store for manual resolution
      if (autoResolve === 'manual') {
        setConflicts((prev) => new Map(prev).set(id, conflict));
        conflictResolutionManager.registerConflict(id, conflict);
        return null;
      }
      
      // Auto-resolve
      let resolved: ResolvedData<T>;
      
      if (autoResolve === 'lww') {
        resolved = ConflictResolver.lastWriteWins(conflict);
      } else {
        resolved = ConflictResolver.fieldMerge(conflict);
      }
      
      if (onResolved) {
        onResolved(resolved);
      }
      
      return resolved.data;
    },
    [autoResolve, onConflict, onResolved]
  );

  /**
   * Manually resolve a conflict
   */
  const resolveConflict = useCallback(
    async (id: string, resolution: 'local' | 'remote' | T) => {
      setIsResolving(true);
      
      try {
        const conflict = conflicts.get(id);
        if (!conflict) {
          throw new Error(`Conflict not found: ${id}`);
        }
        
        let resolvedData: ResolvedData<T>;
        
        if (resolution === 'local') {
          resolvedData = {
            data: conflict.local.data,
            resolution: 'local',
            conflicts: conflict.conflictingFields || [],
          };
        } else if (resolution === 'remote') {
          resolvedData = {
            data: conflict.remote.data,
            resolution: 'remote',
            conflicts: conflict.conflictingFields || [],
          };
        } else {
          resolvedData = {
            data: resolution,
            resolution: 'manual',
            conflicts: [],
          };
        }
        
        // Remove from pending conflicts
        setConflicts((prev) => {
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
        
        conflictResolutionManager.resolveManually(id, resolution);
        
        if (onResolved) {
          onResolved(resolvedData);
        }
        
        return resolvedData;
      } finally {
        setIsResolving(false);
      }
    },
    [conflicts, onResolved]
  );

  /**
   * Dismiss a conflict (keep local version)
   */
  const dismissConflict = useCallback(
    (id: string) => {
      const conflict = conflicts.get(id);
      if (conflict) {
        resolveConflict(id, 'local');
      }
    },
    [conflicts, resolveConflict]
  );

  /**
   * Accept remote version
   */
  const acceptRemote = useCallback(
    (id: string) => {
      const conflict = conflicts.get(id);
      if (conflict) {
        resolveConflict(id, 'remote');
      }
    },
    [conflicts, resolveConflict]
  );

  /**
   * Create versioned data from plain data
   */
  const createVersionedData = useCallback(
    (data: T, timestamp?: string): VersionedData<T> => {
      return {
        data,
        version: VectorClockManager.create(userId),
        timestamp: timestamp || new Date().toISOString(),
        userId,
      };
    },
    [userId]
  );

  /**
   * Update version clock
   */
  const incrementVersion = useCallback(
    (versionedData: VersionedData<T>): VersionedData<T> => {
      return {
        ...versionedData,
        version: VectorClockManager.increment(versionedData.version, userId),
        timestamp: new Date().toISOString(),
      };
    },
    [userId]
  );

  /**
   * Merge two version clocks
   */
  const mergeVersions = useCallback(
    (version1: VersionedData<T>, version2: VersionedData<T>): VersionedData<T> => {
      return {
        ...version1,
        version: VectorClockManager.merge(version1.version, version2.version),
        timestamp: new Date().toISOString(),
      };
    },
    []
  );

  /**
   * Check if two versions are concurrent
   */
  const isConcurrent = useCallback(
    (version1: VersionedData<T>, version2: VersionedData<T>): boolean => {
      return VectorClockManager.isConcurrent(version1.version, version2.version);
    },
    []
  );

  /**
   * Get all pending conflicts
   */
  const getPendingConflicts = useCallback(() => {
    return Array.from(conflicts.entries()).map(([id, conflict]) => ({
      id,
      conflict,
    }));
  }, [conflicts]);

  /**
   * Clear all conflicts
   */
  const clearAllConflicts = useCallback(() => {
    setConflicts(new Map());
    conflictResolutionManager.clearAll();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllConflicts();
    };
  }, [clearAllConflicts]);

  return {
    // State
    conflicts,
    pendingConflicts: getPendingConflicts(),
    hasConflicts: conflicts.size > 0,
    isResolving,
    
    // Actions
    detectConflict,
    resolveConflict,
    dismissConflict,
    acceptRemote,
    clearAllConflicts,
    
    // Utilities
    createVersionedData,
    incrementVersion,
    mergeVersions,
    isConcurrent,
  };
}

/**
 * Hook for realtime data with automatic conflict resolution
 */
export function useRealtimeData<T extends Record<string, any>>(
  id: string,
  initialData: T,
  options: UseConflictResolutionOptions<T>
) {
  const [data, setData] = useState<VersionedData<T>>(() => ({
    data: initialData,
    version: VectorClockManager.create(options.userId),
    timestamp: new Date().toISOString(),
    userId: options.userId,
  }));

  const conflictResolution = useConflictResolution<T>(options);

  /**
   * Update local data
   */
  const updateData = useCallback(
    (updates: Partial<T>) => {
      setData((prev) => {
        const updated = {
          ...prev,
          data: { ...prev.data, ...updates },
          version: VectorClockManager.increment(prev.version, options.userId),
          timestamp: new Date().toISOString(),
        };
        return updated;
      });
    },
    [options.userId]
  );

  /**
   * Handle remote update
   */
  const handleRemoteUpdate = useCallback(
    (remoteData: VersionedData<T>) => {
      const resolved = conflictResolution.detectConflict(id, data, remoteData);
      
      if (resolved) {
        setData({
          ...remoteData,
          data: resolved,
        });
      }
    },
    [id, data, conflictResolution]
  );

  return {
    data: data.data,
    versionedData: data,
    updateData,
    handleRemoteUpdate,
    ...conflictResolution,
  };
}
