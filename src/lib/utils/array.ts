/**
 * Array Utilities
 * Helper functions for array manipulation and operations
 */

/**
 * Remove duplicates from an array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Remove duplicates from an array based on a key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/**
 * Group array items by a key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const value = String(item[key]);
    if (!groups[value]) {
      groups[value] = [];
    }
    groups[value].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array by a key
 */
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Chunk array into smaller arrays of specified size
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Flatten nested arrays
 */
export function flatten<T>(array: (T | T[])[]): T[] {
  return array.reduce<T[]>((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

/**
 * Get random item from array
 */
export function randomItem<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get intersection of two arrays
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2);
  return array1.filter(item => set2.has(item));
}

/**
 * Get difference between two arrays (items in array1 not in array2)
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2);
  return array1.filter(item => !set2.has(item));
}

/**
 * Get union of two arrays
 */
export function union<T>(array1: T[], array2: T[]): T[] {
  return unique([...array1, ...array2]);
}

/**
 * Check if arrays are equal
 */
export function areArraysEqual<T>(array1: T[], array2: T[]): boolean {
  if (array1.length !== array2.length) return false;
  return array1.every((item, index) => item === array2[index]);
}

/**
 * Partition array into two arrays based on predicate
 */
export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];
  
  array.forEach(item => {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  });
  
  return [truthy, falsy];
}

/**
 * Take first n items from array
 */
export function take<T>(array: T[], n: number): T[] {
  return array.slice(0, n);
}

/**
 * Take last n items from array
 */
export function takeLast<T>(array: T[], n: number): T[] {
  return array.slice(-n);
}

/**
 * Drop first n items from array
 */
export function drop<T>(array: T[], n: number): T[] {
  return array.slice(n);
}

/**
 * Drop last n items from array
 */
export function dropLast<T>(array: T[], n: number): T[] {
  return array.slice(0, -n);
}

/**
 * Compact array (remove falsy values)
 */
export function compact<T>(array: (T | null | undefined | false | 0 | '')[]): T[] {
  return array.filter(Boolean) as T[];
}

/**
 * Find index of item by predicate
 */
export function findIndex<T>(array: T[], predicate: (item: T) => boolean): number {
  return array.findIndex(predicate);
}

/**
 * Find last index of item by predicate
 */
export function findLastIndex<T>(array: T[], predicate: (item: T) => boolean): number {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) return i;
  }
  return -1;
}

/**
 * Move item in array from one index to another
 */
export function move<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Insert item at index
 */
export function insertAt<T>(array: T[], index: number, item: T): T[] {
  const result = [...array];
  result.splice(index, 0, item);
  return result;
}

/**
 * Remove item at index
 */
export function removeAt<T>(array: T[], index: number): T[] {
  const result = [...array];
  result.splice(index, 1);
  return result;
}

/**
 * Update item at index
 */
export function updateAt<T>(array: T[], index: number, item: T): T[] {
  const result = [...array];
  result[index] = item;
  return result;
}

/**
 * Count occurrences of items in array
 */
export function countBy<T>(array: T[], key?: keyof T): Record<string, number> {
  return array.reduce((counts, item) => {
    const value = key ? String(item[key]) : String(item);
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
}

/**
 * Get range of numbers
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

/**
 * Zip multiple arrays together
 */
export function zip<T>(...arrays: T[][]): T[][] {
  const maxLength = Math.max(...arrays.map(arr => arr.length));
  return range(0, maxLength).map(i => arrays.map(arr => arr[i]));
}

/**
 * Sample n random items from array
 */
export function sample<T>(array: T[], n: number): T[] {
  const shuffled = shuffle(array);
  return take(shuffled, n);
}
