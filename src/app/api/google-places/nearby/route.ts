import { NextRequest, NextResponse } from 'next/server';
import { googlePlacesService, PlaceType } from '@/lib/services/googlePlaces';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');
    const radius = searchParams.get('radius');
    const type = searchParams.get('type') as PlaceType | null;
    const keyword = searchParams.get('keyword');

    if (!location || !radius) {
      return NextResponse.json(
        { error: 'Location and radius are required' },
        { status: 400 }
      );
    }

    const [lat, lng] = location.split(',').map(Number);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: 'Invalid location format' },
        { status: 400 }
      );
    }

    const places = await googlePlacesService.searchNearby({
      lat,
      lng,
      radius: Number(radius),
      type: type || undefined,
      keyword: keyword || undefined,
    });

    return NextResponse.json({ results: places });
  } catch (error) {
    console.error('Error searching nearby places:', error);
    return NextResponse.json(
      { error: 'Failed to search nearby places' },
      { status: 500 }
    );
  }
}
