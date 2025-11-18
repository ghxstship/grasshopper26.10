/**
 * Mapbox integration types
 */

export interface MapboxConfig {
  accessToken: string;
  style?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MapMarker {
  id: string;
  coordinates: Coordinates;
  title: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface GeocodingResult {
  id: string;
  type: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    address?: string;
  };
  context?: Array<{
    id: string;
    text: string;
  }>;
}

export interface DirectionsResult {
  routes: Array<{
    distance: number; // meters
    duration: number; // seconds
    geometry: {
      coordinates: Array<[number, number]>;
      type: string;
    };
    legs: Array<{
      distance: number;
      duration: number;
      steps: Array<{
        distance: number;
        duration: number;
        instruction: string;
        name: string;
      }>;
    }>;
  }>;
}

export interface MapBounds {
  southwest: Coordinates;
  northeast: Coordinates;
}

export interface VenueLocation {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  capacity?: number;
  type?: string;
}
