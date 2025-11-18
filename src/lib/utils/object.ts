/**
 * Object Utilities
 * Helper functions for object manipulation and operations
 */

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Deep merge two objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      
      if (isObject(sourceValue) && isObject(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue as any;
      }
    }
  }
  
  return result;
}

/**
 * Check if value is a plain object
 */
export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Pick specific keys from an object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omit specific keys from an object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

/**
 * Get nested value from object using dot notation
 */
export function getNestedValue<T = any>(obj: any, path: string): T | undefined {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Set nested value in object using dot notation
 */
export function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

/**
 * Check if object has nested key using dot notation
 */
export function hasNestedKey(obj: any, path: string): boolean {
  return getNestedValue(obj, path) !== undefined;
}

/**
 * Flatten nested object to single level with dot notation keys
 */
export function flattenObject(obj: Record<string, any>, prefix: string = ''): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (isObject(obj[key]) && !Array.isArray(obj[key])) {
        Object.assign(result, flattenObject(obj[key], newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  
  return result;
}

/**
 * Unflatten object from dot notation keys to nested structure
 */
export function unflattenObject(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      setNestedValue(result, key, obj[key]);
    }
  }
  
  return result;
}

/**
 * Get all keys from nested object (including nested keys with dot notation)
 */
export function getAllKeys(obj: Record<string, any>, prefix: string = ''): string[] {
  const keys: string[] = [];
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      keys.push(newKey);
      
      if (isObject(obj[key]) && !Array.isArray(obj[key])) {
        keys.push(...getAllKeys(obj[key], newKey));
      }
    }
  }
  
  return keys;
}

/**
 * Check if two objects are deeply equal
 */
export function isEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  
  return true;
}

/**
 * Remove undefined values from object
 */
export function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  
  return result;
}

/**
 * Remove null and undefined values from object
 */
export function removeNullish<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] != null) {
      result[key] = obj[key];
    }
  }
  
  return result;
}

/**
 * Map object values
 */
export function mapValues<T extends Record<string, any>, R>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => R
): Record<keyof T, R> {
  const result = {} as Record<keyof T, R>;
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = fn(obj[key], key);
    }
  }
  
  return result;
}

/**
 * Map object keys
 */
export function mapKeys<T extends Record<string, any>>(
  obj: T,
  fn: (key: keyof T, value: T[keyof T]) => string
): Record<string, T[keyof T]> {
  const result: Record<string, T[keyof T]> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = fn(key, obj[key]);
      result[newKey] = obj[key];
    }
  }
  
  return result;
}

/**
 * Invert object (swap keys and values)
 */
export function invert<T extends Record<string, string | number>>(obj: T): Record<string, keyof T> {
  const result: Record<string, keyof T> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[String(obj[key])] = key;
    }
  }
  
  return result;
}

/**
 * Get object entries with proper typing
 */
export function entries<T extends Record<string, any>>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

/**
 * Get object keys with proper typing
 */
export function keys<T extends Record<string, any>>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

/**
 * Get object values with proper typing
 */
export function values<T extends Record<string, any>>(obj: T): T[keyof T][] {
  return Object.values(obj);
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Freeze object deeply (make immutable)
 */
export function deepFreeze<T>(obj: T): Readonly<T> {
  Object.freeze(obj);
  
  if (isObject(obj)) {
    Object.values(obj).forEach(value => {
      if (typeof value === 'object' && value !== null) {
        deepFreeze(value);
      }
    });
  }
  
  return obj;
}
