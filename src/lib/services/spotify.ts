/**
 * Spotify API Service
 * Handles all Spotify API integrations for artist data, tracks, and user preferences
 */

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string; height: number; width: number }[];
  followers: { total: number };
  popularity: number;
  external_urls: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: {
    id: string;
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

class SpotifyService {
  private baseUrl = 'https://api.spotify.com/v1';
  private accessToken: string | null = null;

  /**
   * Get access token for Spotify API
   * In production, this should use OAuth flow
   */
  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;
    
    // Demo: Return mock token or implement proper OAuth
    // For production, implement proper token management
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error('Spotify credentials not configured');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    this.accessToken = data.access_token;
    return this.accessToken;
  }

  /**
   * Get artist details from Spotify
   */
  async getArtist(artistId: string): Promise<SpotifyArtist> {
    const token = await this.getAccessToken();
    const response = await fetch(`${this.baseUrl}/artists/${artistId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artist: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get artist's top tracks
   */
  async getArtistTopTracks(artistId: string, market = 'US'): Promise<SpotifyTrack[]> {
    const token = await this.getAccessToken();
    const response = await fetch(
      `${this.baseUrl}/artists/${artistId}/top-tracks?market=${market}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch top tracks: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tracks;
  }

  /**
   * Search for artists
   */
  async searchArtists(query: string, limit = 20): Promise<SpotifyArtist[]> {
    const token = await this.getAccessToken();
    const response = await fetch(
      `${this.baseUrl}/search?q=${encodeURIComponent(query)}&type=artist&limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) {
      throw new Error(`Failed to search artists: ${response.statusText}`);
    }

    const data = await response.json();
    return data.artists.items;
  }

  /**
   * Get user's top artists (requires user authentication)
   */
  async getUserTopArtists(userToken: string, limit = 20): Promise<SpotifyArtist[]> {
    const response = await fetch(
      `${this.baseUrl}/me/top/artists?limit=${limit}`,
      { headers: { Authorization: `Bearer ${userToken}` } }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user top artists: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items;
  }

  /**
   * Get related artists
   */
  async getRelatedArtists(artistId: string): Promise<SpotifyArtist[]> {
    const token = await this.getAccessToken();
    const response = await fetch(
      `${this.baseUrl}/artists/${artistId}/related-artists`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch related artists: ${response.statusText}`);
    }

    const data = await response.json();
    return data.artists;
  }
}

export const spotifyService = new SpotifyService();
