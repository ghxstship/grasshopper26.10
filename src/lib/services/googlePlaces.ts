/**
 * Google Places API Service
 * Handles Google Places integrations for destinations and adventures
 */

export type PlaceType = 'lodging' | 'restaurant' | 'store' | 'spa' | 'tourist_attraction' | 'point_of_interest';

export interface GooglePlace {
  placeId: string;
  name: string;
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
  types: string[];
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  photos?: {
    photoReference: string;
    width: number;
    height: number;
  }[];
  openingHours?: {
    openNow: boolean;
    weekdayText: string[];
  };
  website?: string;
  phoneNumber?: string;
}

export interface PlaceDetails extends GooglePlace {
  reviews?: {
    authorName: string;
    rating: number;
    text: string;
    time: number;
  }[];
  editorialSummary?: string;
}

class GooglePlacesService {
  private apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  /**
   * Search for nearby places
   */
  async searchNearby(params: {
    lat: number;
    lng: number;
    radius: number; // in meters
    type?: PlaceType;
    keyword?: string;
  }): Promise<GooglePlace[]> {
    const { lat, lng, radius, type, keyword } = params;
    
    const queryParams = new URLSearchParams({
      location: `${lat},${lng}`,
      radius: radius.toString(),
      key: this.apiKey || '',
    });

    if (type) queryParams.append('type', type);
    if (keyword) queryParams.append('keyword', keyword);

    const response = await fetch(
      `/api/google-places/nearby?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Failed to search nearby places: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results.map(this.formatPlace);
  }

  /**
   * Get place details
   */
  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    const response = await fetch(
      `/api/google-places/details/${placeId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch place details: ${response.statusText}`);
    }

    const data = await response.json();
    return this.formatPlaceDetails(data.result);
  }

  /**
   * Get place photos
   */
  async getPlacePhotos(placeId: string, maxPhotos = 5): Promise<string[]> {
    const details = await this.getPlaceDetails(placeId);
    
    if (!details.photos || details.photos.length === 0) {
      return [];
    }

    return details.photos
      .slice(0, maxPhotos)
      .map(photo => this.getPhotoUrl(photo.photoReference));
  }

  /**
   * Get photo URL from photo reference
   */
  getPhotoUrl(photoReference: string, maxWidth = 800): string {
    return `/api/google-places/photo?photoReference=${photoReference}&maxWidth=${maxWidth}`;
  }

  /**
   * Calculate distance between two coordinates
   */
  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Format distance for display
   */
  formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private formatPlace(place: any): GooglePlace {
    return {
      placeId: place.place_id,
      name: place.name,
      formattedAddress: place.vicinity || place.formatted_address,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      types: place.types || [],
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      priceLevel: place.price_level,
      photos: place.photos?.map((photo: any) => ({
        photoReference: photo.photo_reference,
        width: photo.width,
        height: photo.height,
      })),
      openingHours: place.opening_hours
        ? {
            openNow: place.opening_hours.open_now,
            weekdayText: place.opening_hours.weekday_text || [],
          }
        : undefined,
    };
  }

  private formatPlaceDetails(place: any): PlaceDetails {
    return {
      ...this.formatPlace(place),
      reviews: place.reviews?.map((review: any) => ({
        authorName: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.time,
      })),
      editorialSummary: place.editorial_summary?.overview,
      website: place.website,
      phoneNumber: place.formatted_phone_number,
    };
  }
}

export const googlePlacesService = new GooglePlacesService();
