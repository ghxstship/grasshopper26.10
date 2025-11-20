'use client';

import { useState} from 'react';
import Link from 'next/link';
import { GvtewayLayout} from '@/components/templates/GvtewayLayout';
import { ContentLayout} from '@/components/templates/ContentLayout';
import { Card, CardContent} from '@/components/atoms/Card';
import { Badge} from '@/components/atoms/Badge';
import { Button} from '@/components/atoms/Button';
import { Avatar} from '@/components/atoms/Avatar';
import { Input} from '@/components/atoms/Input';
import { Select} from '@/components/atoms/Select';
import { EmptyState} from '@/components/molecules/EmptyState';
import { BodyTextSmall,
 CardTitle as CardTitleTypography,
 Metadata,
 Caption
} from '@/components/atoms/Typography';
import { Search, Music, MapPin, Users, Heart,
 TrendingUp,
 SlidersHorizontal
} from 'lucide-react';

// Mock data - in production, this would come from API/database
const artistsData = [
 {
 id: '1',
 name: 'DJ Spectrum',
 bio: 'Award-winning electronic music producer and DJ',
 avatar: null,
 genres: ['Electronic', 'House', 'Techno'],
 location: 'Los Angeles, CA',
 followers: 125000,
 upcomingShows: 12,
 rating: 4.8,
 verified: true
},
 {
 id: '2',
 name: 'Luna Beats',
 bio: 'Experimental techno artist and live performer',
 avatar: null,
 genres: ['Techno', 'Experimental', 'Ambient'],
 location: 'Berlin, Germany',
 followers: 89000,
 upcomingShows: 8,
 rating: 4.6,
 verified: true
},
 {
 id: '3',
 name: 'Bass Prophet',
 bio: 'Heavy bass and dubstep specialist',
 avatar: null,
 genres: ['Dubstep', 'Bass', 'EDM'],
 location: 'London, UK',
 followers: 156000,
 upcomingShows: 15,
 rating: 4.9,
 verified: true
},
 {
 id: '4',
 name: 'Melody Maker',
 bio: 'Melodic house and progressive trance',
 avatar: null,
 genres: ['Progressive', 'Trance', 'Melodic House'],
 location: 'Amsterdam, Netherlands',
 followers: 98000,
 upcomingShows: 6,
 rating: 4.7,
 verified: false
},
 {
 id: '5',
 name: 'Rhythm Rider',
 bio: 'Drum and bass legend with 15 years experience',
 avatar: null,
 genres: ['Drum & Bass', 'Jungle', 'Breakbeat'],
 location: 'Bristol, UK',
 followers: 112000,
 upcomingShows: 10,
 rating: 4.8,
 verified: true
},
 {
 id: '6',
 name: 'Synth Wave',
 bio: 'Synthwave and retrowave producer',
 avatar: null,
 genres: ['Synthwave', 'Retrowave', 'Electronic'],
 location: 'Miami, FL',
 followers: 67000,
 upcomingShows: 4,
 rating: 4.5,
 verified: false
}
];

const genres = ['All', 'Electronic', 'House', 'Techno', 'Dubstep', 'Trance', 'Drum & Bass', 'Synthwave'];
const locations = ['All', 'United States', 'United Kingdom', 'Germany', 'Netherlands'];
const sortOptions = [
 { value: 'popular', label: 'Most Popular'},
 { value: 'rating', label: 'Highest Rated'},
 { value: 'shows', label: 'Most Shows'},
 { value: 'name', label: 'Name (A-Z)'}
];

