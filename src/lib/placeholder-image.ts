/**
 * Utility for generating placeholder image URLs
 * Uses the local API route for consistent placeholder images
 */

export function getPlaceholderImage(width: number, height?: number): string {
  const h = height || width;
  return `/api/placeholder/${width}/${h}`;
}

export function getPlaceholderImageSquare(size: number): string {
  return `/api/placeholder/${size}`;
}

// Common placeholder sizes
export const PLACEHOLDER_SIZES = {
  avatar: {
    sm: getPlaceholderImageSquare(40),
    md: getPlaceholderImageSquare(50),
    lg: getPlaceholderImageSquare(100),
    xl: getPlaceholderImageSquare(200),
  },
  card: {
    event: getPlaceholderImage(400, 300),
    artist: getPlaceholderImageSquare(400),
    brand: getPlaceholderImageSquare(200),
    product: getPlaceholderImageSquare(100),
  },
  hero: {
    default: getPlaceholderImage(1200, 600),
    journey: getPlaceholderImage(600, 400),
  },
} as const;
