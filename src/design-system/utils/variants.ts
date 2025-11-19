/**
 * Variant System Utilities
 * Creates type-safe variant systems for components
 */

import { type ClassValue } from 'clsx';
import { cn } from './cn';

export type VariantProps<T extends Record<string, Record<string, ClassValue>>> = {
  [K in keyof T]?: keyof T[K];
};

/**
 * Creates a variant class generator
 * @param base - Base classes applied to all variants
 * @param variants - Variant definitions
 * @returns Function to generate classes based on variant props
 */
export function createVariants<T extends Record<string, Record<string, ClassValue>>>(
  base: ClassValue,
  variants: T
) {
  return (props?: VariantProps<T> & { className?: string }) => {
    const variantClasses = Object.entries(variants).map(([key, values]) => {
      const propValue = props?.[key as keyof typeof props];
      if (propValue && typeof propValue === 'string') {
        return values[propValue];
      }
      return undefined;
    });

    return cn(base, ...variantClasses, props?.className);
  };
}

/**
 * Platform variant definitions
 */
export const platformVariants = {
  atlvs: {
    gradient: 'bg-gradient-to-r from-green-500 via-orange-500 to-purple-500',
    text: 'text-green-500',
    border: 'border-green-500',
    hover: 'hover:border-green-600',
  },
  compvss: {
    gradient: 'bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500',
    text: 'text-cyan-500',
    border: 'border-cyan-500',
    hover: 'hover:border-cyan-600',
  },
  gvteway: {
    gradient: 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500',
    text: 'text-red-500',
    border: 'border-red-500',
    hover: 'hover:border-red-600',
  },
  default: {
    gradient: 'bg-black',
    text: 'text-black',
    border: 'border-black',
    hover: 'hover:border-grey-800',
  },
} as const;

export type PlatformVariant = keyof typeof platformVariants;
