'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { HeroTitle, SectionHeader, BodyText, Metadata } from "@/components/atoms/Typography";
import { EventCard } from "@/components/molecules/EventCard";
import { Button } from "@/components/atoms/Button";
import { IntegrationBadge } from "@/components/atoms/IntegrationBadge";
import { Music, MapPin, Users, ExternalLink } from "lucide-react";
import Image from "next/image";

interface ArtistPageProps {
  params: {
    slug: string;
  };
}

async function generateMetadata({ params }: ArtistPageProps) {
  return {
    title: `Artist Name | GVTEWAY Music`,
    description: `Discover Artist Name's upcoming shows, music, and exclusive merchandise.`,
  };
}

export default function ArtistPage({ params: { slug } }: ArtistPageProps) {
  // Demo data - replace with actual API call using slug
  const artist = {
    name: "The Midnight Collective",
    genre: "Electronic • House",
    location: "FL",
    followers: 50000,
    bio: "The Midnight Collective is an electronic music duo that blends deep house with melodic techno, creating immersive soundscapes that transport listeners to another dimension. With releases on major labels and performances at festivals worldwide, they've become a staple in the underground electronic scene.",
    image: "/api/placeholder/400/400",
    spotifyId: "abc123",
    spotifyUrl: "https://open.spotify.com/artist/abc123",
  };

  const upcomingShows = [
    {
      id: "1",
      title: "The Midnight Collective Live",
      venue: "The Ritz Ybor",
      date: "Nov 25, 2025",
      time: "9:00 PM",
      image: "/api/placeholder/400/300",
      priceMin: 35,
      priceMax: 75,
      attendeeCount: 156,
      slug: "midnight-collective-live",
    },
  ];

  const topTracks = [
    { id: "1", name: "Midnight Drive", plays: "2.5M" },
    { id: "2", name: "Neon Dreams", plays: "1.8M" },
    { id: "3", name: "Electric Pulse", plays: "1.2M" },
    { id: "4", name: "Cosmic Journey", plays: "980K" },
    { id: "5", name: "Afterglow", plays: "750K" },
  ];

  return (
    <GvtewayLayout>

      {/* Artist Hero */}
      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-[300px_1fr] gap-12 items-start">
            {/* Artist Image */}
            <div className="relative aspect-square rounded-full overflow-hidden bg-ghxst-surface mx-auto lg:mx-0 border-4 border-ghxst-border">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Artist Info */}
            <div className="space-y-6">
              <div>
                <HeroTitle className="mb-2 text-ghxst-primary">{artist.name}</HeroTitle>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                    <Music className="w-4 h-4" />
                    {artist.genre}
                  </Metadata>
                  <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                    <MapPin className="w-4 h-4" />
                    {artist.location}
                  </Metadata>
                  <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                    <Users className="w-4 h-4" />
                    {artist.followers.toLocaleString()} followers
                  </Metadata>
                </div>

                <BodyText className="text-ghxst-text-secondary mb-6">
                  {artist.bio}
                </BodyText>

                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" size="lg">
                    Follow Artist
                  </Button>
                  <Button variant="secondary" size="lg">
                    Shop Merch
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    leftIcon={<ExternalLink className="w-4 h-4" />}
                    onClick={() => window.open(artist.spotifyUrl, '_blank')}
                  >
                    Open in Spotify
                  </Button>
                </div>
              </div>

              <IntegrationBadge provider="spotify" size="md" />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Shows */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader className="mb-8 uppercase text-ghxst-primary">Upcoming Shows</SectionHeader>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {upcomingShows.map((show) => (
              <EventCard key={show.id} {...show} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="secondary" size="md">
              View All Shows
            </Button>
          </div>
        </div>
      </section>

      {/* Top Tracks */}
      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader className="mb-8 uppercase text-ghxst-primary">Top Tracks</SectionHeader>
          
          <div className="max-w-2xl mx-auto space-y-4">
            {topTracks.map((track, idx) => (
              <div
                key={track.id}
                className="flex items-center justify-between p-4 bg-ghxst-white border border-ghxst-border hover:border-ghxst-black transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="font-share-tech-mono text-ghxst-text-secondary w-8">
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className="font-bebas text-h5 text-ghxst-primary">{track.name}</h5>
                    <Metadata className="text-ghxst-text-secondary">{track.plays} plays</Metadata>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Music className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <IntegrationBadge provider="spotify" size="md" />
          </div>
        </div>
      </section>

      {/* Artist Shop */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader className="mb-8 uppercase text-ghxst-primary">Artist Shop</SectionHeader>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card overflow-hidden">
                <div className="relative aspect-square bg-ghxst-surface">
                  <Image
                    src="/api/placeholder/400/400"
                    alt="Product"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h5 className="font-bebas text-h5 text-ghxst-primary">Limited Edition Tee</h5>
                  <Metadata className="text-ghxst-text-primary">$35.00</Metadata>
                  <Button variant="primary" size="sm" className="w-full">
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="secondary" size="lg">
              View Full Store
            </Button>
          </div>
        </div>
      </section>

    </GvtewayLayout>
  );
}
