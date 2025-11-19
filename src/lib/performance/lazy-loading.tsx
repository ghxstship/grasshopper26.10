/**
 * Lazy Loading Components
 * Dynamic imports with loading states
 */

'use client';

import dynamic from 'next/dynamic';
import { ComponentType, Suspense } from 'react';

/**
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-grey-900" />
    </div>
  );
}

/**
 * Create lazy loaded component with custom loading state
 */
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  LoadingComponent: ComponentType = LoadingFallback
) {
  const LazyComponent = dynamic(importFn, {
    loading: () => <LoadingComponent />,
    ssr: false,
  });

  return function LazyWrapper(props: P) {
    return (
      <Suspense fallback={<LoadingComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Lazy load heavy components
 * Note: Components commented out due to missing default exports or non-existent files
 */
// export const LazyDataTable = createLazyComponent(
//   () => import('@/components/atlvs/DataTable')
// );

// export const LazyChart = createLazyComponent(
//   () => import('@/components/organisms/Chart')
// );

export const LazyModal = createLazyComponent(
  () => import('@/components/organisms/Modal').then(mod => ({ default: mod.Modal }))
);

export const LazyCommandPalette = createLazyComponent(
  () => import('@/components/organisms/CommandPalette').then(mod => ({ default: mod.CommandPalette }))
);

// export const LazyRichTextEditor = createLazyComponent(
//   () => import('@/components/organisms/RichTextEditor')
// );

// export const LazyMapView = createLazyComponent(
//   () => import('@/components/organisms/MapView')
// );
