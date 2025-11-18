/**
 * Conflict Resolution System for Realtime Collaboration
 * Implements Last-Write-Wins (LWW) with vector clocks for conflict detection
 * and Operational Transformation (OT) for text fields
 */

export interface VectorClock {
  [userId: string]: number;
}

export interface VersionedData<T> {
  data: T;
  version: VectorClock;
  timestamp: string;
  userId: string;
}

export interface ConflictInfo<T> {
  local: VersionedData<T>;
  remote: VersionedData<T>;
  conflictType: 'concurrent' | 'divergent' | 'none';
  conflictingFields?: string[];
}

export interface ResolvedData<T> {
  data: T;
  resolution: 'local' | 'remote' | 'merged' | 'manual';
  conflicts: string[];
}

/**
 * Vector Clock Manager for tracking causality
 */
export class VectorClockManager {
  /**
   * Create a new vector clock
   */
  static create(userId: string): VectorClock {
    return { [userId]: 1 };
  }

  /**
   * Increment vector clock for user
   */
  static increment(clock: VectorClock, userId: string): VectorClock {
    return {
      ...clock,
      [userId]: (clock[userId] || 0) + 1,
    };
  }

  /**
   * Merge two vector clocks (take maximum of each entry)
   */
  static merge(clock1: VectorClock, clock2: VectorClock): VectorClock {
    const merged: VectorClock = { ...clock1 };
    
    for (const userId in clock2) {
      merged[userId] = Math.max(merged[userId] || 0, clock2[userId]);
    }
    
    return merged;
  }

  /**
   * Compare two vector clocks
   * Returns: 'before' | 'after' | 'concurrent'
   */
  static compare(clock1: VectorClock, clock2: VectorClock): 'before' | 'after' | 'concurrent' {
    let hasLess = false;
    let hasGreater = false;

    const allUserIds = new Set([...Object.keys(clock1), ...Object.keys(clock2)]);

    for (const userId of allUserIds) {
      const v1 = clock1[userId] || 0;
      const v2 = clock2[userId] || 0;

      if (v1 < v2) hasLess = true;
      if (v1 > v2) hasGreater = true;
    }

    if (hasLess && !hasGreater) return 'before';
    if (hasGreater && !hasLess) return 'after';
    return 'concurrent';
  }

  /**
   * Check if clock1 happened before clock2
   */
  static happensBefore(clock1: VectorClock, clock2: VectorClock): boolean {
    return this.compare(clock1, clock2) === 'before';
  }

  /**
   * Check if clocks are concurrent (conflicting)
   */
  static isConcurrent(clock1: VectorClock, clock2: VectorClock): boolean {
    return this.compare(clock1, clock2) === 'concurrent';
  }
}

/**
 * Conflict Detector
 */
export class ConflictDetector {
  /**
   * Detect conflicts between local and remote data
   */
  static detect<T extends Record<string, any>>(
    local: VersionedData<T>,
    remote: VersionedData<T>
  ): ConflictInfo<T> {
    const comparison = VectorClockManager.compare(local.version, remote.version);

    if (comparison === 'before') {
      // Local is older, no conflict
      return {
        local,
        remote,
        conflictType: 'none',
      };
    }

    if (comparison === 'after') {
      // Remote is older, no conflict
      return {
        local,
        remote,
        conflictType: 'none',
      };
    }

    // Concurrent modifications - check for field-level conflicts
    const conflictingFields = this.findConflictingFields(local.data, remote.data);

    return {
      local,
      remote,
      conflictType: conflictingFields.length > 0 ? 'concurrent' : 'none',
      conflictingFields,
    };
  }

  /**
   * Find fields that differ between two objects
   */
  private static findConflictingFields<T extends Record<string, any>>(
    obj1: T,
    obj2: T
  ): string[] {
    const conflicts: string[] = [];
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    for (const key of allKeys) {
      if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        conflicts.push(key);
      }
    }

    return conflicts;
  }
}

/**
 * Conflict Resolution Strategies
 */
export class ConflictResolver {
  /**
   * Last-Write-Wins (LWW) resolution
   */
  static lastWriteWins<T>(conflict: ConflictInfo<T>): ResolvedData<T> {
    const localTime = new Date(conflict.local.timestamp).getTime();
    const remoteTime = new Date(conflict.remote.timestamp).getTime();

    if (localTime >= remoteTime) {
      return {
        data: conflict.local.data,
        resolution: 'local',
        conflicts: conflict.conflictingFields || [],
      };
    } else {
      return {
        data: conflict.remote.data,
        resolution: 'remote',
        conflicts: conflict.conflictingFields || [],
      };
    }
  }

