'use client';

import ComingSoonPage from '@/components/templates/ComingSoonPage';

/**
 * UI for /spotify/artists/:id
 */

// API: /api/spotify/artists/:id
const _API_ENDPOINT = '/api/spotify/artists/:id';

export const dynamic = 'force-dynamic';

export default function idPage() {
  return (
    <ComingSoonPage
      title="Spotify Artist Details"
      description="View detailed information about a Spotify artist"
      apiEndpoint="/api/spotify/artists/:id"
      features={[
        'Artist biography and metadata',
        'Top tracks and albums',
        'Related artists',
        'Follower count and popularity metrics',
        'Artist images and profile information',
      ]}
      backLink="/"
      backLabel="Back to Home"
    />
  );
}
