import { NextRequest, NextResponse } from 'next/server';
import { spotifyService } from '@/lib/services/spotify';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = searchParams.get('limit');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const artists = await spotifyService.searchArtists(
      query,
      limit ? Number(limit) : 20
    );

    return NextResponse.json({ artists });
  } catch (error) {
    console.error('Error searching artists:', error);
    return NextResponse.json(
      { error: 'Failed to search artists' },
      { status: 500 }
    );
  }
}
