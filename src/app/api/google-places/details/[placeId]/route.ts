import { NextRequest, NextResponse } from 'next/server';
import { googlePlacesService } from '@/lib/services/googlePlaces';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  const resolvedParams = await params;
  try {
    const placeDetails = await googlePlacesService.getPlaceDetails(resolvedParams.placeId);
    return NextResponse.json({ result: placeDetails });
  } catch (error) {
    console.error('Error fetching place details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch place details' },
      { status: 500 }
    );
  }
}
