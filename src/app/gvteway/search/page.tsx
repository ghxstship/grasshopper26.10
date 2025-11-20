'use client';

import { Suspense} from 'react';
import { useSearchParams} from 'next/navigation';
import { GvtewayLayout} from '@/components/templates/GvtewayLayout';
import { ContentLayout} from '@/components/templates/ContentLayout';
import { Card, CardHeader, CardTitle, CardContent} from '@/components/atoms/Card';
import { EventCard} from '@/components/molecules/EventCard';
import { ArtistCard} from '@/components/molecules/ArtistCard';
import { BodyText, SectionHeader} from '@/components/atoms/Typography';
import { EmptyState} from '@/components/molecules/EmptyState';
import { Search, Loader2} from 'lucide-react';
import { useSearch} from '@/lib/hooks/shared/useSearch';

function SearchContent() {
 const searchParams = useSearchParams();
 const query = searchParams.get('q') || '';
 const { data, isLoading, error} = useSearch(query);

 const breadcrumbs = [
 { label: 'Home', href: '/home'},
 { label: 'Search', href: '/gvteway/search'},
 ];

 return (
 <GvtewayLayout>
 <ContentLayout
 title={`Search Results${query ?`:"${query}"` : ''}`}
 description="Find events, artists, venues, and more"
 breadcrumbs={breadcrumbs}
 variant="gvteway"
 showToolbar={false}
 >
 {isLoading && (
 <div className="flex items-center justify-center min-h-[400px]">
 <div className="text-center">
 <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
 <BodyText>Searching...</BodyText>
 </div>
 </div>
 )}

 {error && (
 <EmptyState
 icon={<Search className="h-12 w-12" />}
 title="Search Error"
 message="There was an error performing your search. Please try again."
 variant="gvteway"
 />
 )}

 {!isLoading && !error && !query && (
 <EmptyState
 icon={<Search className="h-12 w-12" />}
 title="Start Searching"
 message="Enter a search term to find events, artists, venues, and more"
 variant="gvteway"
 />
 )}

 {!isLoading && !error && query && data && (
 <div className="space-y-8">
 {/* Events */}
 {data.events && data.events.length > 0 && (
 <div>
 <SectionHeader className="mb-4">Events</SectionHeader>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {data.events.map((event: any) => (
 <EventCard
 key={event.id}
 id={event.id}
 title={event.name}
 venue={event.venue?.name || 'TBA'}
 date={new Date(event.startDate).toLocaleDateString()}
 time={new Date(event.startDate).toLocaleTimeString()}
 image={event.imageUrl}
 slug={event.slug}
 />
 ))}
 </div>
 </div>
 )}

 {/* Artists */}
 {data.artists && data.artists.length > 0 && (
 <div>
 <SectionHeader className="mb-4">Artists</SectionHeader>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {data.artists.map((artist: any) => (
 <ArtistCard
 key={artist.id}
 id={artist.id}
 name={artist.name}
 genre={artist.genre || 'Music'}
 image={artist.imageUrl}
 slug={artist.slug}
 spotifyId={artist.spotifyId}
 />
 ))}
 </div>
 </div>
 )}

 {/* Venues */}
 {data.venues && data.venues.length > 0 && (
 <div>
 <SectionHeader className="mb-4">Venues</SectionHeader>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {data.venues.map((venue: any) => (
 <Card key={venue.id} variant="gvteway">
 <CardHeader>
 <CardTitle>{venue.name}</CardTitle>
 </CardHeader>
 <CardContent>
 <BodyText>
 {venue.city}, {venue.state}
 </BodyText>
 </CardContent>
 </Card>
 ))}
 </div>
 </div>
 )}

 {/* No Results */}
 {(!data.events || data.events.length === 0) &&
 (!data.artists || data.artists.length === 0) &&
 (!data.venues || data.venues.length === 0) && (
 <EmptyState
 icon={<Search className="h-12 w-12" />}
 title="No Results Found"
 message={`No results found for"${query}". Try a different search term.`}
 variant="gvteway"
 />
 )}
 </div>
 )}
 </ContentLayout>
 </GvtewayLayout>
 );
}

export default function SearchPage() {
 return (
 <Suspense fallback={
 <GvtewayLayout>
 <ContentLayout
 title="Search"
 description="Find events, artists, venues, and more"
 variant="gvteway"
 showToolbar={false}
 >
 <div className="flex items-center justify-center min-h-[400px]">
 <Loader2 className="w-12 h-12 animate-spin text-gvteway-red-500" />
 </div>
 </ContentLayout>
 </GvtewayLayout>
}>
 <SearchContent />
 </Suspense>
 );
}
