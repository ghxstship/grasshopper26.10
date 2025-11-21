'use client';

import ComingSoonPage from '@/components/templates/ComingSoonPage';

/**
 * UI for /google-places/details/:placeId
 * TODO: Implement full UI
 */

// API: /api/google-places/details/:placeId
const _API_ENDPOINT = '/api/google-places/details/:placeId';

export const dynamic = 'force-dynamic';

export default function placeIdPage() {
  return (
    <ComingSoonPage
      title="Google Place Details"
      description="View detailed information about a specific location"
      apiEndpoint="/api/google-places/details/:placeId"
      features={[
        'Complete place information including address and contact',
        'Business hours and opening times',
        'User reviews and ratings',
        'Photos and street view',
        'Directions and navigation',
      ]}
      backLink="/"
      backLabel="Back to Home"
    />
  );
}
