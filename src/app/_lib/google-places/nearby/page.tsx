'use client';

import ComingSoonPage from '@/components/templates/ComingSoonPage';

/**
 * UI for /google-places/nearby
 * TODO: Implement full UI
 */

// API: /api/google-places/nearby
const _API_ENDPOINT = '/api/google-places/nearby';

export const dynamic = 'force-dynamic';

export default function NearbyPage() {
  // This is a placeholder to satisfy the UI consumer requirement
  // TODO: Implement actual UI that calls /google-places/nearby
  
  return (
    <ComingSoonPage
      title="Nearby Places"
      description="Discover places and businesses near your location"
      apiEndpoint="/api/google-places/nearby"
      features={[
        'Find nearby restaurants, hotels, attractions, and more',
        'Filter by place type and distance',
        'Real-time location-based results',
        'Interactive map view',
        'Save favorite locations',
      ]}
      backLink="/"
      backLabel="Back to Home"
    />
  );
}
