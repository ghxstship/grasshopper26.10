'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { BodyText, CardTitle, PageTitle, SectionHeader } from "@/components/atoms/Typography";
import { ArtistCard } from "@/components/molecules/ArtistCard";
import { CategoryTab } from "@/components/atoms/CategoryTab";
import { SearchBar } from "@/components/atoms/SearchBar";
import { IntegrationBadge } from "@/components/atoms/IntegrationBadge";
import { Button } from "@/components/atoms/Button";
import { Music, TrendingUp, Calendar } from "lucide-react";

const metadata = {
  title: 'Music | Discover Artists & Shows | GVTEWAY',
  description: 'Explore artists, tour dates, and exclusive merch. Spotify-powered music discovery for GVTEWAY members.',
  keywords: 'music, artists, concerts, spotify, music discovery',
};

export default function MusicPage() {
  // Demo data - replace with actual API calls
  const featuredArtists = [
    {
      id: "1",
      name: "The Midnight Collective",
      genre: "Electronic • House",
      image: "/api/placeholder/400/400",
      followers: 50000,
      upcomingShows: 3,
      slug: "the-midnight-collective",
      spotifyId: "abc123",
    },
    {
      id: "2",
      name: "Luna Eclipse",
      genre: "Indie • Alternative",
      image: "/api/placeholder/400/400",
      followers: 32000,
      upcomingShows: 2,
      slug: "luna-eclipse",
      spotifyId: "def456",
    },
    {
      id: "3",
      name: "Bass Frequency",
      genre: "EDM • Dubstep",
      image: "/api/placeholder/400/400",
      followers: 75000,
      upcomingShows: 5,
      slug: "bass-frequency",
      spotifyId: "ghi789",
    },
    {
      id: "4",
      name: "Acoustic Souls",
      genre: "Folk • Singer-Songwriter",
      image: "/api/placeholder/400/400",
      followers: 28000,
      upcomingShows: 1,
      slug: "acoustic-souls",
      spotifyId: "jkl012",
    },
  ];

  return (
    <GvtewayLayout>

      {/* Hero Section */}
      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <PageTitle className="mb-4 uppercase text-ghxst-primary">Discover Music</PageTitle>
          <BodyText className="text-ghxst-text-secondary max-w-2xl mx-auto mb-8">
            Explore artists playing locally. Follow favorites, discover new sounds, 
            see upcoming shows, and shop exclusive merch—all powered by Spotify.
          </BodyText>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar placeholder="Search artists, genres, labels..." showLocationSelector={false} />
          </div>

          <IntegrationBadge provider="spotify" size="md" />
        </div>
      </section>

      {/* Category Tabs */}
      <section className="border-b-2 border-ghxst-border">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap gap-4 py-4">
            <CategoryTab active>All Artists</CategoryTab>
            <CategoryTab icon={<TrendingUp className="w-4 h-4" />}>Trending</CategoryTab>
            <CategoryTab icon={<Calendar className="w-4 h-4" />}>Playing This Week</CategoryTab>
            <CategoryTab icon={<Music className="w-4 h-4" />}>By Genre</CategoryTab>
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader className="mb-8 uppercase text-ghxst-primary">Featured Artists</SectionHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredArtists.map((artist) => (
              <ArtistCard key={artist.id} {...artist} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="primary" size="lg">
              View All Artists
            </Button>
          </div>
        </div>
      </section>

      {/* Music Features */}
      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader className="mb-8 uppercase text-center text-ghxst-primary">Music Features</SectionHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-ghxst-black rounded-full flex items-center justify-center mx-auto">
                <Music className="w-8 h-8 text-ghxst-white" />
              </div>
              <CardTitle className="text-ghxst-primary">Artist Pages</CardTitle>
              <BodyText className="-tech text-body-sm text-ghxst-text-secondary">
                Spotify bio, tracks, tour dates, merch
              </BodyText>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-ghxst-black rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8 text-ghxst-white" />
              </div>
              <CardTitle className="text-ghxst-primary">Show Calendar</CardTitle>
              <BodyText className="-tech text-body-sm text-ghxst-text-secondary">
                See all upcoming shows locally
              </BodyText>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-ghxst-black rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-ghxst-white" />
              </div>
              <CardTitle className="text-ghxst-primary">Artist Shops</CardTitle>
              <BodyText className="-tech text-body-sm text-ghxst-text-secondary">
                Exclusive merch, vinyl, and drops direct
              </BodyText>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-ghxst-black text-ghxst-white">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <SectionHeader className="mb-4 uppercase">Connect Your Spotify</SectionHeader>
          <BodyText className="text-grey-300 max-w-2xl mx-auto mb-8">
            Get personalized artist recommendations based on your listening history
          </BodyText>
          <Button variant="primary" size="lg">
            Connect Spotify
          </Button>
        </div>
      </section>

    </GvtewayLayout>
  );
}