  /**
   * Field-level merge (prefer non-null values)
   */
  static fieldMerge<T extends Record<string, any>>(conflict: ConflictInfo<T>): ResolvedData<T> {
    const merged: any = { ...conflict.local.data };
    const conflicts: string[] = [];

    for (const field of conflict.conflictingFields || []) {
      const localValue = conflict.local.data[field];
      const remoteValue = conflict.remote.data[field];

      // Prefer non-null/non-undefined values
      if (localValue == null && remoteValue != null) {
        merged[field] = remoteValue;
      } else if (remoteValue == null && localValue != null) {
        merged[field] = localValue;
      } else if (localValue !== remoteValue) {
        // Both have values - use LWW for this field
        const localTime = new Date(conflict.local.timestamp).getTime();
        const remoteTime = new Date(conflict.remote.timestamp).getTime();
        merged[field] = remoteTime > localTime ? remoteValue : localValue;
        conflicts.push(field);
      }
    }

    return {
      data: merged as T,
      resolution: 'merged',
      conflicts,
    };
  }

  /**
   * User-specific priority (prefer specific user's changes)
   */
  static userPriority<T>(
    conflict: ConflictInfo<T>,
    priorityUserId: string
  ): ResolvedData<T> {
    if (conflict.local.userId === priorityUserId) {
      return {
        data: conflict.local.data,
        resolution: 'local',
        conflicts: conflict.conflictingFields || [],
      };
    } else {
      return {
        data: conflict.remote.data,
        resolution: 'remote',
        conflicts: conflict.conflictingFields || [],
      };
    }
  }

  /**
   * Automatic resolution based on conflict type
   */
  static auto<T extends Record<string, any>>(conflict: ConflictInfo<T>): ResolvedData<T> {
    if (conflict.conflictType === 'none') {
      // No conflict - use newer version
      return this.lastWriteWins(conflict);
    }

    // Try field-level merge first
    const merged = this.fieldMerge(conflict);
    
    // If too many conflicts, fall back to LWW
    if (merged.conflicts.length > 5) {
      return this.lastWriteWins(conflict);
    }

    return merged;
  }
}

/**
 * Operational Transformation for text fields
 */
export class TextOT {
  /**
   * Transform operation against another operation
   */
  static transform(op1: TextOperation, op2: TextOperation): TextOperation {
    // Simple character-based OT
    if (op1.type === 'insert' && op2.type === 'insert') {
      if (op1.position <= op2.position) {
        return { ...op2, position: op2.position + op1.text.length };
      }
      return op2;
    }

    if (op1.type === 'delete' && op2.type === 'insert') {
      if (op1.position < op2.position) {
        return { ...op2, position: op2.position - op1.length };
      }
      return op2;
    }

    if (op1.type === 'insert' && op2.type === 'delete') {
      if (op1.position <= op2.position) {
        return { ...op2, position: op2.position + op1.text.length };
      }
      return op2;
    }

    if (op1.type === 'delete' && op2.type === 'delete') {
      if (op1.position < op2.position) {
        return { ...op2, position: op2.position - op1.length };
      }
      return op2;
    }

    return op2;
  }

  /**
   * Apply operation to text
   */
  static apply(text: string, op: TextOperation): string {
    if (op.type === 'insert') {
      return text.slice(0, op.position) + op.text + text.slice(op.position);
    }

    if (op.type === 'delete') {
      return text.slice(0, op.position) + text.slice(op.position + op.length);
    }

    return text;
  }
}

export interface TextOperation {
  type: 'insert' | 'delete';
  position: number;
  text?: string;
  length?: number;
  userId: string;
  timestamp: string;
}

/**
 * Conflict Resolution Manager
 */
export class ConflictResolutionManager {
  private pendingConflicts: Map<string, ConflictInfo<any>> = new Map();
  private resolutionCallbacks: Map<string, (resolved: ResolvedData<any>) => void> = new Map();

  /**
   * Register a conflict for manual resolution
   */
  registerConflict<T>(id: string, conflict: ConflictInfo<T>): void {
    this.pendingConflicts.set(id, conflict);
  }

  /**
   * Resolve a conflict manually
   */
  resolveManually<T>(id: string, resolution: 'local' | 'remote' | T): void {
    const conflict = this.pendingConflicts.get(id);
    if (!conflict) return;

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

    const callback = this.resolutionCallbacks.get(id);
    if (callback) {
      callback(resolvedData);
    }

    this.pendingConflicts.delete(id);
    this.resolutionCallbacks.delete(id);
  }

  /**
   * Set callback for when conflict is resolved
   */
  onResolved<T>(id: string, callback: (resolved: ResolvedData<T>) => void): void {
    this.resolutionCallbacks.set(id, callback);
  }

  /**
   * Get all pending conflicts
   */
  getPendingConflicts(): Map<string, ConflictInfo<any>> {
    return this.pendingConflicts;
  }

  /**
   * Clear all conflicts
   */
  clearAll(): void {
    this.pendingConflicts.clear();
    this.resolutionCallbacks.clear();
  }
}

// Singleton instance
export const conflictResolutionManager = new ConflictResolutionManager();