export default function ArtistsPage() {
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedGenre, setSelectedGenre] = useState('All');
 const [selectedLocation, setSelectedLocation] = useState('All');
 const [sortBy, setSortBy] = useState('popular');
 const [showFilters, setShowFilters] = useState(false);
 const [followedArtists, setFollowedArtists] = useState<Set<string>>(new Set());

 const toggleFollow = (artistId: string) => {
 setFollowedArtists(prev => {
 const newSet = new Set(prev);
 if (newSet.has(artistId)) {
 newSet.delete(artistId);
} else {
 newSet.add(artistId);
}
 return newSet;
});
};

 // Filter and sort artists
 const filteredArtists = artistsData
 .filter(artist => {
 const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
 artist.bio.toLowerCase().includes(searchQuery.toLowerCase());
 const matchesGenre = selectedGenre === 'All' || artist.genres.includes(selectedGenre);
 const matchesLocation = selectedLocation === 'All' || artist.location.includes(selectedLocation);
 return matchesSearch && matchesGenre && matchesLocation;
})
 .sort((a, b) => {
 switch (sortBy) {
 case 'popular':
 return b.followers - a.followers;
 case 'rating':
 return b.rating - a.rating;
 case 'shows':
 return b.upcomingShows - a.upcomingShows;
 case 'name':
 return a.name.localeCompare(b.name);
 default:
 return 0;
}
});

 return (
 <GvtewayLayout>
 <ContentLayout
 title="Artists"
 description="Discover and follow your favorite artists"
 breadcrumbs={[
 { label: 'Home', href: '/home'},
 { label: 'Artists'}
 ]}
 >
 <div className="space-y-6">
 {/* Search and Filters */}
 <Card variant="gvteway">
 <CardContent className="pt-6">
 <div className="space-y-4">
 {/* Search Bar */}
 <div className="flex gap-3">
 <div className="flex-1 relative">
 <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
 <Input
 type="text"
 placeholder="Search artists by name or genre..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="ps-10"
 variant="gvteway"
 />
 </div>
 <Button
 variant={showFilters ?"gvteway" :"outline"}
 onClick={() => setShowFilters(!showFilters)}
 >
 <SlidersHorizontal className="w-4 h-4 me-2" />
 Filters
 </Button>
 </div>

 {/* Filter Options */}
 {showFilters && (
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
 <div>
 <Metadata className="block mb-2">Genre</Metadata>
 <Select
 value={selectedGenre}
 onChange={(e) => setSelectedGenre(e.target.value)}
 variant="gvteway"
 >
 {genres.map(genre => (
 <option key={genre} value={genre}>{genre}</option>
 ))}
 </Select>
 </div>
 <div>
 <Metadata className="block mb-2">Location</Metadata>
 <Select
 value={selectedLocation}
 onChange={(e) => setSelectedLocation(e.target.value)}
 variant="gvteway"
 >
 {locations.map(location => (
 <option key={location} value={location}>{location}</option>
 ))}
 </Select>
 </div>
 <div>
 <Metadata className="block mb-2">Sort By</Metadata>
 <Select
 value={sortBy}
 onChange={(e) => setSortBy(e.target.value)}
 variant="gvteway"
 >
 {sortOptions.map(option => (
 <option key={option.value} value={option.value}>{option.label}</option>
 ))}
 </Select>
 </div>
 </div>
 )}
 </div>
 </CardContent>
 </Card>

 {/* Results Count */}
 <div className="flex items-center justify-between">
 <BodyTextSmall className="mb-0">
 {filteredArtists.length} {filteredArtists.length === 1 ? 'artist' : 'artists'} found
 </BodyTextSmall>
 {(searchQuery || selectedGenre !== 'All' || selectedLocation !== 'All') && (
 <Button
 variant="ghost"
 size="sm"
 onClick={() => {
 setSearchQuery('');
 setSelectedGenre('All');
 setSelectedLocation('All');
}}
 >
 Clear Filters
 </Button>
 )}
 </div>

 {/* Artists Grid */}
 {filteredArtists.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {filteredArtists.map((artist) => (
 <Card key={artist.id} variant="gvteway" className="hover:shadow-xl transition-shadow">
 <CardContent className="pt-6">
 <div className="flex flex-col items-center text-center mb-4">
 <Avatar size="lg" fallback={artist.name}
 className="mb-4"
 />
 <div className="w-full">
 <Link href={`/artists/${artist.id}`}>
 <CardTitleTypography className="mb-2 hover:text-gvteway-red-500 transition-colors cursor-pointer">
 {artist.name}
 </CardTitleTypography>
 </Link>
 {artist.verified && (
 <Badge variant="success" className="mb-2">Verified</Badge>
 )}
 <BodyTextSmall className="mb-3 line-clamp-2">
 {artist.bio}
 </BodyTextSmall>
 </div>
 </div>

 {/* Genres */}
 <div className="flex flex-wrap gap-2 justify-center mb-4">
 {artist.genres.slice(0, 3).map((genre) => (
 <Badge key={genre} variant="default">
 {genre}
 </Badge>
 ))}
 </div>

 {/* Stats */}
 <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y">
 <div className="text-center">
 <div className="flex items-center justify-center gap-1 mb-1">
 <Users className="w-3 h-3" />
 </div>
 <Caption className="block">
 {(artist.followers / 1000).toFixed(0)}K
 </Caption>
 <Caption>Followers</Caption>
 </div>
 <div className="text-center">
 <div className="flex items-center justify-center gap-1 mb-1">
 <Music className="w-3 h-3" />
 </div>
 <Caption className="block">{artist.upcomingShows}</Caption>
 <Caption>Shows</Caption>
 </div>
 <div className="text-center">
 <div className="flex items-center justify-center gap-1 mb-1">
 <TrendingUp className="w-3 h-3" />
 </div>
 <Caption className="block">{artist.rating}</Caption>
 <Caption>Rating</Caption>
 </div>
 </div>

 {/* Location */}
 <div className="flex items-center justify-center gap-2 mb-4">
 <MapPin className="w-4 h-4" />
 <Caption>{artist.location}</Caption>
 </div>

 {/* Actions */}
 <div className="flex gap-2">
 <Button
 variant={followedArtists.has(artist.id) ?"outline" :"gvteway"}
 className="flex-1"
 onClick={() => toggleFollow(artist.id)}
 >
 <Heart className={`w-4 h-4 me-2 ${followedArtists.has(artist.id) ? 'fill-current' : ''}`} />
 {followedArtists.has(artist.id) ? 'Following' : 'Follow'}
 </Button>
 <Link href={`/artists/${artist.id}`} className="flex-1">
 <Button variant="outline" className="w-full">
 View Profile
 </Button>
 </Link>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 ) : (
 <EmptyState
 title="No Artists Found"
 message="No artists match your search criteria. Try adjusting your filters or search terms."
 icon={<Music className="w-16 h-16" />}
 variant="gvteway"
 actionLabel="Clear Filters"
 onAction={() => {
 setSearchQuery('');
 setSelectedGenre('All');
 setSelectedLocation('All');
}}
 />
 )}
 </div>
 </ContentLayout>
 </GvtewayLayout>
 );
}
