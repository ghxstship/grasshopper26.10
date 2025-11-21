'use client';

import ComingSoonPage from '@/components/templates/ComingSoonPage';

/**
 * UI for /spotify/search
 * TODO: Implement full UI
 */

// API: /api/spotify/search
const _API_ENDPOINT = '/api/spotify/search';

export const dynamic = 'force-dynamic';

export default function SearchPage() {
  return (
    <ComingSoonPage
      title="Spotify Search"
      description="Search for artists, albums, tracks, and playlists on Spotify"
      apiEndpoint="/api/spotify/search"
      features={[
        'Search across multiple content types (artists, albums, tracks, playlists)',
        'Real-time search results',
        'Advanced filtering options',
        'Preview audio tracks',
        'Add to favorites and playlists',
      ]}
      backLink="/"
      backLabel="Back to Home"
    />
  );
}
