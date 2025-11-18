/**
 * Mapbox integration client
 */

import { validateEnvVars, createSuccessResponse, createErrorResponse } from '../utils';
import type { IntegrationResponse } from '../types';
import type { Coordinates, GeocodingResult, DirectionsResult } from './types';

const MAPBOX_API_BASE = 'https://api.mapbox.com';

/**
 * Get Mapbox access token
 */
export function getMapboxToken(): string {
  validateEnvVars({
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  });

  return process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
}

/**
 * Geocode an address to coordinates
 */
export async function geocodeAddress(
  address: string
): Promise<IntegrationResponse<GeocodingResult[]>> {
  try {
    const token = getMapboxToken();
    const encodedAddress = encodeURIComponent(address);
    
    const url = `${MAPBOX_API_BASE}/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${token}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return createSuccessResponse(data.features as GeocodingResult[]);
  } catch (error) {
    return createErrorResponse(
      'MAPBOX_GEOCODING_ERROR',
      error instanceof Error ? error.message : 'Failed to geocode address',
      error
    );
  }
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(
  coordinates: Coordinates
): Promise<IntegrationResponse<GeocodingResult[]>> {
  try {
    const token = getMapboxToken();
    const { longitude, latitude } = coordinates;
    
    const url = `${MAPBOX_API_BASE}/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return createSuccessResponse(data.features as GeocodingResult[]);
  } catch (error) {
    return createErrorResponse(
      'MAPBOX_REVERSE_GEOCODING_ERROR',
      error instanceof Error ? error.message : 'Failed to reverse geocode',
      error
    );
  }
}

/**
 * Get directions between two points
 */
export async function getDirections(
  origin: Coordinates,
  destination: Coordinates,
  profile: 'driving' | 'walking' | 'cycling' = 'driving'
): Promise<IntegrationResponse<DirectionsResult>> {
  try {
    const token = getMapboxToken();
    
    const coordinates = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
    
    const url = `${MAPBOX_API_BASE}/directions/v5/mapbox/${profile}/${coordinates}?geometries=geojson&steps=true&access_token=${token}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return createSuccessResponse(data as DirectionsResult);
  } catch (error) {
    return createErrorResponse(
      'MAPBOX_DIRECTIONS_ERROR',
      error instanceof Error ? error.message : 'Failed to get directions',
      error
    );
  }
}

/**
 * Calculate distance between two points (in meters)
 */
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (point1.latitude * Math.PI) / 180;
  const φ2 = (point2.latitude * Math.PI) / 180;
  const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Get static map image URL
 */
export function getStaticMapUrl(
  coordinates: Coordinates,
  width: number = 600,
  height: number = 400,
  zoom: number = 14
): string {
  const token = getMapboxToken();
  
  return `${MAPBOX_API_BASE}/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${coordinates.longitude},${coordinates.latitude})/${coordinates.longitude},${coordinates.latitude},${zoom}/${width}x${height}?access_token=${token}`;
}

/**
 * Search for places near coordinates
 */
export async function searchNearby(
  coordinates: Coordinates,
  query: string,
  radius: number = 5000 // meters
): Promise<IntegrationResponse<GeocodingResult[]>> {
  try {
    const token = getMapboxToken();
    const encodedQuery = encodeURIComponent(query);
    
    const url = `${MAPBOX_API_BASE}/geocoding/v5/mapbox.places/${encodedQuery}.json?proximity=${coordinates.longitude},${coordinates.latitude}&access_token=${token}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Filter results by radius
    const filtered = data.features.filter((feature: GeocodingResult) => {
      const distance = calculateDistance(coordinates, {
        latitude: feature.center[1],
        longitude: feature.center[0],
      });
      return distance <= radius;
    });
    
    return createSuccessResponse(filtered as GeocodingResult[]);
  } catch (error) {
    return createErrorResponse(
      'MAPBOX_SEARCH_ERROR',
      error instanceof Error ? error.message : 'Failed to search nearby',
      error
    );
  }
}

/**
 * Generate a GeoJSON feature collection for markers
 */
export function createMarkerFeatureCollection(
  markers: Array<{ coordinates: Coordinates; properties?: Record<string, unknown> }>
) {
  return {
    type: 'FeatureCollection',
    features: markers.map((marker, index) => ({
      type: 'Feature',
      id: index,
      geometry: {
        type: 'Point',
        coordinates: [marker.coordinates.longitude, marker.coordinates.latitude],
      },
      properties: marker.properties || {},
    })),
  };
}
