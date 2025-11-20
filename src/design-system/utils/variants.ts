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
    gradient: 'bg-gradient-to-r from-atlvs-green-500 via-atlvs-orange-500 to-atlvs-purple-500',
    text: 'text-atlvs-green-500',
    border: 'border-atlvs-green-500',
    hover: 'hover:border-atlvs-green-600',
  },
  compvss: {
    gradient: 'bg-gradient-to-r from-compvss-cyan-500 via-compvss-teal-500 to-compvss-indigo-500',
    text: 'text-compvss-cyan-500',
    border: 'border-compvss-cyan-500',
    hover: 'hover:border-compvss-cyan-600',
  },
  gvteway: {
    gradient: 'bg-gradient-to-r from-gvteway-red-500 via-gvteway-yellow-500 to-gvteway-blue-500',
    text: 'text-gvteway-red-500',
    border: 'border-gvteway-red-500',
    hover: 'hover:border-gvteway-red-600',
  },
  default: {
    gradient: 'bg-ghxst-black',
    text: 'text-ghxst-black',
    border: 'border-ghxst-black',
    hover: 'hover:border-grey-800',
  },
} as const;

export type PlatformVariant = keyof typeof platformVariants;
